---
title: Redis 缓存设计与穿透、击穿、雪崩应对
date: 2026-08-18
tags: [Redis]
description: 缓存穿透、击穿、雪崩的成因与应对:空值缓存、布隆过滤器、互斥重建、过期时间打散与多级缓存的完整方案。
---

# Redis 缓存设计与穿透、击穿、雪崩应对

## 问题背景

商品详情页接入缓存后,压测时 QPS 从 800 提到 6000,但随后的两次线上事故暴露出"有缓存"不等于"安全":

- 某次爬虫用不存在的商品 ID 批量请求,Redis 完全没命中,请求全部打到 MySQL,数据库 CPU 打满
- 一次大促前预热的一批热点 key 在同一分钟集中过期,瞬时 DB 流量是平时的 40 倍

这两类事故分别对应缓存使用的经典问题:**穿透**与**雪崩**(外加单 key 维度的**击穿**)。三个概念容易混,先区分清楚:

| 问题 | 发生位置 | 典型场景 |
| --- | --- | --- |
| 穿透 | 数据库中**不存在**的数据,缓存永远无法命中 | 恶意伪造 ID 攻击 |
| 击穿 | 某个**热点 key 过期**瞬间,大量并发直击 DB | 秒杀商品详情 |
| 雪崩 | **大量 key 同时失效**或 Redis 整体不可用 | 同批预热的缓存集中过期 |

## 核心原理与应对

### 穿透:不存在的请求挡在缓存层

**方案一:缓存空值。** 查 DB 不存在时,也往 Redis 写一个空标记(短过期,如 60s),后续相同请求直接返回:

```java
public Product getById(Long id) {
    String key = "product:" + id;
    String cached = redis.get(key);
    if (cached != null) {
        // 空标记与正常数据共用一个判断:约定 "" 表示不存在
        return "".equals(cached) ? null : JSON.parseObject(cached, Product.class);
    }
    Product db = productMapper.selectById(id);
    if (db == null) {
        redis.setex(key, 60, "");   // 空值缓存,短过期
        return null;
    }
    redis.setex(key, 300, JSON.toJSONString(db));
    return db;
}
```

局限:攻击者每次换随机 ID,空值缓存占内存且命中率低。

**方案二:布隆过滤器。** 启动时把全量合法 ID 载入布隆过滤器;请求先过过滤器,"不存在"的请求直接拒绝。特点是存在误判(说存在的可能不存在)但绝不会漏判,内存占用极小,适合 ID 集合相对固定的场景。

### 击穿:热点 key 过期瞬间的互斥重建

核心思路是**只放一个请求去查库重建缓存**,其余请求等待:

```java
public Product getByIdWithLock(Long id) {
    String key = "product:" + id;
    Product product = getFromCache(key);
    if (product != null) {
        return product;
    }
    String lockKey = "lock:product:" + id;
    // 拿到分布式锁的请求才去查库;未拿到的短暂等待后重读缓存
    if (redis.setIfAbsent(lockKey, "1", Duration.ofSeconds(10))) {
        try {
            product = productMapper.selectById(id);
            redis.setex(key, 300, JSON.toJSONString(product));
        } finally {
            redis.delete(lockKey);
        }
        return product;
    }
    sleep(50);
    return getFromCache(key);   // 重读,此时大概率已被重建
}
```

更简单的替代:热点 key 设置**不过期**,由后台任务定时主动刷新,把过期瞬间从链路上消除。

### 雪崩:打散过期时间 + 多级兜底

- **过期时间加随机抖动**:`300 + random(60)` 秒,避免同批 key 集中失效
- **多级缓存**:本地缓存(Caffeine)挡在最前面,Redis 故障时本地仍能扛住部分流量
- **熔断降级**:DB 前加限流,缓存层故障时返回兜底数据而不是压垮数据库
- **高可用**:Redis 主从 + 哨兵/集群,避免整体不可用导致的终极雪崩

## 常见问题

**1. 缓存与数据库的一致性怎么保证**

推荐 Cache Aside:更新时**先更新 DB,再删除缓存**(而不是更新缓存)。删除失败用消息队列重试;对一致性要求高的场景,用 binlog 订阅(Canal)异步删除,把延迟控制到秒级。

**2. 空值缓存会不会污染内存**

会,所以要设置短过期并限制空值数量;配合布隆过滤器可以把空值写入量降一个量级。

**3. 过期时间抖动要加多少**

经验值为基础 TTL 的 10%~20%。关键原则:同一批写入的 key 不要共享完全相同的过期时间。

## 总结

- 穿透挡"不存在的请求":空值缓存 + 布隆过滤器
- 击穿保"单个热点 key":互斥重建或逻辑不过期
- 雪崩防"大面积失效":过期打散 + 多级缓存 + 熔断降级 + Redis 高可用
- 一致性用 Cache Aside(先更库后删缓存),兜底靠异步重试

这三类问题的共同点是:**缓存层的任何设计,最终都要回答"缓存失效时数据库能不能扛住"**。带着这个问题做设计,方案就不会跑偏。

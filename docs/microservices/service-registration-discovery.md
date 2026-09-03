---
title: 微服务架构中的服务注册与发现机制
date: 2026-08-05
tags: [微服务, Spring]
description: 服务注册与发现要解决什么:Nacos 与 Eureka 的 AP/CP 取舍、心跳与剔除机制、客户端负载均衡的完整链路。
---

# 微服务架构中的服务注册与发现机制

## 问题背景

单体应用拆成微服务后,第一个遇到的基础设施问题就是:**服务 A 想调用服务 B,B 的地址是多少?**

写死 IP 配置显然不行——实例会扩缩容、会宕机重启、会滚动发布换 Pod IP。服务注册与发现就是为了把这个"找地址"的过程自动化:

- 服务启动时把自己的地址登记到注册中心(**注册**)
- 调用方从注册中心拉取可用实例列表(**发现**)
- 实例宕机后被自动摘除,新实例被自动加入(**健康检查**)

## 核心原理

### 注册中心的核心模型

本质上注册中心维护的是一张表:`服务名 → [实例列表(ip、port、元数据、健康状态)]`。围绕这张表有三个关键机制:

1. **注册**:实例启动时主动上报(register),同时携带元数据(版本号、权重、机房)
2. **健康检查**:定时心跳(renew)证明自己活着;超时未续约被标记下线(evict)
3. **订阅推送**:调用方订阅服务变更,实例上下线时推送最新列表(notify)

### AP 与 CP 的取舍

这是选型时绕不开的问题,以两个代表为例:

| 维度 | Eureka(AP) | Nacos(AP/CP 可切换,默认 AP) |
| --- | --- | --- |
| 一致性模型 | 对等节点间异步复制,可能短暂不一致 | Distro 协议(AP)/ Raft(CP) |
| 可用性优先 | 注册中心挂一半仍可用,列表可能过期 | 同样支持 |
| 场景建议 | 内部服务调用,容忍短暂脏读 | 需要配置中心 + 服务发现一体化时 |

内部服务调用通常选 AP:宁可拿到一个已经下线的实例(由调用方重试兜底),也不要为了强一致让整个服务发现不可用。**真正需要 CP 的是持久化服务、DNS 类场景**,这时用 Nacos 的 Raft 模式或 K8s 原生 Service。

### 心跳与保护机制

- Eureka 默认 30s 一次心跳,90s 未续约剔除;开启自我保护模式后,短时间内丢失大量心跳时**不再剔除**(防止网络分区误杀),代价是可能返回已死实例
- Nacos 临时实例走客户端心跳(5s 一次,15s 未收到标记不健康,30s 剔除);持久化实例走服务端主动探测

## 实现方式:Spring Cloud Alibaba 实践

依赖与配置:

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

```yaml
spring:
  application:
    name: order-service          # 服务名即发现时的 key
  cloud:
    nacos:
      discovery:
        server-addr: 127.0.0.1:8848
        namespace: dev           # 环境隔离
        group: DEFAULT_GROUP
```

服务发现与调用(OpenFeign 基于服务名做负载均衡):

```java
// 声明式调用:name 即注册中心里的服务名
@FeignClient(name = "stock-service")
public interface StockClient {

    @GetMapping("/api/stock/deduct")
    Boolean deduct(@RequestParam("skuId") Long skuId, @RequestParam("count") Integer count);
}

// 使用时与本地方法无异,底层自动完成:服务发现 → 客户端负载均衡 → HTTP 调用
@Service
public class OrderService {

    @Resource
    private StockClient stockClient;

    public void createOrder(Order order) {
        Boolean ok = stockClient.deduct(order.getSkuId(), order.getCount());
        if (!Boolean.TRUE.equals(ok)) {
            throw new BizException("库存不足");
        }
    }
}
```

## 常见问题

**1. 调用方拿到了刚下线的实例怎么办**

注册中心列表有传播延迟,这是 AP 系统的固有代价。兜底手段:调用方配置合理的重试与超时(Feign + Ribbon/LoadBalancer),配合熔断(Fallback);发布时先摘流量再停机,而不是直接 kill。

**2. 多环境服务串了**

用 namespace(环境)+ group(业务分组)隔离;跨环境调用必须在网关层显式控制,不要靠实例列表裸互通。

**3. 生产要不要开 Eureka 自我保护**

网络稳定的环境建议开启,避免网络抖动误杀全部实例;但要有监控兜底,发现大量实例进入保护状态时先查网络而不是重启注册中心。

## 总结

- 注册与发现 = 注册 + 健康检查 + 订阅推送,本质是维护一张可用的实例表
- AP/CP 的选择取决于业务容忍度:内部调用选 AP,配合重试熔断兜底
- 下线延迟无法消除,只能靠重试、熔断、优雅下标把影响降到最低
- 环境隔离靠 namespace/group,不要依赖人为约定

踩过一次"发布后调用方持续报连接拒绝"的坑之后,我才真正理解"注册中心的一致性模型"不是面试八股,而是每天都在发生作用的设计决策。

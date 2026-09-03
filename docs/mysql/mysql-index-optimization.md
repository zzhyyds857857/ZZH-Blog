---
title: MySQL 索引原理与慢查询优化实践
date: 2026-07-06
tags: [MySQL]
description: 从 B+ 树结构到 EXPLAIN 实战:理解回表、覆盖索引与最左前缀,梳理常见索引失效场景与慢查询优化路径。
---

# MySQL 索引原理与慢查询优化实践

## 问题背景

项目里一张订单表涨到千万级之后,原来毫秒级的管理后台查询开始频繁超时。DBA 拉出来的慢日志里,Top 3 全是同一类查询:按用户 + 状态 + 时间范围筛选订单。加索引之前,先把几个基础问题想清楚:

- 为什么 InnoDB 选择 B+ 树,而不是哈希表或红黑树?
- 为什么加了索引查询还是慢?
- 拿到一条慢 SQL,标准的分析路径是什么?

## 核心原理

### 为什么是 B+ 树

B+ 树是一种多路平衡搜索树,InnoDB 默认一个节点大小为 16KB(一页)。以 8 字节主键 + 6 字节指针估算,一个非叶子节点可以放约 1200 个索引项;三层 B+ 树就能索引约 2000 万行数据,而一次查询最多只需要 3 次磁盘 IO。

对比其他结构:

| 结构 | 问题 |
| --- | --- |
| 哈希表 | 不支持范围查询与排序,哈希冲突需处理 |
| 红黑树 | 二叉,千万级数据树高达 20+ 层,磁盘 IO 次数过多 |
| B 树 | 数据存所有节点,非叶子节点容纳的索引项更少,树更高 |

### 聚簇索引与回表

InnoDB 是索引组织表,主键索引的叶子节点直接存放整行数据(聚簇索引);二级索引的叶子节点存放的是"索引列 + 主键值"。

因此通过二级索引查询非索引列时,需要先在二级索引中拿到主键,再回聚簇索引查整行——这就是**回表**。回表次数多时,即使走了索引也可能比全表扫描还慢。

### 最左前缀

联合索引 `(a, b, c)` 相当于按 a 排序、a 相同时按 b 排序、b 相同时按 c 排序。所以:

- `where a = ? and b = ?` ✓ 命中
- `where b = ? and c = ?` ✗ 缺少最左列,不命中
- `where a = ? and c = ?` 只用到 a,c 无法走索引(区间断裂)

## 实现方式:慢查询分析路径

拿到慢 SQL 后,我的固定分析流程:

1. `EXPLAIN` 看执行计划,重点四列:`type`、`key`、`rows`、`Extra`
2. 确认 `type` 至少达到 `range`,出现 `ALL` 说明全表扫描
3. `Extra` 中出现 `Using filesort` / `Using temporary` 优先解决
4. 估算回表代价,评估是否改造为覆盖索引

## 代码示例

订单表的结构与优化过程:

```sql
CREATE TABLE `orders` (
  `id`         BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id`    BIGINT NOT NULL,
  `status`     TINYINT NOT NULL,
  `amount`     DECIMAL(10,2) NOT NULL,
  `created_at` DATETIME NOT NULL,
  KEY `idx_user_status` (`user_id`, `status`)
) ENGINE = InnoDB;
```

典型慢查询与优化:

```sql
-- 优化前:按 status + 时间范围查询,联合索引用不上
SELECT id, amount, created_at FROM orders
WHERE status = 1 AND created_at >= '2026-06-01';

-- 第一步:建立匹配查询模式的联合索引(等值列在前,范围列在后)
ALTER TABLE orders ADD INDEX idx_status_created (status, created_at);

-- 第二步:消除回表,把查询列并入索引形成覆盖索引
ALTER TABLE orders ADD INDEX idx_status_created_amount (status, created_at, amount);
```

用 `EXPLAIN` 验证效果:

```sql
EXPLAIN SELECT id, amount, created_at FROM orders
WHERE status = 1 AND created_at >= '2026-06-01';
-- type: range, key: idx_status_created_amount
-- Extra: Using index  ← 覆盖索引,无回表
```

## 常见问题

**1. 索引失效的典型场景**

- 对索引列做函数或运算:`where DATE(created_at) = ...`(应改写为范围查询)
- 隐式类型转换:`user_id` 是 VARCHAR 却用 `where user_id = 12345` 查询
- 前导模糊匹配:`like '%手机'` 无法走索引,`like '手机%'` 可以
- `or` 两侧有一个无索引列,整体放弃索引

**2. 为什么建议自增主键**

有序主键保证新行总是追加到 B+ 树最右侧,避免页分裂;使用 UUID 作主键会导致随机写入,大量页分裂与碎片,写入性能明显下降。

**3. 索引是不是越多越好**

不是。每个索引都是一棵独立的 B+ 树,写入时要同步维护所有索引;优化器面对更多索引,选错执行计划的可能性也变大。单表索引建议控制在合理数量内,优先改造现有联合索引而不是持续新增。

## 总结

- B+ 树三层即可支撑千万级数据,索引设计的本质是控制树高与减少回表
- 联合索引遵循最左前缀,等值列在前、范围列在后
- 覆盖索引是消除回表最有效的手段,`Extra: Using index` 是直接信号
- 慢查询优化的固定路径:EXPLAIN → 看访问类型 → 查回表与排序 → 改索引或改写 SQL

优化订单表那三条慢查询后,接口平均耗时从 2.3s 降到 20ms 以内。这件事给我的最大启发是:先理解原理,再动手加索引,比反复试错高效得多。

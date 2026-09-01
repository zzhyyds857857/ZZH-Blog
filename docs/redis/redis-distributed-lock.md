---
title: 深入解析 Redis 分布式锁与 Redlock
date: 2026-08-30
tags: [Redis, 分布式]
description: 从单节点 SET NX PX 到 Redlock:Redis 分布式锁的问题、原理、实现与常见坑。
---

# 深入解析 Redis 分布式锁与 Redlock

## 问题

单机应用内的 `synchronized` / `ReentrantLock` 只能保护单个 JVM 进程内的临界区。当服务水平扩容为多实例后,多个进程会同时进入"同一个"临界区,例如:

- 定时任务在多个实例上重复执行
- 扣减库存出现超卖
- 缓存重建出现缓存击穿

我们需要一个**跨进程的互斥机制**,这就是分布式锁。

## 背景

分布式锁的常见实现有三类:

| 实现 | 核心依赖 | 特点 |
| --- | --- | --- |
| Redis | `SET NX PX` | 性能高,AP 语义,实现简单 |
| ZooKeeper | 临时顺序节点 | CP 语义,可靠性高,吞吐较低 |
| etcd | Lease + 事务 | CP 语义,K8s 生态常用 |

Redis 方案因性能和运维成本优势,成为绝大多数业务场景的首选。

## 原理

最简实现是一条原子命令:

```bash
SET lock:order:1001 <token> NX PX 30000
```

- `NX`:key 不存在才写入,保证互斥
- `PX 30000`:30 秒后自动过期,防止持有者宕机后死锁
- `<token>`:唯一值(如 UUID),保证"谁加锁谁释放"

释放锁必须用 Lua 脚本保证"判断 + 删除"的原子性:

```lua
if redis.call('GET', KEYS[1]) == ARGV[1] then
  return redis.call('DEL', KEYS[1])
else
  return 0
end
```

## 实现

基于 Spring Data Redis 的封装:

```java
@Component
public class RedisLock {

    private static final String UNLOCK_SCRIPT =
        "if redis.call('GET', KEYS[1]) == ARGV[1] then " +
        "  return redis.call('DEL', KEYS[1]) " +
        "else return 0 end";

    private final StringRedisTemplate redis;

    public RedisLock(StringRedisTemplate redis) {
        this.redis = redis;
    }

    public String lock(String key, Duration ttl) {
        String token = UUID.randomUUID().toString();
        Boolean ok = redis.opsForValue()
                .setIfAbsent(key, token, ttl);
        return Boolean.TRUE.equals(ok) ? token : null;
    }

    public boolean unlock(String key, String token) {
        Long result = redis.execute(
            new DefaultRedisScript<>(UNLOCK_SCRIPT, Long.class),
            List.of(key), token);
        return result != null && result == 1;
    }
}
```

## 验证

用两个线程模拟两个实例竞争同一把锁:

```java
@Test
void shouldAcquireOnlyOnce() throws Exception {
    CountDownLatch latch = new CountDownLatch(2);
    AtomicInteger success = new AtomicInteger();

    Runnable task = () -> {
        String token = redisLock.lock("lock:test", Duration.ofSeconds(10));
        if (token != null) {
            success.incrementAndGet();
            try { Thread.sleep(500); } finally { redisLock.unlock("lock:test", token); }
        }
        latch.countDown();
    };

    new Thread(task).start();
    new Thread(task).start();
    latch.await();

    assertEquals(1, success.get());
}
```

## 常见坑

1. **忘记设置过期时间**:持有者宕机后锁永不释放,形成死锁。
2. **用 `DEL` 直接释放**:可能误删其他持有者的锁,必须带 token 校验。
3. **业务超时长于锁 TTL**:锁过期后被其他实例获取,可以通过"看门狗"续期(Redisson 的 watchdog 就是这个思路)。
4. **主从切换丢锁**:master 写入锁后宕机,尚未同步到 slave,新 master 上锁已丢失。对正确性要求极高的场景,需要 Redlock。

## 总结

- 单实例 Redis 锁:`SET NX PX` + Lua 释放,覆盖 90% 的业务场景。
- 需要自动续期:引入 Redisson 看门狗。
- 对锁的正确性要求极高(如资金):评估 Redlock 或改用 ZooKeeper/etcd,而不是硬扛 Redis 的主从切换窗口。

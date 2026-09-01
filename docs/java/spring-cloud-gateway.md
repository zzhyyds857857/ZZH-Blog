---
title: Spring Cloud Gateway 入门与实践
date: 2026-08-21
tags: [Spring, 微服务]
description: 网关的职责、路由与过滤器模型,以及一个可运行的最小 Gateway 配置示例。
---

# Spring Cloud Gateway 入门与实践

## 问题

微服务数量增多后,客户端直接调用各服务会带来一系列问题:

- 鉴权、限流、日志等横切逻辑在每个服务中重复实现
- 前端需要感知每个服务的地址与端口
- 内部服务直接暴露在公网,存在安全隐患

网关(Gateway)就是为解决这些问题而生的统一入口。

## 背景

Spring Cloud Gateway 基于 Spring WebFlux 与 Reactor 构建,是响应式非阻塞模型,区别于第一代 Zuul 1.x 的阻塞 IO。

## 原理

Gateway 的核心模型只有三个概念:

```text
Request
  ↓
Route(断言 Predicate 匹配)
  ↓
Filter Chain(pre → 转发 → post)
  ↓
Target Service
```

- **Route**:由 id、目标 URI、一组 Predicate 和一组 Filter 组成
- **Predicate**:决定请求是否命中该路由(路径、Header、方法等)
- **Filter**:在转发前后修改请求/响应(鉴权、改写路径、限流等)

## 实践

最小可运行的依赖与配置:

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/user/**
          filters:
            - StripPrefix=1
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10
                redis-rate-limiter.burstCapacity: 20
```

自定义全局鉴权过滤器:

```java
@Component
public class AuthFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -100;
    }
}
```

## 验证

```bash
# 未携带 token,应返回 401
curl -i http://localhost:8080/api/user/1

# 携带 token,应转发到 user-service 并返回 200
curl -i -H "Authorization: Bearer eyJhbGciOi..." http://localhost:8080/api/user/1
```

## 总结

- 网关统一收口横切逻辑,业务服务保持纯粹。
- Gateway 是响应式模型,不要在过滤器里写阻塞代码。
- 路由配置支持从配置中心(如 Nacos)动态刷新,生产环境建议走配置中心而不是本地 yaml。

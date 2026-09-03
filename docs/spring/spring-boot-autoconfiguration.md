---
title: Spring Boot 自动配置原理深入解析
date: 2026-07-18
tags: [Spring, Java]
description: 从 @SpringBootApplication 到条件注解:拆解自动配置的加载流程、SPI 机制与自定义 Starter 的完整实现。
---

# Spring Boot 自动配置原理深入解析

## 问题背景

刚接触 Spring Boot 时最困惑的一点:没有写任何 XML,也没有大量 `@Bean` 配置,引入 `spring-boot-starter-data-redis` 之后 `RedisTemplate` 就能直接注入使用。这一切背后的机制就是**自动配置(Auto Configuration)**。理解它有三个实际收益:

- 排查"Bean 为什么没注入 / 为什么不是预期的实现类"这类问题
- 写公司内部的通用中间件 Starter,而不是每个项目复制粘贴配置类
- 面试高频题,值得系统性梳理一遍

## 核心原理

### 入口:@SpringBootApplication

它是一个组合注解,其中起关键作用的是 `@EnableAutoConfiguration`:

```java
@SpringBootConfiguration   // 本质是 @Configuration
@EnableAutoConfiguration   // 自动配置的开关
@ComponentScan             // 扫描主类所在包及子包
public @interface SpringBootApplication { }
```

### SPI 加载候选配置类

`@EnableAutoConfiguration` 通过 `@Import(AutoConfigurationImportSelector.class)` 触发选择逻辑。该 Selector 会从所有 jar 包的 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports`(Spring Boot 2.7 之前是 `spring.factories`)中读取全量候选配置类。

以 Redis 相关为例,这个文件里登记了 `RedisAutoConfiguration` 等一百多个配置类。**注意:加载 ≠ 生效**,每个配置类还要过条件注解的筛选。

### 条件注解:按需生效

自动配置类大量使用条件注解控制生效时机:

| 注解 | 生效条件 |
| --- | --- |
| `@ConditionalOnClass` | 类路径存在指定类 |
| `@ConditionalOnMissingBean` | 容器中不存在同类型 Bean(用户配置优先的关键) |
| `@ConditionalOnProperty` | 配置属性满足条件 |
| `@ConditionalOnWebApplication` | 当前是 Web 环境 |

这就是"约定优于配置"的底层逻辑:**框架只在用户没有自定义时提供默认实现**。这也是为什么我们自己定义一个 `RedisTemplate` 的 `@Bean` 后,自动配置的那份就不再注册。

### 配置属性绑定

`@EnableConfigurationProperties(RedisProperties.class)` 把 `spring.data.redis.*` 前缀的配置项绑定到属性对象上,自动配置类从属性对象读取 host、port 等值创建连接工厂。

## 实现方式:自定义一个 Starter

公司内部经常需要统一封装短信客户端。按 Starter 规范拆成两个模块:

- `xxx-sms-autoconfigure`:自动配置逻辑
- `xxx-sms-starter`:仅做依赖聚合

```java
// 1. 配置属性类
@ConfigurationProperties(prefix = "zzh.sms")
public class SmsProperties {
    private String appKey;
    private String endpoint = "https://sms.example.com"; // 提供默认值
    // getter / setter 省略
}

// 2. 自动配置类
@AutoConfiguration
@ConditionalOnClass(SmsClient.class)
@EnableConfigurationProperties(SmsProperties.class)
public class SmsAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean   // 允许用户覆盖
    public SmsClient smsClient(SmsProperties properties) {
        return new SmsClient(properties.getAppKey(), properties.getEndpoint());
    }
}
```

```
# 3. src/main/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
com.example.sms.SmsAutoConfiguration
```

业务方引入依赖后,只需在 `application.yml` 写 `zzh.sms.app-key=xxx` 即可注入 `SmsClient`。

## 常见问题

**1. 配置类为什么没有生效**

排查顺序:确认 jar 的 `AutoConfiguration.imports` 登记无误 → 确认条件注解(常见是 `@ConditionalOnClass` 的类没被引入)→ 确认没有在配置文件里通过 `spring.autoconfigure.exclude` 排除。

**2. 自动配置类和 @ComponentScan 的边界**

主类包扫描只覆盖主类所在包,自动配置解决的是**第三方 jar** 中类的注册问题。两者互补而不是替代。

**3. @ConditionalOnMissingBean 的顺序问题**

自动配置类通过 `@AutoConfiguration(before/after = ...)` 声明排序,保证其执行晚于用户配置类,这样"用户优先"的判断才有意义。自定义 Starter 时如果发现用户 Bean 被覆盖,优先检查排序声明。

## 总结

- 自动配置 = SPI 加载候选 + 条件注解过滤 + 属性绑定,三步缺一不可
- `@ConditionalOnMissingBean` 是"用户配置优先于默认实现"的关键
- 2.7+ 迁移到 `AutoConfiguration.imports`,排查老项目时注意版本差异
- 自定义 Starter 是把团队通用能力沉淀为基础设施的标准做法

理解这套机制之后,再回头看官方文档里"只需引入依赖即可使用"的描述,就知道背后发生了什么,也不再对"魔法"感到不安了。

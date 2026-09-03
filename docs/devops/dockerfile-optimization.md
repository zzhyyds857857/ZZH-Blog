---
title: Dockerfile 编写规范与镜像瘦身实践
date: 2026-08-25
tags: [DevOps, Docker]
description: 从分层原理到多阶段构建:Dockerfile 的编写规范、Spring Boot 应用镜像从 480MB 瘦身到 210MB 的完整过程。
---

# Dockerfile 编写规范与镜像瘦身实践

## 问题背景

把公司一个 Spring Boot 服务容器化时,第一次构建出的镜像有 480MB。CI 流水线里推镜像花了 4 分钟,K8s 滚动更新时每个节点拉镜像都要等半天。这篇文章记录后来系统学习分层原理、把镜像瘦身到 210MB 的过程,以及沉淀下来的 Dockerfile 编写规范。

## 核心原理:分层与构建上下文

### 镜像 = 只读层的堆叠

Docker 镜像由多个只读层堆叠而成,Dockerfile 里每条指令对应一层:

- `RUN`、`COPY`、`ADD` 会产生新层,层的内容会被永久保存
- 容器运行时的写入发生在最上层的可写层,不改变镜像

两个直接推论:

1. **层的顺序影响缓存效率**:变化频率低的指令放前面(如依赖安装),变化频繁的放最后(如代码复制)
2. **删除文件不会让镜像变小**:`RUN wget big.tar && rm big.tar` 是两层,rm 层只是遮住下层,镜像总量不变——必须在同一层内完成下载与清理

### .dockerignore 与构建上下文

`docker build .` 会把当前目录全部发给构建引擎(构建上下文)。没有 `.dockerignore` 时,`.git`、`node_modules`、日志文件都会被发送,既慢又容易把敏感信息打进镜像。Java 项目的最小配置:

```
.git
target
*.log
.idea
```

## 实现方式:Spring Boot 镜像瘦身

### 优化前的版本

```dockerfile
FROM openjdk:17
WORKDIR /app
COPY . .
RUN ./mvnw package -DskipTests
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "target/app.jar"]
```

问题:基础镜像是完整 JDK(带 JVM 工具链)、把整个构建上下文拷进镜像、构建工具留在最终层、依赖与代码没有分层。

### 优化后:多阶段构建 + 分层缓存

```dockerfile
# ---- 构建阶段:构建工具只存在于这一阶段 ----
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /build
COPY pom.xml .
# 先只拷 pom 并下载依赖:pom 不变时命中缓存,跳过依赖下载
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn package -DskipTests -B

# ---- 运行阶段:只保留 JRE 与产物 ----
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
USER app
COPY --from=builder /build/target/app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "app.jar"]
```

瘦身效果:

| 版本 | 大小 | CI 推镜像耗时 |
| --- | --- | --- |
| 优化前 | 480MB | 约 4 分钟 |
| 优化后(JRE-alpine + 多阶段) | 210MB | 约 90 秒 |

## 常见问题

**1. 为什么用 JRE 而不是 JDK 做运行镜像**

运行阶段只需要 JVM,不需要编译器与调试工具。JDK 镜像比 JRE 大一倍以上,且攻击面更大。需要现场排障时,用 `eclipse-temurin:17-jdk` 临时起一个 sidecar 即可。

**2. 该不该用 latest 标签的基础镜像**

不要。基础镜像必须固定具体版本(如 `eclipse-temurin:17.0.10_7-jre-alpine`),否则某次 CI 重建镜像时基础层悄悄升级,应用可能出现难以复现的行为变化。升级基础镜像应该是显式的、可回滚的操作。

**3. 容器里的 Java 内存参数怎么配**

容器内 Java 8u191+/10+ 能感知 cgroup 限制,建议用 `-XX:MaxRAMPercentage=75.0` 按容器内存比例设置堆上限,而不是写死 `-Xmx`,这样同一镜像可以跑在不同规格的 Pod 里。

**4. ENTRYPOINT 和 CMD 的区别**

`ENTRYPOINT` 是固定的主命令,`CMD` 是默认参数(可被 `docker run` 参数覆盖)。Java 应用固定用 `ENTRYPOINT ["java", "-jar", ...]`,需要透传启动参数时追加到 CMD。

## 总结

- 多阶段构建让编译工具与产物分离,是瘦身的最大单笔收益
- 依赖与代码分层 COPY,把高频变化的指令放到最后,充分利用构建缓存
- `.dockerignore` 是必写项,既提速也防敏感信息泄露
- 固定基础镜像版本,让每一次构建可复现

镜像从 480MB 到 210MB 这件事,单独看每一步都很简单,价值在于形成"层是有成本的"这个直觉——写 Dockerfile 时每加一条指令,都值得想一下它会产生一个什么样的层。

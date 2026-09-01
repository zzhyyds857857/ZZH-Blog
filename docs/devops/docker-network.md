---
title: Docker 网络模式详解与排障
date: 2026-08-12
tags: [Docker, DevOps]
description: bridge/host/none/overlay 四种网络模式的原理、容器互通方式与一次典型的连通性排障。
---

# Docker 网络模式详解与排障

## 问题

容器之间 ping 不通、容器访问宿主机服务失败、宿主机无法访问容器端口——这类"网络不通"是使用 Docker 时最常见的问题类别。理解 Docker 的网络模型是排查这类问题的基础。

## 背景

Docker 通过 Linux 网络命名空间(Network Namespace)、veth pair 与 iptables 实现容器网络隔离与互通。安装 Docker 后默认会创建三种网络:

```bash
docker network ls
# NETWORK ID     NAME      DRIVER    SCOPE
# xxxxxxx        bridge    bridge    local
# xxxxxxx        host      host      local
# xxxxxxx        none      null      local
```

## 原理

四种常见网络模式:

| 模式 | 说明 | 典型场景 |
| --- | --- | --- |
| `bridge` | 默认模式,容器接入 docker0 网桥,NAT 出网 | 单机多容器互通 |
| `host` | 容器直接使用宿主机网络栈 | 对网络性能敏感的服务 |
| `none` | 只有 lo,无网络 | 离线任务、安全隔离 |
| `overlay` | 跨主机 VXLAN 网络 | Docker Swarm / K8s 集群 |

bridge 模式下容器访问宿主机服务的正确地址:

```bash
# 容器内访问宿主机,使用 docker0 网桥地址(通常是 172.17.0.1)
curl http://172.17.0.1:8080
# 或使用宿主机在局域网内的真实 IP
```

## 实践

创建自定义 bridge 网络并让两个容器互通:

```bash
docker network create app-net

docker run -d --name mysql --network app-net \
  -e MYSQL_ROOT_PASSWORD=secret mysql:8

docker run -d --name app --network app-net \
  my-spring-app:latest
```

自定义网络中容器可以通过**容器名**互相访问(Docker 内置 DNS),默认 `bridge` 网络不支持:

```bash
# app 容器内
jdbc:mysql://mysql:3306/appdb
```

## 验证

一次典型排障过程:

```bash
# 1. 确认两个容器在同一网络
docker network inspect app-net

# 2. 进入容器检查 DNS 解析
docker exec -it app sh
ping mysql

# 3. 检查端口监听是否绑定在 0.0.0.0 而不是 127.0.0.1
netstat -tlnp | grep 3306

# 4. 检查 iptables 是否有 DROP 规则
iptables -L -n | head -30
```

## 常见坑

1. 服务监听 `127.0.0.1` 导致宿主机端口映射后无法访问,应监听 `0.0.0.0`。
2. 使用默认 bridge 网络却尝试用容器名互访,内置 DNS 不生效。
3. 大量容器场景下忘记自定义网络,导致依赖被重启后 IP 变化而失联。

## 总结

- 单机用自定义 bridge 网络 + 容器名互访。
- 追求网络性能用 host 模式,但要接受端口冲突与隔离性下降。
- 排障顺序:网络归属 → DNS → 监听地址 → iptables。

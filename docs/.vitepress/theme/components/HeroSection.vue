<script setup lang="ts">
import { withBase } from 'vitepress'
</script>

<template>
  <!-- Hero 克制原则:标题 + 副标题 + 一行定位 + 按钮,不加浅灰小字 -->
  <section class="hero">
    <h1 class="hero-title">欢迎来到我的个人博客</h1>
    <p class="hero-subtitle">技术分享与成长记录</p>
    <p class="hero-description">专注于 Java 后端、微服务与全栈开发</p>
    <div class="hero-actions">
      <a class="hero-btn hero-btn-solid" :href="withBase('/posts/')">浏览文章</a>
      <a class="hero-btn hero-btn-outline" :href="withBase('/about.html')">关于我</a>
    </div>
  </section>
</template>

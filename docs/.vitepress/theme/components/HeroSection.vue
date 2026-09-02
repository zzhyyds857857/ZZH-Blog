<script setup lang="ts">
import { withBase } from 'vitepress'
</script>

<template>
  <section class="hero">
    <h1 class="hero-title">个人博客 · 技术分享与成长记录</h1>
    <p class="hero-description">
      记录 Java 后端、微服务、前端与全栈开发的学习、实践与思考。
    </p>
    <div class="hero-actions">
      <a class="hero-btn hero-btn-solid" :href="withBase('/posts/')">浏览文章</a>
      <a class="hero-btn hero-btn-outline" :href="withBase('/about')">关于我</a>
    </div>
  </section>
</template>

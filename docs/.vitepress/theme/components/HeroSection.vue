<script setup lang="ts">
import { withBase } from 'vitepress'
</script>

<template>
  <section class="hero">
    <h1 class="hero-title">欢迎来到我的技术博客</h1>
    <p class="hero-description">
      这里记录我对技术的探索,<br class="hero-line-break" />
      也记录学习、实践与成长的点点滴滴。<br class="hero-line-break" />
      从 Java 后端、微服务,到前端与全栈开发,<br class="hero-line-break" />
      把踩过的坑、做过的项目与思考慢慢沉淀下来。
    </p>
    <div class="hero-actions">
      <a class="hero-btn hero-btn-solid" :href="withBase('/posts/')">浏览文章</a>
      <a class="hero-btn hero-btn-outline" :href="withBase('/about')">关于我</a>
    </div>
    <p class="hero-tags">Java 后端 · 微服务 · Redis · 数据库 · 前端探索</p>
    <p class="hero-motto">持续记录 · 持续实践 · 持续成长</p>
  </section>
</template>

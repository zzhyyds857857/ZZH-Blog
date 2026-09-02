<script setup lang="ts">
import { withBase } from 'vitepress'
</script>

<template>
  <section class="hero">
    <h1 class="hero-title">欢迎来到我的技术博客</h1>
    <p class="hero-description">
      这里记录着我对技术的热爱与探索,<br class="hero-line-break" />
      也记录一路学习、实践与成长的点点滴滴。<br class="hero-line-break" />
      无论是踩坑经历,还是心得体会,<br class="hero-line-break" />
      都希望能给你带来一些启发。
    </p>
    <div class="hero-actions">
      <a class="hero-btn hero-btn-solid" :href="withBase('/posts/')">浏览文章</a>
      <a class="hero-btn hero-btn-outline" :href="withBase('/about')">关于我</a>
    </div>
  </section>
</template>

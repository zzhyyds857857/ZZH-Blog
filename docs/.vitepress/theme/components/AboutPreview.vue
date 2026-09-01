<script setup lang="ts">
import { withBase } from 'vitepress'
</script>

<template>
  <section class="about-preview home-section">
    <header class="section-header">
      <h2 class="section-title">关于我</h2>
    </header>
    <p class="about-preview-text">
      广东理工学院 · 网络工程 · 2028 届。
      从 Java 后端出发,逐渐补齐前端,记录真实学习、项目实践和技术成长。
    </p>
    <a class="about-preview-link" :href="withBase('/about')">了解更多 →</a>
  </section>
</template>

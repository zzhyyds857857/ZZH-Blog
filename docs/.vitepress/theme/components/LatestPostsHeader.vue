<script setup lang="ts">
import { withBase } from 'vitepress'
</script>

<template>
  <!-- 首页"最新文章"标题行:独立于两栏 Grid 之外全宽渲染,
       使左右两列的卡片顶部在 Grid 中严格对齐 -->
  <header class="section-header home-latest-header">
    <h2 class="section-title">最新文章</h2>
    <a class="view-all" :href="withBase('/posts/')">查看全部 →</a>
  </header>
</template>

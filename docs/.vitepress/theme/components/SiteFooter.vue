<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <p class="site-footer-brand">ZZH-Blog</p>
    <p class="site-footer-main">记录技术学习与成长。</p>
    <p class="site-footer-sub">
      © {{ year }} ZZH-Blog ·
      <a href="https://github.com/zzhyyds857857" target="_blank" rel="noopener noreferrer">GitHub</a>
      · 使用 VitePress 构建 · 部署于 GitHub Pages
    </p>
  </footer>
</template>

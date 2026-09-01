<script setup lang="ts">
import { withBase } from 'vitepress'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <p class="site-footer-main">ZZH-Blog · 记录学习 · 分享技术 · 持续成长</p>
    <p class="site-footer-sub">
      © {{ year }} ZZH ·
      <a :href="withBase('/rss.xml')">RSS</a> ·
      <a href="https://github.com/zzhyyds857857" target="_blank" rel="noopener noreferrer">GitHub</a>
      · 由 VitePress 驱动
    </p>
  </footer>
</template>

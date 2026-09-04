<script setup lang="ts">
import { withBase, useData } from 'vitepress'

// 学习随笔详情页头部:返回入口 + 标题 + 日期(信息来自笔记 frontmatter)
const { frontmatter } = useData()

function formatDate(date: unknown): string {
  const d = new Date(String(date))
  if (Number.isNaN(d.getTime())) return ''
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}.${month}.${day}`
}
</script>

<template>
  <div class="note-detail-head">
    <a class="note-back-link" :href="withBase('/notes/')">← 学习随笔</a>
    <h1 class="note-detail-title">{{ frontmatter.title }}</h1>
    <p v-if="frontmatter.date" class="note-detail-date">{{ formatDate(frontmatter.date) }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as notes } from '../notes.data'

// 学习随笔列表:按年份分组的时间线,与普通文章列表(分类过滤)形成产品定位差异
const groups = computed(() => {
  const map = new Map<string, typeof notes>()
  for (const note of notes) {
    const year = note.dateText.slice(0, 4)
    const list = map.get(year) ?? []
    list.push(note)
    map.set(year, list)
  }
  return [...map.entries()].map(([year, items]) => ({ year, items }))
})
</script>

<template>
  <section class="notes-page">
    <h1 class="page-title">学习随笔</h1>
    <p class="page-subtitle">记录最近的学习、开发、踩坑、思考与阶段性总结。正式的知识整理在「文章」,这里记录正在经历的学习过程。</p>

    <div v-for="group in groups" :key="group.year" class="note-timeline-group">
      <h2 class="note-timeline-year">{{ group.year }}</h2>
      <ul class="note-timeline">
        <li v-for="note in group.items" :key="note.url" class="note-entry">
          <a class="note-card" :href="withBase(note.url)">
            <span class="note-card-date">{{ note.dateText }}</span>
            <span class="note-card-title">{{ note.title }}</span>
            <span v-if="note.description" class="note-card-desc">{{ note.description }}</span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

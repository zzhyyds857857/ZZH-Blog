<script setup lang="ts">
import { withBase } from 'vitepress'
import { data as notes } from '../notes.data'

withDefaults(defineProps<{ limit?: number }>(), { limit: 3 })
</script>

<template>
  <section class="latest-notes home-section">
    <header class="section-header">
      <div>
        <h2 class="section-title">学习随笔</h2>
        <p class="section-subtitle">记录最近的学习、开发、踩坑和思考。</p>
      </div>
      <a class="view-all" :href="withBase('/notes/')">查看全部 →</a>
    </header>
    <ul class="note-list">
      <li v-for="note in notes.slice(0, limit)" :key="note.url" class="note-item">
        <a class="note-item-link" :href="withBase(note.url)">
          <span class="note-date">{{ note.dateShort }}</span>
          <span class="note-title">{{ note.title }}</span>
          <span v-if="note.description" class="note-desc">{{ note.description }}</span>
        </a>
      </li>
    </ul>
  </section>
</template>

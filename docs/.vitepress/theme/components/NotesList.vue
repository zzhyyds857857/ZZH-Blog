<script setup lang="ts">
import { withBase } from 'vitepress'
import { data as notes } from '../notes.data'
</script>

<template>
  <section class="notes-page">
    <h1 class="page-title">学习随笔</h1>
    <p class="page-subtitle">记录最近的学习、开发、踩坑和思考。正式的知识整理在「文章」,这里记录正在经历的学习过程。</p>
    <ul class="note-list">
      <li v-for="note in notes" :key="note.url" class="note-item">
        <a class="note-item-link" :href="withBase(note.url)">
          <span class="note-date">{{ note.dateText }}</span>
          <span class="note-title">{{ note.title }}</span>
          <span v-if="note.description" class="note-desc">{{ note.description }}</span>
        </a>
      </li>
    </ul>
  </section>
</template>

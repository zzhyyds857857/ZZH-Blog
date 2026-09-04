<script setup lang="ts">
import { withBase } from 'vitepress'
import { data as notes } from '../notes.data'
</script>

<template>
  <!-- 学习随笔列表:纯便签卡片列表,不做时间轴 -->
  <section class="notes-page">
    <h1 class="page-title">学习随笔</h1>
    <p class="page-subtitle">记录最近的学习、开发、踩坑、思考与阶段性总结。正式的知识整理在「文章」,这里记录正在经历的学习过程。</p>

    <div class="notes-sheet">
      <ul class="note-sheet-list">
        <li v-for="note in notes" :key="note.url" class="note-sheet-item">
          <a class="note-sheet" :href="withBase(note.url)">
            <span class="note-sheet-date">{{ note.dateText }}</span>
            <span class="note-sheet-title">{{ note.title }}</span>
            <span v-if="note.description" class="note-sheet-desc">{{ note.description }}</span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

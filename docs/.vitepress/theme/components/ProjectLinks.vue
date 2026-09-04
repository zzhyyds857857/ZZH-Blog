<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { projects } from '../data/projects'

// 侧栏精选项目:只展示名称与定位,点击进入项目页
const featured = computed(() => projects.filter((project) => project.featured))
</script>

<template>
  <section class="side-card project-card-side">
    <h2 class="side-card-title">精选项目</h2>
    <ul class="project-link-list">
      <li v-for="project in featured" :key="project.name">
        <a class="project-link-item" :href="withBase('/projects.html')">
          <span class="project-link-name">{{ project.name }}</span>
          <span class="project-link-desc">{{ project.positioning }}</span>
        </a>
      </li>
    </ul>
  </section>
</template>

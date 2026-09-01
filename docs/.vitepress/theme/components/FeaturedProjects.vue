<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { projects } from '../data/projects'
import ProjectCard from './ProjectCard.vue'

const featured = computed(() => projects.filter((project) => project.featured))
</script>

<template>
  <section class="featured-projects home-section">
    <header class="section-header">
      <h2 class="section-title">精选项目</h2>
      <a class="view-all" :href="withBase('/projects')">查看全部</a>
    </header>
    <div class="project-grid">
      <ProjectCard
        v-for="project in featured"
        :key="project.name"
        :name="project.name"
        :positioning="project.positioning"
        :description="project.description"
        :tags="project.tags"
        :github="project.github"
        :status="project.status"
      />
    </div>
  </section>
</template>

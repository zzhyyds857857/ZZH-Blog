<script setup lang="ts">
import { computed } from 'vue'
import { projects } from '../data/projects'
import ProjectCard from './ProjectCard.vue'

// 学习项目与个人项目分组展示,禁止混淆项目性质(v3 #3)
const groups = computed(() => {
  const study = projects.filter((project) => project.category === 'Study')
  const personal = projects.filter((project) => project.category === 'Personal')
  return [
    { title: '学习项目', list: study },
    { title: '个人项目', list: personal }
  ].filter((group) => group.list.length > 0)
})
</script>

<template>
  <section class="projects-page">
    <h1 class="page-title">项目</h1>
    <template v-for="group in groups" :key="group.title">
      <h2 class="project-group-title">{{ group.title }}</h2>
      <div class="project-grid">
        <ProjectCard
          v-for="project in group.list"
          :key="project.name"
          :name="project.name"
          :positioning="project.positioning"
          :description="project.description"
          :tags="project.tags"
          :github="project.github"
          :status="project.status"
        />
      </div>
    </template>
  </section>
</template>

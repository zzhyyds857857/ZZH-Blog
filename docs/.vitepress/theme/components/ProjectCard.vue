<script setup lang="ts">
defineProps<{
  name: string
  positioning: string
  description: string
  tags?: string[]
  github?: string
  status?: string
}>()
</script>

<template>
  <article class="project-card">
    <div class="project-head">
      <h3 class="project-name">{{ name }}</h3>
      <span v-if="status" class="project-status">{{ status }}</span>
    </div>
    <p class="project-positioning">{{ positioning }}</p>
    <p class="project-desc">{{ description }}</p>
    <div class="project-meta">
      <span v-if="tags?.length" class="project-tags">{{ tags.join(' · ') }}</span>
      <a
        v-if="github"
        class="project-link"
        :href="github"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="`GitHub 仓库:${name}`"
      >GitHub →</a>
    </div>
  </article>
</template>

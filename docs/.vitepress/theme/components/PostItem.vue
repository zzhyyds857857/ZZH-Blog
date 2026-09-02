<script setup lang="ts">
import { withBase } from 'vitepress'
import type { Post } from '../posts.data'

defineProps<{ post: Post }>()
</script>

<template>
  <li class="post-item">
    <a class="post-item-link" :href="withBase(post.url)">
      <span class="post-date">{{ post.dateText }}</span>
      <span class="post-title">{{ post.title }}</span>
      <span v-if="post.description" class="post-desc">{{ post.description }}</span>
      <span v-if="post.tags.length" class="post-tags">{{ post.tags.join(' · ') }}</span>
    </a>
  </li>
</template>

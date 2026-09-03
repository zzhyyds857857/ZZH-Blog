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
      <span v-if="post.tags.length" class="post-tags">
        <span v-for="tag in post.tags" :key="tag" class="post-tag">{{ tag }}</span>
      </span>
    </a>
  </li>
</template>

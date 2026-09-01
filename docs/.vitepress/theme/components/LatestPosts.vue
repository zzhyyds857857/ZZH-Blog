<script setup lang="ts">
import { withBase } from 'vitepress'
import { data as posts } from '../posts.data'
import PostItem from './PostItem.vue'

withDefaults(defineProps<{ limit?: number }>(), { limit: 3 })
</script>

<template>
  <section class="latest-posts home-section">
    <header class="section-header">
      <h2 class="section-title">最新文章</h2>
      <a class="view-all" :href="withBase('/posts/')">查看全部</a>
    </header>
    <ul class="post-list">
      <PostItem v-for="post in posts.slice(0, limit)" :key="post.url" :post="post" />
    </ul>
  </section>
</template>

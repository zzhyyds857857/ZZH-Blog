<script setup lang="ts">
import { data as posts } from '../posts.data'
import PostItem from './PostItem.vue'

withDefaults(defineProps<{ limit?: number }>(), { limit: 3 })
</script>

<template>
  <!-- 仅文章卡片列表;标题行由 LatestPostsHeader 全宽渲染,保证两栏顶部对齐 -->
  <section class="latest-posts">
    <ul class="post-list">
      <PostItem v-for="post in posts.slice(0, limit)" :key="post.url" :post="post" />
    </ul>
  </section>
</template>

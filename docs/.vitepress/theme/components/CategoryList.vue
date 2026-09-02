<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../posts.data'
import { aggregateCategories } from '../data/categories'

// 分类专栏:与文章页共用同一套标签聚合逻辑,点击进入对应分类过滤
const categories = computed(() => aggregateCategories(posts))
</script>

<template>
  <section class="side-card category-card">
    <h2 class="side-card-title">分类专栏</h2>
    <ul class="category-list">
      <li v-for="category in categories" :key="category.name">
        <a
          class="category-item"
          :href="withBase('/posts/#' + encodeURIComponent(category.name))"
        >
          <span class="category-name">{{ category.name }}</span>
          <span class="category-count">{{ category.count }}</span>
        </a>
      </li>
    </ul>
  </section>
</template>

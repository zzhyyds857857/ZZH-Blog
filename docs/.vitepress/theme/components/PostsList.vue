<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { data as posts, type Post } from '../posts.data'
import PostItem from './PostItem.vue'

// Posts 页内置分类过滤(v3 #6:全部 / Java / Spring / MySQL / Redis / 微服务 / 分布式 / 前端 / DevOps / 随笔)
const activeCategory = ref('')

function readHash() {
  activeCategory.value = decodeURIComponent(window.location.hash.slice(1))
}

onMounted(() => {
  readHash()
  window.addEventListener('hashchange', readHash)
})

onUnmounted(() => {
  window.removeEventListener('hashchange', readHash)
})

const categories = computed<[string, number][]>(() => {
  const counts = new Map<string, number>()
  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
})

const filteredPosts = computed<Post[]>(() =>
  activeCategory.value ? posts.filter((post) => post.tags.includes(activeCategory.value)) : posts
)

const yearGroups = computed<[string, Post[]][]>(() => {
  const map = new Map<string, Post[]>()
  for (const post of filteredPosts.value) {
    const year = post.dateText.slice(0, 4)
    const list = map.get(year)
    if (list) {
      list.push(post)
    } else {
      map.set(year, [post])
    }
  }
  return [...map.entries()]
})

function categoryHref(category: string): string {
  return withBase(`/posts/#${encodeURIComponent(category)}`)
}
</script>

<template>
  <section class="posts-page">
    <h1 class="page-title">文章</h1>
    <div class="category-bar">
      <a class="category-chip" :class="{ active: !activeCategory }" :href="withBase('/posts/')">
        全部
        <span class="category-count">{{ posts.length }}</span>
      </a>
      <a
        v-for="[category, count] in categories"
        :key="category"
        class="category-chip"
        :class="{ active: activeCategory === category }"
        :href="categoryHref(category)"
      >
        {{ category }}
        <span class="category-count">{{ count }}</span>
      </a>
    </div>
    <template v-for="[year, list] in yearGroups" :key="year">
      <h2 class="post-year">{{ year }}</h2>
      <ul class="post-list">
        <PostItem v-for="post in list" :key="post.url" :post="post" />
      </ul>
    </template>
  </section>
</template>

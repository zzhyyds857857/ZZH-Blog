<script setup lang="ts">
import { learningJourney } from '../data/journey'

// 标题可覆盖;在 markdown 页面内使用时可传空字符串避免与页面标题重复
withDefaults(defineProps<{ title?: string }>(), { title: '学习历程' })
</script>

<template>
  <section class="learning-journey home-section">
    <header v-if="title" class="section-header">
      <h2 class="section-title">{{ title }}</h2>
    </header>
    <ul class="journey-list">
      <li v-for="item in learningJourney" :key="item.period" class="journey-item">
        <span class="journey-period">{{ item.period }}</span>
        <span>
          <span class="journey-title">{{ item.title }}</span>
          <span class="journey-detail">{{ item.detail }}</span>
        </span>
      </li>
    </ul>
  </section>
</template>

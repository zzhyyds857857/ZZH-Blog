<script setup lang="ts">
import { currentFocus } from '../data/learning'
</script>

<template>
  <section class="current-focus home-section">
    <header class="section-header">
      <h2 class="section-title">当前学习</h2>
    </header>
    <ul class="focus-list">
      <li v-for="item in currentFocus" :key="item.index" class="focus-item">
        <span class="focus-index">{{ item.index }}</span>
        <span>
          <span class="focus-name">{{ item.name }}</span>
          <span class="focus-detail">{{ item.detail }}</span>
        </span>
      </li>
    </ul>
  </section>
</template>

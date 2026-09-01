<script setup lang="ts">
import { learningJourney } from '../data/journey'
</script>

<template>
  <section class="learning-journey home-section">
    <header class="section-header">
      <h2 class="section-title">学习历程</h2>
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

<script setup lang="ts">
import { withBase } from 'vitepress'

// 站点社交链接(GitHub · RSS,v3 #44),仅保留品牌/技术名英文
const links = [
  {
    name: 'GitHub',
    href: 'https://github.com/zzhyyds857857',
    external: true,
    icon: 'github'
  },
  {
    name: 'RSS',
    href: withBase('/rss.xml'),
    external: false,
    icon: 'rss'
  }
]
</script>

<template>
  <div class="social-links">
    <a
      v-for="link in links"
      :key="link.name"
      class="social-link"
      :href="link.href"
      :aria-label="link.name"
      :title="link.name"
      :target="link.external ? '_blank' : undefined"
      :rel="link.external ? 'noopener noreferrer' : undefined"
    >
      <!-- GitHub -->
      <svg v-if="link.icon === 'github'" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path
          d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
        />
      </svg>
      <!-- RSS -->
      <svg
        v-else
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M4 11a9 9 0 0 1 9 9" />
        <path d="M4 4a16 16 0 0 1 16 16" />
        <circle cx="5" cy="19" r="1" fill="currentColor" stroke="none" />
      </svg>
    </a>
  </div>
</template>

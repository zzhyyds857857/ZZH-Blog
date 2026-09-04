<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { data as notes } from '../notes.data'
import { data as posts } from '../posts.data'

// 详情页底部三按钮导航:上一篇 / 返回列表 / 下一篇
// 根据页面路径自动区分学习随笔与正式文章,其他页面不渲染
const { page } = useData()

const path = computed(() => page.value.relativePath.replace(/\\/g, '/'))

const kind = computed<'note' | 'post' | null>(() => {
  if (path.value.startsWith('notes/')) return 'note'
  if (/^(java|spring|mysql|redis|microservices|frontend|devops)\//.test(path.value)) return 'post'
  return null
})

const items = computed(() => (kind.value === 'note' ? notes : posts))

// createContentLoader 返回的 url 可能带 .html 后缀,比较前归一化
function cleanUrl(url: string): string {
  return url.replace(/\.html$/, '')
}

const index = computed(() =>
  kind.value
    ? items.value.findIndex(
        (it) => cleanUrl(it.url) === `/${path.value.replace(/\.md$/, '')}`
      )
    : -1
)

// 列表按日期倒序:prev 是更新的一篇,next 是更早的一篇
const prev = computed(() =>
  kind.value && index.value > 0 ? items.value[index.value - 1] : null
)
const next = computed(() =>
  kind.value && index.value >= 0 && index.value < items.value.length - 1
    ? items.value[index.value + 1]
    : null
)

const backHref = computed(() => withBase(kind.value === 'note' ? '/notes/' : '/posts/'))
const backLine2 = computed(() => (kind.value === 'note' ? '学习随笔' : '文章列表'))
</script>

<template>
  <nav v-if="kind" class="doc-footer-nav" aria-label="页面导航">
    <!-- 左右按钮由 grid 1fr 等宽,标题截断,不因文字长短改变尺寸 -->
    <a v-if="prev" class="doc-nav-btn doc-nav-side" :href="withBase(prev.url)">
      <span class="doc-nav-label">上一篇</span>
      <span class="doc-nav-title">{{ prev.title }}</span>
    </a>
    <span v-else class="doc-nav-btn doc-nav-side is-disabled" aria-disabled="true">
      <span class="doc-nav-label">上一篇</span>
      <span class="doc-nav-title">已经是最新一篇</span>
    </span>

    <a class="doc-nav-btn doc-nav-back" :href="backHref">
      <span>返回</span>
      <span>{{ backLine2 }}</span>
    </a>

    <a v-if="next" class="doc-nav-btn doc-nav-side" :href="withBase(next.url)">
      <span class="doc-nav-label">下一篇</span>
      <span class="doc-nav-title">{{ next.title }}</span>
    </a>
    <span v-else class="doc-nav-btn doc-nav-side is-disabled" aria-disabled="true">
      <span class="doc-nav-label">下一篇</span>
      <span class="doc-nav-title">已经是最后一篇</span>
    </span>
  </nav>
</template>

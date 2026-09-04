---
title: 重新学习 Vue 3 组件通信
date: 2026-09-01
description: 今天重新梳理了 Vue 3 的组件通信方式,把 props / emits / v-model / provide-inject 的适用边界整理了一遍。
pageClass: note-detail
---

<NoteDetailHeader />

今天重新梳理了一遍 Vue 3 的组件通信方式,发现自己之前用的时候更多是"能跑就行",对每种方式的适用边界其实理解得不够清楚。

记录几个今天理清楚的点:

- **props / emits** 仍然是父子通信的默认选择,简单直接,类型也能通过 `defineProps<T>()` 约束
- **v-model** 在组件上本质就是 `modelValue` prop + `update:modelValue` 事件,多个 v-model 就是多个字段,没有魔法
- **provide / inject** 适合跨层级传递,但要克制使用,否则数据流会变得难追踪

有一个最初的错误认识值得记下来:我以前以为 `ref` 传给子组件会自动保持响应性,后来才明白如果不加 `.value` 处理或直接传对象,响应性可能悄悄断掉。明天准备写个小 demo 把这些边界情况都验证一遍。

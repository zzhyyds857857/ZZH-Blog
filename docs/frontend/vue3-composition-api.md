---
title: Vue 3 组合式 API 实践:从选项式到组合式的迁移思路
date: 2026-08-28
tags: [Vue, 前端]
description: 把项目里几个老组件从选项式迁移到组合式 API 的过程中,对 setup、响应式丢失、逻辑复用与生命周期对应关系整理出的一套实践结论。
---

## 问题背景

项目里最早的一批组件是用 Vue 2 风格的选项式写的:`data`、`methods`、`computed`、`watch` 各管一摊。组件小的时候很清晰,但一个表单组件膨胀到三百行之后,同一个业务逻辑被拆散在五个选项里,改一个功能要在文件里跳来跳去。

组合式 API 的核心价值不是"新语法",而是**按逻辑组织代码**。这次把两个最典型的组件迁移了过去,把踩到的坑和结论整理成这篇笔记。

## 核心原理

组合式 API 的本质是:`setup()` 在组件创建之初执行一次,把响应式状态和逻辑作为普通变量返回,模板通过闭包访问它们。

和选项式相比,有两个关键变化:

1. **`this` 消失了**。响应式数据是显式声明的变量(`ref` / `reactive`),不再挂在组件实例上,也就不存在 `this` 指向混乱的问题。
2. **逻辑可以抽成函数**。原来只能靠 mixins 复用(命名冲突、来源不明),现在一个 `useXxx()` 组合函数就是普通函数,来源和类型都清晰。

## 实现方式与代码示例

以一个"关键字搜索 + 防抖"逻辑为例,先看选项式的写法:

```js
export default {
  data() {
    return { keyword: '', results: [] }
  },
  watch: {
    keyword(val) { this.search(val) }
  },
  methods: {
    search(keyword) { /* ... */ }
  }
}
```

抽成组合函数后:

```ts
// useDebouncedSearch.ts
import { ref, watch } from 'vue'

export function useDebouncedSearch(delay = 300) {
  const keyword = ref('')
  const results = ref<string[]>([])

  let timer: number | undefined
  watch(keyword, (val) => {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => doSearch(val), delay)
  })

  async function doSearch(kw: string) {
    results.value = await fetchResults(kw)
  }

  return { keyword, results }
}
```

组件里一行接入,状态、防抖、请求全部收进一个函数:

```vue
<script setup lang="ts">
import { useDebouncedSearch } from './useDebouncedSearch'

const { keyword, results } = useDebouncedSearch()
</script>
```

## 迁移时的常见坑

1. **解构丢失响应式**:直接 `const { count } = someProps` 或解构 `reactive` 对象后,值不再是响应式。用 `toRefs()` 或保持 `props.count` 的访问形式。
2. **生命周期对应关系**:`created` → `setup()` 本体;`mounted` → `onMounted`;`beforeDestroy` 改名 `onBeforeUnmount`。写在 setup 顶层才能被收集,包在异步函数里注册会失效。
3. **`ref` 的 `.value`**:在 `<script setup>` 里读写要 `.value`,在模板里自动解包。混用 `reactive` 和 `ref` 时,优先统一用 `ref` + 组合函数返回,心智负担最小。
4. **不要过度拆分**:只有"会被第二处复用"或"超过 100 行的独立逻辑"才值得抽成组合函数,小逻辑硬拆反而增加跳转成本。

## 总结

- 组合式 API 解决的是**逻辑组织与复用**,不是把选项式翻译一遍。
- 迁移顺序建议:先抽最独立的逻辑(工具类、请求类)成组合函数,再动组件本身。
- 新组件默认用 `<script setup>` + TypeScript,类型提示和构建期检查都是白拿的。

老项目不必一次性迁完,按"改哪个组件就顺手迁哪个"的节奏推进,风险最小。

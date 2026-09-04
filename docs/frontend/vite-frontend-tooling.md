---
title: Vite 开发体验与构建优化实践
date: 2026-08-08
tags: [前端, 工程化]
description: 把一个老 Webpack 项目迁到 Vite 之后,对按需预构建、分包策略、生产构建体积排查整理出的工程化实践记录。
---

## 问题背景

手上一个后台管理系统用 Webpack 4 构建:冷启动一分多钟,改一行样式热更新要等三秒,生产构建接近五分钟。团队每天浪费在这上面的时间远超迁移成本,于是决定迁到 Vite。

迁移本身比预想的顺利,真正的功夫花在迁移后的**优化**上:开发环境按需加载的预构建策略,以及生产构建的体积排查。这篇记录两部分的关键结论。

## 开发环境:预构建机制

Vite 开发时用原生 ESM 按需加载源码,但对第三方依赖(CommonJS 包、有多入口的包)会先做 **依赖预构建**(esbuild),把结果缓存到 `node_modules/.vite`。

两个直接相关的配置:

```ts
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    // 明确声明多入口依赖,避免开发中途二次预构建导致整页刷新
    include: ['lodash-es', 'element-plus/es'],
    exclude: ['@vueuse/core']
  },
  server: {
    warmup: { clientFiles: ['./src/main.ts', './src/layouts/**'] }
  }
})
```

实践结论:

1. **锁住依赖版本 + 提交缓存提示**:依赖版本变化会触发重新预构建,首次访问慢一拍;`server.warmup` 能在启动空闲时预热关键文件。
2. **别在依赖里引源码**:某次误把一个包的 `src` 入口引进来,每次改文件都绕过缓存,开发体验断崖式下跌。

## 生产构建:分包与体积排查

默认配置下所有业务代码进一个 chunk,首屏体积失控。按路由分包是第一刀:

```ts
build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('node_modules')) {
          if (id.includes('element-plus')) return 'ui'
          if (id.includes('echarts')) return 'charts'
          return 'vendor'
        }
      }
    }
  }
}
```

再配合两件事排查体积:

- `build.rollupOptions.output.assetFileNames` 保持可读命名,配合 `rollup-plugin-visualizer` 生成 treemap,一眼看出大头在哪。
- 路由组件统一 `() => import('...')` 懒加载,首屏只拉入口和 vendor。

## 常见问题

1. **为什么构建产物里还有 CommonJS**?依赖预构建发生在开发环境;生产构建走 Rollup,遇到 CJS 包由 `@rollup/plugin-commonjs` 兜底转换,个别转换失败的包需要换 ESM 版本(如 `lodash-es` 替代 `lodash`)。
2. **CSS 顺序错乱**:Vite 按导入顺序注入样式,动态 import 组件的样式顺序可能与 Webpack 时代不同,依赖样式覆盖顺序的地方要显式声明。
3. **环境变量**:`VITE_` 前缀才会暴露给客户端,`import.meta.env` 替代了 `process.env`,SSR 判断用 `import.meta.env.SSR`。

## 总结

- Vite 迁移的收益大头在开发体验:冷启动秒级、热更新毫秒级。
- 生产优化靠两板斧:**路由级懒加载 + 按包分包**,再用 visualizer 定位残余体积。
- 工具迁移不改业务逻辑,先迁再优,别在迁移当天同时重构代码。

构建速度从五分钟降到四十秒,热更新基本无感——这笔迁移的账怎么算都是值的。

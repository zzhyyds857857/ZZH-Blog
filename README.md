# ZZH-Blog

> 一个记录 2028 届网络工程学生从 Java 后端起步、学习微服务、逐步补齐前端并成长为全栈开发者的个人技术博客。

ZZH 的个人技术博客,记录 Java 后端、微服务、前端与全栈成长。

## 作者定位

- 广东理工学院 · 网络工程专业 · 2028 届
- 2025 年 12 月开始系统学习 Java,已完成 Java 后端主路线并接触微服务
- 2026 年暑假开始补齐前端(HTML / CSS / JavaScript / Vue 3),当前学习 TypeScript 与前端工程化

学习路线:`网络工程 → Java 基础 → Java 后端 → Spring / Spring Boot → MySQL / Redis → 微服务 → 前端基础 → Vue 3 → TypeScript / 前端工程化 → 全栈`

## 技术栈

- VitePress 1.6.4(Vue 3 + Vite)
- TypeScript(strict)
- pnpm 11.24.0 / Node.js 22
- GitHub Actions + GitHub Pages(Project Pages)

## 功能

- 首页:大 Hero(浏览文章 / 关于我)→ 两栏主体(左侧最新文章 + 摘要,右侧轻量信息栏:关于我 / 分类专栏 / 精选项目)→ 学习随笔,以文章内容为核心
- 文章页:分类过滤(全部 / Java / Spring / MySQL / Redis / 微服务 / 分布式 / 前端 / DevOps / 随笔)+ 按年份归档
- 学习随笔:`docs/notes/`,轻量记录日常学习、踩坑与思考,与正式技术文章相区分
- 项目页:学习项目(FoodFlow / LocalHub / Echo)与个人项目(ZZH-Blog)分组展示
- 关于页:个人简介 / 教育背景 / 学习历程 / 项目经历 / 技术方向 / 技术栈 / 当前目标(完整的个人介绍页)
- 全站中文界面、浅色 / 深色模式、站内搜索、RSS(构建期生成,仅收录正式文章)

## 目录结构

```text
├── docs/                      # 站点内容
│   ├── index.md               # 首页(两栏:文章主区 + 信息栏)
│   ├── posts/                 # 文章(分类过滤 + 年份归档)
│   ├── notes/                 # 学习随笔(日常记录)
│   ├── projects.md            # 项目
│   ├── about.md               # 关于
│   ├── java/ redis/ devops/ … # 技术文章(按主题目录)
│   └── .vitepress/
│       ├── config.mts         # 站点配置(base: /ZZH-Blog/)
│       └── theme/             # 自定义主题:设计令牌 + 组件 + 数据加载器
├── .github/workflows/deploy.yml
└── ZZH-Blog-SKILL-v3.md       # 最高开发规范
```

## 本地开发

```bash
pnpm install
pnpm dev      # 本地开发
pnpm build    # 构建生产版本
pnpm preview  # 本地预览构建产物
```

## 部署

- 仓库:`zzhyyds857857/ZZH-Blog`,Project Pages,`base: '/ZZH-Blog/'`(与仓库名完全一致,含大小写)
- 流程:`main` 分支 push → GitHub Actions → `pnpm install --frozen-lockfile && pnpm build` → GitHub Pages(构建失败会阻止发布)
- 图片仓库:`zzhyyds857857/blog_images`(图片语义化命名、压缩、webp/avif 优先)
- 首次部署需在仓库 Settings → Pages → Source 选择 GitHub Actions

## 新增内容

### 技术文章

1. 在对应主题目录新建 `kebab-case.md`
2. frontmatter 必填 `title`、`date`、`tags`(中文分类),推荐必填 `description`(同时用作列表摘要)
3. 结构推荐:问题 → 背景 → 原理 → 实现 → 实践 → 验证 → 踩坑 → 总结
4. 内容必须真实:未完全验证的内容使用"我的理解""待进一步验证"等表述,禁止虚构实验与数据
5. 本地 `pnpm build` 通过后提交(Conventional Commits,中文描述可参考 v3 #33)

### 学习随笔

1. 在 `docs/notes/` 新建 `kebab-case.md`,frontmatter 必填 `title`、`date`,推荐必填 `description`(摘要)
2. 随笔定位:轻量、真实、随时记录——今天学了什么、踩了什么坑、有什么思考;不要求成体系,不进 RSS
3. 保存后自动出现在首页「学习随笔」与随笔列表页

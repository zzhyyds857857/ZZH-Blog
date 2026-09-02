# PROJECT_STRUCTURE.md

项目目录结构与文件职责。规范以 `ZZH-Blog-SKILL-v3.md` 为最高依据,结构发生重大变化时必须同步更新本文档。

## 顶层结构

```text
ZZH-Blog/
├── docs/                          # VitePress 站点源目录
│   ├── index.md                   # 首页:大 Hero → 两栏主体(左:最新文章/右:关于我+分类专栏+精选项目)→ 学习随笔
│   ├── posts/
│   │   └── index.md               # 文章页(内置中文分类过滤,无独立标签导航)
│   ├── notes/
│   │   ├── index.md               # 学习随笔列表页
│   │   └── *.md                   # 随笔内容页(轻量日常记录,不进 RSS)
│   ├── projects.md                # 项目页(学习项目 / 个人项目 分组)
│   ├── about.md                   # 关于页(个人简介 / 教育背景 / 学习历程 / 项目经历 / 技术方向 / 技术栈 / 当前目标)
│   ├── java/ redis/ devops/       # 技术文章(按主题目录)
│   ├── spring/ mysql/ microservices/ frontend/ notes/
│   │                              # 后续按需启用,不预先创建空分类
│   └── .vitepress/                # 站点配置与自定义主题
├── public/                        # 静态资源
├── .github/workflows/deploy.yml   # GitHub Pages 自动部署
├── ZZH-Blog-SKILL-v3.md           # 最高规范(定位 / 中文强制 / 设计 / 内容 / AI 约束)
├── PROJECT_STRUCTURE.md           # 本文档
└── README.md                      # 项目说明(中文)
```

## docs/.vitepress 详细说明

```text
.vitepress/
├── config.mts                     # 站点配置
│                                  #   siteTitle: ZZH-Blog(点击回首页)
│                                  #   base: '/ZZH-Blog/'(与仓库名一致,必须保持)
│                                  #   hostname: https://zzhyyds857857.github.io
│                                  #   导航:首页 / 文章 / 项目 / 关于(v3 #5,本次未改动)
│                                  #   本地搜索中文翻译;buildEnd 生成 rss.xml(仅正式文章,不含 notes)
└── theme/
    ├── index.ts                   # 主题入口:继承默认主题,全局注册 13 个组件
    ├── custom.css                 # 设计令牌 --zzh-*(蓝灰 #4f7dba / 圆角 8/14/18 / 轻阴影)
    │                              #   暗色模式、reduced-motion、两栏布局、侧栏卡片、随笔时间线
    ├── posts.data.ts              # 文章数据加载器:dateText 2026.08.30 + description 摘要
    ├── notes.data.ts              # 学习随笔数据加载器(notes/**/*.md)
    ├── data/
    │   ├── projects.ts            # 项目数据(name / positioning / category Study|Personal)
    │   ├── categories.ts          # 标签聚合函数(文章页与首页「分类专栏」共用;data loader 只能导出 data,故独立成文件)
    │   └── journey.ts             # 学习历程数据(用于关于页)
    └── components/
        ├── HeroSection.vue        # 大 Hero:博客定位 + 浏览文章/关于我 CTA
        ├── PostItem.vue           # 文章项(日期 / 标题 / 摘要 / 中文标签行)
        ├── LatestPosts.vue        # 首页左栏「最新文章」(查看全部)
        ├── AboutCard.vue          # 首页侧栏「关于我」(简短介绍 + GitHub 入口)
        ├── CategoryList.vue       # 首页侧栏「分类专栏」(标签聚合 + 文章数,点击过滤)
        ├── ProjectLinks.vue       # 首页侧栏「精选项目」(名称 + 定位,唯一精选入口)
        ├── LatestNotes.vue        # 首页「学习随笔」(轻时间线,查看全部)
        ├── NotesList.vue          # 随笔列表页
        ├── PostsList.vue          # 文章页:中文分类过滤(hash 路由)+ 年份归档
        ├── ProjectCard.vue        # 项目卡片(name / positioning / status / tags)
        ├── ProjectsList.vue       # 项目页:学习项目 / 个人项目 分组
        ├── FeaturedProjects.vue   # 首页「精选项目」
        ├── LearningJourney.vue    # 学习历程时间线(用于关于页,v3 #14)
        └── SiteFooter.vue         # 页脚:ZZH-Blog · 记录学习 · 分享技术 · 持续成长
```

## 关键设计决策(v3 对应条目)

| 决策 | 依据 |
| --- | --- |
| 全站用户可见文字强制中文;仅技术名/品牌/代码保留英文 | v3 #4/#36 |
| Header:左上 ZZH-Blog 可点击回首页;导航 首页/文章/项目/关于;右侧 搜索/主题/GitHub | v3 #5 |
| 项目品牌化:苍穹外卖→FoodFlow、黑马点评→LocalHub、小哈书→Echo,必须标注学习项目来源,禁止包装为完全原创 | v3 #3 |
| base 固定 `/ZZH-Blog/`(与仓库名一致,含大小写),所有资源引用经 `withBase()` | v3 #21 |
| 分类过滤内置于文章页,标签使用中文 | v3 #6/#17 |
| 首页 = 技术博客首页:大 Hero → 两栏主体(文章为主 + 轻量信息栏)→ 学习随笔;精选项目仅在侧栏一处;个人信息统一收敛到关于页 | 用户 2026.09 首页定稿需求 |
| 首页新增「学习随笔」:文章 = 系统沉淀,随笔 = 正在经历的学习过程;随笔不进 RSS、不混入文章数据 | 用户 2026.09 首页定稿需求 |
| 文章列表用 文本+分割线+轻 Hover;卡片仅用于项目 | v3 #25 |
| 设计令牌 `--zzh-*` 蓝灰色系;暗色不纯黑、保持层次 | v3 #24/#27 |
| RSS 构建期生成,含标题/链接/发布时间/摘要 | v3 #30 |

## 数据流

```text
docs/{主题目录}/**/*.md (frontmatter: title/date/tags/description,tags 中文)
        ↓ 构建期
theme/posts.data.ts → LatestPosts(首页) / PostsList(文章页分类过滤)
        ↓
config.mts buildEnd → dist/rss.xml
```

新增文章无需修改列表代码,补全 frontmatter 即自动出现在首页、文章页与 RSS。

## 部署流程

```text
git push main → GitHub Actions → pnpm install --frozen-lockfile
  → pnpm build(失败阻止发布)→ docs/.vitepress/dist → GitHub Pages
```

首次部署需在仓库 zzhyyds857857/ZZH-Blog 的 Settings → Pages → Source 选择 GitHub Actions。

## 质量门禁(v3 #43)

发布前至少检查:构建成功、首页/文章/项目正常、搜索正常、RSS 正常、`/ZZH-Blog/` 路径正确、无死链、移动端无横向溢出、无明显控制台错误。

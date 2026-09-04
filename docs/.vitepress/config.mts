import { createContentLoader, defineConfig } from 'vitepress'
import type { SiteConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'

// 站点基础信息:主仓库 zzhyyds857857/ZZH-Blog,图片仓库 zzhyyds857857/blog_images
const siteTitle = 'ZZH-Blog'
const siteDescription =
  'ZZH 的个人技术博客:2028 届网络工程学生,从 Java 后端到微服务,正在补齐前端,记录学习与成长全过程。'
// Project Pages:仓库为 ZZH-Blog,base 必须与仓库名完全一致(含大小写),保持 '/ZZH-Blog/'(v3 #21)
const base = '/ZZH-Blog/'
// 用于 RSS / SEO 的绝对地址
const hostname = 'https://zzhyyds857857.github.io'

// RSS 仅收录正式技术文章;学习随笔(notes/)为轻量日常记录,不进 RSS
const postGlob = '{java,spring,mysql,redis,microservices,frontend,devops}/**/*.md'

export default defineConfig({
  lang: 'zh-CN',
  title: siteTitle,
  description: siteDescription,
  base,
  ignoreDeadLinks: false,
  head: [
    ['meta', { name: 'theme-color', content: '#7186e6' }],
    ['link', { rel: 'alternate', type: 'application/rss+xml', title: siteTitle, href: `${base}rss.xml` }],
    ['meta', { property: 'og:title', content: siteTitle }],
    ['meta', { property: 'og:description', content: siteDescription }],
    ['meta', { property: 'og:type', content: 'website' }]
  ],

  themeConfig: {
    // 站名仅用于 SEO/RSS;导航左侧只展示 Logo 图片(Logo 已含 ZZH-Blog 字样,不重复文字)
    siteTitle: '',
    logo: '/logo.png',
    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/posts/' },
      { text: '项目', link: '/projects.html' },
      { text: '学习随笔', link: '/notes/' },
      { text: '关于', link: '/about.html' }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/zzhyyds857857' }],
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文章', buttonAriaLabel: '搜索文章' },
          modal: {
            noResultsText: '没有找到结果',
            resetButtonTitle: '清空查询',
            footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' }
          }
        }
      }
    },
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一篇', next: '下一篇' },
    lastUpdated: { text: '最后更新', formatOptions: { dateStyle: 'medium' } },
    returnToTopLabel: '返回顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
    // 页脚统一由主题 Layout 的 layout-bottom 插槽渲染 SiteFooter 组件(theme/index.ts)
  },

  async buildEnd(siteConfig: SiteConfig) {
    // 依赖零新增,构建期生成 RSS
    const posts = await createContentLoader(postGlob, { excerpt: false }).load()
    posts.sort(
      (a, b) =>
        new Date(String(b.frontmatter?.date ?? 0)).getTime() -
        new Date(String(a.frontmatter?.date ?? 0)).getTime()
    )
    const escape = (s: string) =>
      s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const items = posts
      .map((p) => {
        const fm = p.frontmatter as { title?: string; date?: string; description?: string }
        const url = `${hostname}${base}${p.url.replace(/^\//, '')}`
        return `    <item>
      <title>${escape(fm.title ?? '')}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(fm.date ?? Date.now()).toUTCString()}</pubDate>
      <description>${escape(fm.description ?? '')}</description>
    </item>`
      })
      .join('\n')
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escape(siteTitle)}</title>
    <link>${hostname}${base}</link>
    <description>${escape(siteDescription)}</description>
    <language>zh-CN</language>
${items}
  </channel>
</rss>
`
    fs.writeFileSync(path.join(siteConfig.outDir, 'rss.xml'), xml)
  }
})

import { createContentLoader } from 'vitepress'

export interface Post {
  title: string
  url: string
  date: string
  dateText: string
  tags: string[]
  /** frontmatter description,用作列表摘要(纯文本) */
  description?: string
}

declare const data: Post[]
export { data }

function formatDate(date: Date): string {
  const d = new Date(date)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  // 日期展示格式:2026.08.30(v2 #16)
  return `${d.getFullYear()}.${month}.${day}`
}

export default createContentLoader(
  '{java,spring,mysql,redis,microservices,frontend,devops}/**/*.md',
  {
    excerpt: false,
    transform(raw): Post[] {
      return raw
        .map(({ url, frontmatter }): Post | undefined => {
          const fm = frontmatter as {
            title?: string
            date?: string
            tags?: string[]
            description?: string
          }
          const date = fm.date ? new Date(fm.date) : undefined
          if (!fm.title || !date || Number.isNaN(date.getTime())) {
            return undefined
          }
          return {
            title: fm.title,
            url,
            date: date.toISOString(),
            dateText: formatDate(date),
            tags: fm.tags ?? [],
            description: fm.description
          }
        })
        .filter((post): post is Post => post !== undefined)
        .sort((a, b) => b.date.localeCompare(a.date))
    }
  }
)

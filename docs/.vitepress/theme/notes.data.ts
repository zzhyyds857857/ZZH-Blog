import { createContentLoader } from 'vitepress'

// 学习随笔:轻量、真实、随时记录,与正式技术文章相区分
export interface Note {
  title: string
  url: string
  date: string
  dateText: string
  /** frontmatter description,用作随笔摘要(纯文本) */
  description?: string
}

declare const data: Note[]
export { data }

function formatDate(date: Date): string {
  const d = new Date(date)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}.${month}.${day}`
}

export default createContentLoader('notes/**/*.md', {
  excerpt: false,
  transform(raw): Note[] {
    return raw
      .map(({ url, frontmatter }): Note | undefined => {
        const fm = frontmatter as {
          title?: string
          date?: string
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
          description: fm.description
        }
      })
      .filter((note): note is Note => note !== undefined)
      .sort((a, b) => b.date.localeCompare(a.date))
  }
})

import type { Post } from '../posts.data'

/** 标签聚合成分类(按文章数降序),供文章页与首页「分类专栏」复用 */
export function aggregateCategories(
  posts: Post[]
): Array<{ name: string; count: number }> {
  const counter = new Map<string, number>()
  for (const post of posts) {
    for (const tag of post.tags) {
      counter.set(tag, (counter.get(tag) ?? 0) + 1)
    }
  }
  return [...counter.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'))
}

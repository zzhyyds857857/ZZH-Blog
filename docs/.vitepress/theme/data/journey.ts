export interface JourneyItem {
  period: string
  title: string
  detail: string
}

// 首页「学习历程」数据(v3 #14):成长记录,不是职业履历
export const learningJourney: JourneyItem[] = [
  {
    period: '2025.12',
    title: '开始学习 Java',
    detail: 'Java 基础'
  },
  {
    period: '2026.01 - 06',
    title: 'Java 后端',
    detail: 'Spring / MySQL / Redis / 微服务'
  },
  {
    period: '2026.07 - 08',
    title: '前端基础',
    detail: 'HTML / CSS / JavaScript / Vue 3'
  },
  {
    period: '2026.09+',
    title: 'TypeScript 与全栈开发',
    detail: '前端工程化 / 独立全栈项目'
  }
]

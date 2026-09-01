export interface ProjectInfo {
  name: string
  /** 项目定位,如:餐饮运营平台 */
  positioning: string
  description: string
  tags: string[]
  /** 项目性质:Study = 学习项目,Personal = 个人项目(v3 #3,禁止夸大项目经历) */
  category: 'Study' | 'Personal'
  status?: string
  github?: string
  featured?: boolean
}

// 站点项目数据(项目来源与性质必须真实,详见 ZZH-Blog-SKILL-v3.md #3)
export const projects: ProjectInfo[] = [
  {
    name: 'FoodFlow',
    positioning: '餐饮运营平台',
    description: '学习项目:用户与商户、菜品、订单、权限与数据统计,基于 Spring Boot 分层设计,集成 JWT 登录与 Redis 缓存。',
    tags: ['Java', 'Spring Boot', 'MySQL', 'Redis'],
    category: 'Study',
    status: '学习中',
    featured: true
  },
  {
    name: 'LocalHub',
    positioning: '本地生活服务平台',
    description: '学习项目:缓存、秒杀、分布式锁、Feed 流与附近商户,深入 Redis 实战与高并发场景。',
    tags: ['Java', 'Spring Boot', 'Redis', 'MySQL'],
    category: 'Study',
    status: '学习中',
    featured: true
  },
  {
    name: 'Echo',
    positioning: '内容社区平台',
    description: '学习项目:用户、内容、点赞、收藏、关注与 Feed,基于 Spring Cloud 微服务,参与前后端联调。',
    tags: ['Java', 'Spring Cloud', 'Redis', 'Vue 3'],
    category: 'Study',
    status: '学习中',
    featured: true
  },
  {
    name: 'ZZH-Blog',
    positioning: '个人技术博客',
    description: '个人项目:从零搭建的 VitePress 静态站点,自定义主题与组件,GitHub Actions 自动部署到 GitHub Pages。',
    tags: ['VitePress', 'Vue 3', 'TypeScript'],
    category: 'Personal',
    status: '持续迭代',
    github: 'https://github.com/zzhyyds857857/ZZH-Blog',
    featured: true
  }
]

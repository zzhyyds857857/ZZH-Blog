export interface FocusItem {
  index: string
  name: string
  detail: string
}

// 首页「当前学习」数据(v3 #13)
export const currentFocus: FocusItem[] = [
  {
    index: '01',
    name: '前端工程化',
    detail: 'HTML / CSS / JavaScript / Vue 3'
  },
  {
    index: '02',
    name: 'TypeScript',
    detail: '类型系统 / 组件开发 / 工具链'
  },
  {
    index: '03',
    name: '全栈开发',
    detail: '后端 + 前端 + 部署'
  }
]

import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'
import './custom.css'

import HeroSection from './components/HeroSection.vue'
import PostItem from './components/PostItem.vue'
import LatestPosts from './components/LatestPosts.vue'
import LatestPostsHeader from './components/LatestPostsHeader.vue'
import PostsList from './components/PostsList.vue'
import ProjectCard from './components/ProjectCard.vue'
import ProjectsList from './components/ProjectsList.vue'
import AboutCard from './components/AboutCard.vue'
import CategoryList from './components/CategoryList.vue'
import ProjectLinks from './components/ProjectLinks.vue'
import LatestNotes from './components/LatestNotes.vue'
import NotesList from './components/NotesList.vue'
import NoteDetailHeader from './components/NoteDetailHeader.vue'
import DocFooterNav from './components/DocFooterNav.vue'
import LearningJourney from './components/LearningJourney.vue'
import SiteFooter from './components/SiteFooter.vue'

export default {
  extends: DefaultTheme,
  // 全站统一页脚:挂载在默认主题布局底部,所有页面(含文章详情页)自动渲染
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(SiteFooter),
      // 详情页(文章/学习随笔)底部三按钮导航,由组件按路径自判断渲染
      'doc-bottom': () => h(DocFooterNav)
    })
  },
  enhanceApp({ app }) {
    app.component('HeroSection', HeroSection)
    app.component('PostItem', PostItem)
    app.component('LatestPosts', LatestPosts)
    app.component('LatestPostsHeader', LatestPostsHeader)
    app.component('PostsList', PostsList)
    app.component('ProjectCard', ProjectCard)
    app.component('ProjectsList', ProjectsList)
    app.component('AboutCard', AboutCard)
    app.component('CategoryList', CategoryList)
    app.component('ProjectLinks', ProjectLinks)
    app.component('LatestNotes', LatestNotes)
    app.component('NotesList', NotesList)
    app.component('NoteDetailHeader', NoteDetailHeader)
    app.component('LearningJourney', LearningJourney)
  }
} satisfies Theme

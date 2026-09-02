import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './custom.css'

import HeroSection from './components/HeroSection.vue'
import PostItem from './components/PostItem.vue'
import LatestPosts from './components/LatestPosts.vue'
import PostsList from './components/PostsList.vue'
import ProjectCard from './components/ProjectCard.vue'
import ProjectsList from './components/ProjectsList.vue'
import FeaturedProjects from './components/FeaturedProjects.vue'
import LearningJourney from './components/LearningJourney.vue'
import SiteFooter from './components/SiteFooter.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('HeroSection', HeroSection)
    app.component('PostItem', PostItem)
    app.component('LatestPosts', LatestPosts)
    app.component('PostsList', PostsList)
    app.component('ProjectCard', ProjectCard)
    app.component('ProjectsList', ProjectsList)
    app.component('FeaturedProjects', FeaturedProjects)
    app.component('LearningJourney', LearningJourney)
    app.component('SiteFooter', SiteFooter)
  }
} satisfies Theme

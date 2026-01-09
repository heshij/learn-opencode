// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import mediumZoom from 'medium-zoom'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'

// 自定义组件
import PromptCard from './components/PromptCard.vue'
import AsciinemaPlayer from './components/AsciinemaPlayer.vue'
import VideoEmbed from './components/VideoEmbed.vue'
import NotFound from './components/NotFound.vue'
import HeroCarousel from './components/HeroCarousel.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'not-found': () => h(NotFound),
      'home-hero-image': () => h(HeroCarousel)
    })
  },
  setup() {
    const route = useRoute()

    // 初始化缩放功能的函数
    const initZoom = () => {
      // 给所有非链接包裹的图片添加缩放功能
      // 只选择主内容区的图片，避免放大 Logo 等图标
      mediumZoom('.main img', {
        background: 'var(--vp-c-bg)'
      })
    }

    onMounted(() => {
      initZoom()
    })

    // 监听路由变化，因为 VitePress 是 SPA，切换页面需要重新绑定
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )
  },
  enhanceApp({ app, router, siteData }) {
    // 注册全局组件
    app.component('PromptCard', PromptCard)
    app.component('AsciinemaPlayer', AsciinemaPlayer)
    app.component('VideoEmbed', VideoEmbed)
  }
} satisfies Theme

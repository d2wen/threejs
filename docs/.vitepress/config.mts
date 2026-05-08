import { defineConfig } from 'vitepress'
import { type DefaultTheme } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Threejs 笔记", // 网站标题
  description: "一些 Threejs 的笔记", // 网站描述
  base: '/threejs/', // 网站根路径
  cleanUrls: true, // 当设置为 true 时，VitePress 将从 URL 中删除 .html 后缀。
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: nav(), // 导航栏

    sidebar: { // 侧边栏
      '/note/': { base: '/note/', items: sidebarNote() },
      '/reference/': { base: '/reference/', items: sidebarReference() }
    },

    socialLinks: [ // 社交链接
      { icon: 'github', link: 'https://github.com/d2wen/threejs' }
    ],

    footer: { // 页脚
      message: '基于 KFC 许可发布',
      copyright: '版权所有 © 2026-至今 d2wen'
    },

    docFooter: { // 文档页脚
      prev: '上一页',
      next: '下一页'
    },

    outline: { // 文档大纲
      label: '页面导航'
    },

    notFound: { // 404 页面
      title: '页面未找到',
      quote:
        '但如果你不改变方向，并且继续寻找，你可能最终会到达你所前往的地方。',
      linkLabel: '前往首页',
      linkText: '带我回首页'
    },

  },
  markdown: { // markdown 配置
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    }
  }
})
// 导航栏配置函数
function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: '笔记',
      link: '/note/threejs01',
      activeMatch: '/note/'
    },
    {
      text: '避坑指南',
      link: '/reference/threejs05',
      activeMatch: '/reference/'
    },
    {
      text: '回到主页',
      link: 'https://d2wen.github.io/',
    },
  ]
}

// 笔记 侧边栏配置函数
function sidebarNote(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '简介',
      items: [
        { text: 'Three.js 世界观', link: 'threejs01' },
        { text: '坐标系与变换', link: 'threejs02' },
        { text: '动画循环与时间', link: 'threejs03' },
        { text: '几何体与材质基础', link: 'threejs04' }
      ]
    }
  ]
}

// 避坑指南 侧边栏配置函数
function sidebarReference(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '避坑指南',
      items: [
        { text: 'Three.js 避坑指南', link: 'threejs05' }
      ]
    }
  ]
}
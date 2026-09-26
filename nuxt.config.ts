export default defineNuxtConfig({
  compatibilityDate: '2026-08-27',
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'dark',
  },
  app: {
    head: {
      title: 'ReCloud — 图标库',
      meta: [
        {
          name: 'description',
          content: 'ReCloud 项目、团队与组织品牌图标：矢量 SVG 与多尺寸 PNG 下载。',
        },
        { property: 'og:title', content: 'ReCloud 图标库' },
        {
          property: 'og:description',
          content: 'ReCloud 项目、团队与组织品牌图标：矢量 SVG 与多尺寸 PNG 下载。',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://icon.worldexecute.me' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/brand/recloud-studio/icon.svg' }],
    },
  },
  nitro: {
    preset: 'cloudflare_pages',
  },
  devServer: {
    host: '0.0.0.0',
  },
})

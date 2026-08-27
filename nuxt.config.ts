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
      title: 'ReCloud Studio — 图标',
      meta: [
        {
          name: 'description',
          content: 'ReCloud Studio 品牌图标：矢量 SVG 与多尺寸 PNG 下载。',
        },
        { property: 'og:title', content: 'ReCloud Studio 图标' },
        {
          property: 'og:description',
          content: 'ReCloud Studio 品牌图标：矢量 SVG 与多尺寸 PNG 下载。',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://icon.worldexecute.me' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/brand/icon.svg' }],
    },
  },
  nitro: {
    preset: 'cloudflare-module',
  },
  devServer: {
    host: '0.0.0.0',
  },
})

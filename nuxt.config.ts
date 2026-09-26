import { iconsConfigSchema, siteConfigSchema } from './shared/schema'
import { siteConfig } from './site.config'
import iconsData from './app/data/icons.json'

const site = siteConfigSchema.parse(siteConfig)
iconsConfigSchema.parse(iconsData)

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
      title: `${site.name} — 图标库`,
      meta: [
        { name: 'description', content: site.description },
        { property: 'og:title', content: `${site.name} 图标库` },
        { property: 'og:description', content: site.description },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: site.ogUrl },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: site.logo }],
    },
  },
  nitro: {
    preset: 'cloudflare_pages',
  },
  devServer: {
    host: '0.0.0.0',
  },
})

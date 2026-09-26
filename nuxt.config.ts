import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-09-26',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      phone: process.env.NUXT_PUBLIC_PHONE || '+44 7400 123 456',
      email: process.env.NUXT_PUBLIC_EMAIL || 'hello@blackrivor.co.uk'
    }
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en-GB' },
      meta: [
        { name: 'theme-color', content: '#0a0a0a' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@500;600;700&display=swap' }
      ]
    }
  },
  nitro: {
    preset: 'node-server',
    compressPublicAssets: true
  },
  typescript: { strict: true, typeCheck: false }
})

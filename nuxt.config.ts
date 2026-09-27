import tailwindcss from '@tailwindcss/vite'

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://blackrivor.co.uk'

export default defineNuxtConfig({
  compatibilityDate: '2026-09-26',
  devtools: { enabled: true },
  modules: ['@nuxtjs/seo'],
  site: {
    url: siteUrl,
    name: 'Black Rivor Wrap Studio',
    description: 'Premium car wrapping, paint protection film and window tinting in Sunderland and North East England.',
    defaultLocale: 'en-GB'
  },
  robots: {
    disallow: ['/admin', '/admin/**', '/api/**', '/unsubscribe']
  },
  schemaOrg: {
    identity: {
      '@type': 'AutomotiveBusiness',
      name: 'Black Rivor Wrap Studio',
      description: 'Premium car wrapping, paint protection film and window tinting in Sunderland and North East England.',
      url: siteUrl,
      logo: '/icon.svg',
      image: '/images/gallery-studio.jpg',
      telephone: process.env.NUXT_PUBLIC_PHONE || '+44 7400 123 456',
      email: process.env.NUXT_PUBLIC_EMAIL || 'hello@blackrivor.co.uk',
      priceRange: '££',
      areaServed: ['Sunderland', 'Tyne and Wear', 'North East England'],
      address: {
        addressLocality: 'Sunderland',
        addressRegion: 'Tyne and Wear',
        addressCountry: 'GB'
      }
    }
  },
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  routeRules: {
    '/admin/**': { ssr: false, robots: false, sitemap: false },
    '/api/**': { robots: false, sitemap: false },
    '/unsubscribe': { robots: false, sitemap: false }
  },
  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    public: {
      siteUrl,
      phone: process.env.NUXT_PUBLIC_PHONE || '+44 7400 123 456',
      email: process.env.NUXT_PUBLIC_EMAIL || 'hello@blackrivor.co.uk'
    }
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en-GB' },
      meta: [
        { name: 'theme-color', content: '#0a0a0a' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'geo.region', content: 'GB-SND' },
        { name: 'geo.placename', content: 'Sunderland' }
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

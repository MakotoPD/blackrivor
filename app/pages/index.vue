<script setup lang="ts">
import { ArrowRight, ArrowUpRight, Check, ShieldCheck, Sparkles, SunMedium } from '@lucide/vue'

useSeoMeta({
  title: 'Car Wrapping, PPF & Window Tinting in Sunderland',
  description: 'Premium car wrapping, paint protection film and window tinting in Sunderland. Direct service, precise fitting and clear UK pricing.',
  ogTitle: 'Black Rivor Wrap Studio — Sunderland',
  ogDescription: 'Same car. New attitude. Precision vehicle wrapping, PPF and tinting in Sunderland.',
  ogType: 'website'
})

await useFetch('/api/public/content', { key: 'site-content' })
const t = useSiteContent()

useSchemaOrg([1, 2, 3, 4].map(n => defineService({
  '@id': `#service-0${n}`,
  name: t(`services.${n}.title`),
  description: t(`services.${n}.text`),
  serviceType: t(`services.${n}.title`),
  areaServed: 'Sunderland and North East England'
})))

const openQuestions = ref<Record<number, boolean>>({ 1: true })

const pageRoot = ref<HTMLElement | null>(null)
let revealContext: { revert: () => void } | undefined

onMounted(async () => {
  const root = pageRoot.value
  if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
  gsap.registerPlugin(ScrollTrigger)
  revealContext = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
      gsap.from(element, {
        opacity: 0,
        y: 42,
        duration: .85,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
        scrollTrigger: { trigger: element, start: 'top 88%', once: true }
      })
    })
  }, root)
})

onBeforeUnmount(() => revealContext?.revert())
</script>

<template>
  <main ref="pageRoot">
    <HeroSection />

    <section class="overflow-hidden border-y border-white/10 bg-acid py-4 text-ink" aria-label="Services ticker">
      <div class="marquee flex w-max items-center gap-8 font-display text-sm font-semibold uppercase tracking-[.16em]">
        <template v-for="repeat in 2" :key="repeat">
          <template v-for="n in 4" :key="n"><span :data-edit="`ticker.${n}`">{{ t(`ticker.${n}`) }}</span><span>✦</span></template>
        </template>
      </div>
    </section>

    <section id="services" class="bg-ink text-white">
      <div class="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div data-reveal class="grid gap-8 lg:grid-cols-[.65fr_1.35fr] lg:items-end">
          <p data-edit="services.eyebrow" class="eyebrow text-white/40">{{ t('services.eyebrow') }}</p>
          <h2 class="font-display text-[clamp(2.75rem,6.2vw,6.8rem)] font-semibold uppercase leading-[.87] tracking-[-.055em]">
            <span data-edit="services.title">{{ t('services.title') }}</span><br><span data-edit="services.titleAccent" class="text-acid">{{ t('services.titleAccent') }}</span>
          </h2>
        </div>

        <div class="mt-16 grid border-t border-white/15 md:grid-cols-2 xl:grid-cols-4">
          <article v-for="n in 4" :key="n" data-reveal class="group flex min-h-[360px] flex-col border-b border-white/15 py-7 md:border-r md:px-6 xl:min-h-[420px] first:pl-0 last:border-r-0">
            <div class="flex items-center justify-between text-xs text-white/35">
              <span>0{{ n }}</span>
              <ArrowUpRight :size="18" class="transition duration-300 group-hover:rotate-45 group-hover:text-acid" />
            </div>
            <div class="mt-auto">
              <p :data-edit="`services.${n}.price`" class="mb-5 text-xs font-semibold uppercase tracking-[.14em] text-acid">{{ t(`services.${n}.price`) }}</p>
              <h3 :data-edit="`services.${n}.title`" class="font-display text-3xl font-semibold leading-none">{{ t(`services.${n}.title`) }}</h3>
              <p :data-edit="`services.${n}.text`" class="mt-5 text-sm leading-6 text-white/45">{{ t(`services.${n}.text`) }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="bg-paper text-ink">
      <div class="mx-auto grid max-w-[1500px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:px-12 lg:py-32">
        <div data-reveal class="relative min-h-[480px] overflow-hidden sm:min-h-[620px]">
          <img src="/images/gallery-workshop.jpg" alt="Performance car in a specialist workshop" class="absolute inset-0 h-full w-full object-cover" width="1800" height="1013" loading="lazy">
          <div class="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
          <div class="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white sm:bottom-8 sm:left-8 sm:right-8">
            <p data-edit="studio.imageCaption" class="max-w-[210px] text-sm leading-6 text-white/65">{{ t('studio.imageCaption') }}</p>
            <span data-edit="studio.imageStat" class="font-display text-6xl font-semibold text-acid">{{ t('studio.imageStat') }}</span>
          </div>
        </div>
        <div data-reveal class="flex flex-col justify-center lg:pl-14">
          <p data-edit="studio.eyebrow" class="eyebrow text-black/40">{{ t('studio.eyebrow') }}</p>
          <h2 data-edit="studio.title" class="mt-6 font-display text-[clamp(2.75rem,5vw,5.7rem)] font-semibold uppercase leading-[.88] tracking-[-.05em]">{{ t('studio.title') }}</h2>
          <p data-edit="studio.text" class="mt-8 max-w-xl text-lg leading-8 text-black/55">{{ t('studio.text') }}</p>
          <div class="mt-10 grid gap-6 border-t border-black/15 pt-8 sm:grid-cols-3">
            <div v-for="n in 3" :key="n"><strong :data-edit="`studio.${n}.value`" class="font-display text-3xl">{{ t(`studio.${n}.value`) }}</strong><p :data-edit="`studio.${n}.label`" class="mt-2 text-xs leading-5 text-black/45">{{ t(`studio.${n}.label`) }}</p></div>
          </div>
          <a href="#quote" data-edit="studio.link" class="group mt-10 inline-flex w-fit items-center gap-3 border-b border-black pb-2 text-sm font-semibold">
            {{ t('studio.link') }} <ArrowRight :size="17" class="transition group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>

    <section id="work" class="bg-ink text-white">
      <div class="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div data-reveal>
            <p data-edit="gallery.eyebrow" class="eyebrow text-white/40">{{ t('gallery.eyebrow') }}</p>
            <h2 data-edit="gallery.title" class="mt-6 font-display text-[clamp(3rem,6vw,6.5rem)] font-semibold uppercase leading-[.86] tracking-[-.055em]">{{ t('gallery.title') }}</h2>
          </div>
          <p data-reveal data-edit="gallery.text" class="max-w-sm text-sm leading-6 text-white/45">{{ t('gallery.text') }}</p>
        </div>

        <div class="mt-16 grid auto-rows-[260px] gap-3 sm:auto-rows-[340px] lg:grid-cols-12 lg:auto-rows-[360px]">
          <figure data-reveal class="group relative overflow-hidden lg:col-span-7 lg:row-span-2">
            <img src="/images/gallery-studio.jpg" alt="Silver performance car in studio light" class="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" width="1800" height="1063" loading="lazy">
            <figcaption class="image-caption"><span data-edit="gallery.1.label">{{ t('gallery.1.label') }}</span><strong data-edit="gallery.1.title">{{ t('gallery.1.title') }}</strong></figcaption>
          </figure>
          <figure data-reveal class="group relative overflow-hidden lg:col-span-5">
            <img src="/images/gallery-detail.jpg" alt="Premium car interior and exterior detail" class="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" width="1800" height="1266" loading="lazy">
            <figcaption class="image-caption"><span data-edit="gallery.2.label">{{ t('gallery.2.label') }}</span><strong data-edit="gallery.2.title">{{ t('gallery.2.title') }}</strong></figcaption>
          </figure>
          <figure data-reveal class="group relative overflow-hidden lg:col-span-5">
            <img src="/images/gallery-road.jpg" alt="Dark sports car on an open road" class="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" width="1800" height="1200" loading="lazy">
            <figcaption class="image-caption"><span data-edit="gallery.3.label">{{ t('gallery.3.label') }}</span><strong data-edit="gallery.3.title">{{ t('gallery.3.title') }}</strong></figcaption>
          </figure>
        </div>
      </div>
    </section>

    <ProcessSection />

    <section id="pricing" class="bg-ink text-white">
      <div class="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div class="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div data-reveal>
            <p data-edit="pricing.eyebrow" class="eyebrow text-white/40">{{ t('pricing.eyebrow') }}</p>
            <h2 data-edit="pricing.title" class="mt-6 font-display text-[clamp(2.8rem,5.8vw,6.2rem)] font-semibold uppercase leading-[.87] tracking-[-.05em]">{{ t('pricing.title') }}</h2>
          </div>
          <p data-reveal data-edit="pricing.text" class="max-w-xl text-base leading-7 text-white/45 lg:justify-self-end">{{ t('pricing.text') }}</p>
        </div>

        <div class="mt-16 grid gap-px bg-white/15 lg:grid-cols-3">
          <article data-reveal class="price-card">
            <p data-edit="pricing.1.size" class="eyebrow text-acid">{{ t('pricing.1.size') }}</p><h3 data-edit="pricing.1.title">{{ t('pricing.1.title') }}</h3><strong data-edit="pricing.1.price">{{ t('pricing.1.price') }}</strong><p data-edit="pricing.1.text">{{ t('pricing.1.text') }}</p>
          </article>
          <article data-reveal class="price-card featured">
            <div class="mb-8 flex items-center justify-between"><p data-edit="pricing.2.size" class="eyebrow text-acid">{{ t('pricing.2.size') }}</p><span data-edit="pricing.2.badge" class="rounded-full bg-acid px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">{{ t('pricing.2.badge') }}</span></div>
            <h3 data-edit="pricing.2.title">{{ t('pricing.2.title') }}</h3><strong data-edit="pricing.2.price">{{ t('pricing.2.price') }}</strong><p data-edit="pricing.2.text">{{ t('pricing.2.text') }}</p>
          </article>
          <article data-reveal class="price-card">
            <p data-edit="pricing.3.size" class="eyebrow text-acid">{{ t('pricing.3.size') }}</p><h3 data-edit="pricing.3.title">{{ t('pricing.3.title') }}</h3><strong data-edit="pricing.3.price">{{ t('pricing.3.price') }}</strong><p data-edit="pricing.3.text">{{ t('pricing.3.text') }}</p>
          </article>
        </div>

        <div class="mt-8 grid gap-4 text-sm sm:grid-cols-3">
          <div data-reveal class="benefit"><ShieldCheck :size="20" /><span data-edit="pricing.benefit1">{{ t('pricing.benefit1') }}</span></div>
          <div data-reveal class="benefit"><Sparkles :size="20" /><span data-edit="pricing.benefit2">{{ t('pricing.benefit2') }}</span></div>
          <div data-reveal class="benefit"><SunMedium :size="20" /><span data-edit="pricing.benefit3">{{ t('pricing.benefit3') }}</span></div>
        </div>
      </div>
    </section>

    <section class="bg-paper text-ink">
      <div class="mx-auto grid max-w-[1500px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-12 lg:py-32">
        <div data-reveal>
          <p data-edit="questions.eyebrow" class="eyebrow text-black/40">{{ t('questions.eyebrow') }}</p>
          <h2 data-edit="questions.title" class="mt-6 font-display text-[clamp(2.8rem,5vw,5.6rem)] font-semibold uppercase leading-[.88] tracking-[-.05em]">{{ t('questions.title') }}</h2>
        </div>
        <div data-reveal class="border-t border-black/15">
          <article v-for="n in 5" :key="n" class="border-b border-black/15">
            <button type="button" class="flex w-full items-center justify-between gap-5 py-6 text-left font-display text-lg font-semibold sm:text-2xl" :aria-expanded="!!openQuestions[n]" @click="openQuestions[n] = !openQuestions[n]">
              <span :data-edit="`questions.${n}.question`">{{ t(`questions.${n}.question`) }}</span><span class="text-2xl font-light">{{ openQuestions[n] ? '−' : '+' }}</span>
            </button>
            <div v-if="openQuestions[n]" :data-edit="`questions.${n}.answer`" class="max-w-2xl pb-7 text-sm leading-7 text-black/55 sm:text-base">{{ t(`questions.${n}.answer`) }}</div>
          </article>
        </div>
      </div>
    </section>

    <QuoteForm />
    <SiteFooter />
  </main>
</template>

<style scoped>
.marquee { animation: marquee 22s linear infinite; }
@keyframes marquee { to { transform: translateX(-50%); } }
.image-caption { position: absolute; inset: auto 1.5rem 1.5rem; display: flex; align-items: end; justify-content: space-between; gap: 1rem; color: white; }
.image-caption::before { content: ''; position: absolute; z-index: -1; inset: -6rem -1.5rem -1.5rem; background: linear-gradient(transparent, rgb(0 0 0 / .72)); }
.image-caption span { font-size: .65rem; letter-spacing: .14em; text-transform: uppercase; color: rgb(255 255 255 / .55); }
.image-caption strong { font-family: var(--font-display); font-size: 1.1rem; }
.price-card { display: flex; min-height: 430px; flex-direction: column; background: #0a0a0a; padding: 2rem; }
.price-card h3 { margin-top: auto; font-family: var(--font-display); font-size: clamp(1.8rem, 3vw, 2.6rem); font-weight: 600; }
.price-card strong { margin-top: .8rem; font-family: var(--font-display); font-size: clamp(2.2rem, 3vw, 3.5rem); color: #c9ff32; }
.price-card > p:last-child { margin-top: 1.5rem; max-width: 22rem; font-size: .875rem; line-height: 1.6; color: rgb(255 255 255 / .42); }
.price-card.featured { background: #151515; }
.benefit { display: flex; align-items: center; gap: .75rem; border: 1px solid rgb(255 255 255 / .12); padding: 1rem; color: rgb(255 255 255 / .62); }
.benefit :deep(svg) { flex: 0 0 auto; color: #c9ff32; }
@media (prefers-reduced-motion: reduce) { .marquee { animation: none; } }
</style>

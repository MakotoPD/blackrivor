<script setup lang="ts">
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronRight, EyeOff, ShieldCheck, SunMedium } from '@lucide/vue'

await useFetch('/api/public/content', { key: 'site-content' })
const t = useSiteContent()

useSeoMeta({
  title: () => t('tintHero.seoTitle'),
  description: () => t('tintHero.seoDescription'),
  ogTitle: () => t('tintHero.seoTitle'),
  ogDescription: () => t('tintHero.seoDescription'),
  ogType: 'website'
})

const vehicles = ['hatch3', 'hatch5', 'coupe', 'saloon', 'estate', 'crossover', 'suv', 'convertible', 'pickup', 'smallvan', 'van', 'tailgate']
const benefits = [EyeOff, SunMedium, ShieldCheck]
const selectedVehicle = ref('')

function chooseVehicle(index: number) {
  selectedVehicle.value = t(`tintPricing.${index}.title`)
}
</script>

<template>
  <main>
    <section class="tint-hero relative isolate overflow-hidden bg-ink text-white">
      <SiteHeader />
      <div class="tint-grid pointer-events-none absolute inset-0 -z-10" />
      <div class="mx-auto max-w-[1500px] px-5 pb-12 pt-28 sm:px-8 lg:px-12 lg:pb-16 lg:pt-32">
        <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-xs text-white/40">
          <NuxtLink to="/" data-edit="tintHero.breadcrumb" class="transition hover:text-white">{{ t('tintHero.breadcrumb') }}</NuxtLink>
          <ChevronRight :size="12" />
          <span data-edit="nav.tinting" aria-current="page">{{ t('nav.tinting') }}</span>
        </nav>
        <div class="relative mt-12 grid lg:min-h-[420px] lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div class="relative z-10">
            <p data-edit="tintHero.eyebrow" class="eyebrow text-acid">{{ t('tintHero.eyebrow') }}</p>
            <h1 class="mt-6 max-w-4xl font-display text-[clamp(3rem,7.8vw,7.6rem)] font-semibold uppercase leading-[.88] tracking-[-.065em]">
              <span data-edit="tintHero.title">{{ t('tintHero.title') }}</span><br>
              <span data-edit="tintHero.titleAccent" class="text-acid">{{ t('tintHero.titleAccent') }}</span>
            </h1>
            <p data-edit="tintHero.text" class="mt-7 max-w-md text-sm leading-7 text-white/55 sm:text-base">{{ t('tintHero.text') }}</p>
            <div class="mt-8 flex flex-wrap items-center gap-6">
              <a href="#tint-prices" class="inline-flex items-center gap-4 rounded-full bg-acid px-6 py-4 text-sm font-semibold text-ink transition hover:bg-white">
                <span data-edit="tintHero.button">{{ t('tintHero.button') }}</span><ArrowDown :size="17" />
              </a>
              <a href="#quote" class="inline-flex items-center gap-2 text-sm text-white/65 transition hover:text-white">
                <span data-edit="tintHero.link">{{ t('tintHero.link') }}</span><ArrowUpRight :size="16" />
              </a>
            </div>
          </div>
          <div class="relative -mx-5 mt-5 sm:-mx-8 lg:absolute lg:-right-20 lg:bottom-0 lg:mt-0 lg:w-[65%]">
            <div class="pointer-events-none absolute inset-[25%_15%] rounded-full bg-acid/10 blur-3xl" />
            <img src="/images/hero-car-silver.png" alt="Silver sports coupé with dark rear glass" width="1774" height="887" fetchpriority="high" class="relative block h-auto w-full lg:translate-x-6">
          </div>
        </div>
        <div class="relative mt-6 flex items-center justify-between gap-5 border-t border-white/15 pt-6 lg:mt-12">
          <p data-edit="tintHero.caption" class="text-xs uppercase tracking-[.16em] text-white/40">{{ t('tintHero.caption') }}</p>
          <span class="hidden items-center gap-2 text-xs text-white/40 sm:inline-flex"><span class="h-1.5 w-1.5 rounded-full bg-acid" /> Black Rivor / 02</span>
        </div>
      </div>
    </section>

    <section id="tint-prices" class="scroll-mt-6 bg-paper text-ink">
      <div class="mx-auto max-w-[1500px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div class="grid gap-7 lg:grid-cols-2 lg:items-end">
          <div>
            <p data-edit="tintPricing.eyebrow" class="eyebrow text-black/45">{{ t('tintPricing.eyebrow') }}</p>
            <h2 data-edit="tintPricing.title" class="mt-5 font-display text-[clamp(2.8rem,5.5vw,5.6rem)] font-semibold uppercase leading-[.9] tracking-[-.055em]">{{ t('tintPricing.title') }}</h2>
          </div>
          <p data-edit="tintPricing.text" class="max-w-lg text-sm leading-7 text-black/60 lg:justify-self-end">{{ t('tintPricing.text') }}</p>
        </div>

        <div class="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <article v-for="(shape, i) in vehicles" :key="shape" class="tint-card group flex min-w-0 flex-col border border-black/10 bg-[#faf9f5] p-6 transition-colors hover:border-black/30 sm:p-7">
            <div class="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[.14em] text-black/40">
              <span>{{ String(i + 1).padStart(2, '0') }}</span>
              <span data-edit="tintPricing.coverage">{{ t('tintPricing.coverage') }}</span>
            </div>
            <TintVehicle :shape="shape" class="mx-auto my-5 w-full max-w-[300px]" />
            <h3 :data-edit="`tintPricing.${i + 1}.title`" class="font-display text-[1.4rem] font-semibold leading-tight tracking-[-.035em]">{{ t(`tintPricing.${i + 1}.title`) }}</h3>
            <p :data-edit="`tintPricing.${i + 1}.examples`" class="mb-7 mt-3 text-xs leading-6 text-black/55">{{ t(`tintPricing.${i + 1}.examples`) }}</p>
            <div class="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-5">
              <p :data-edit="`tintPricing.${i + 1}.price`" class="font-display text-[1.65rem] font-semibold tracking-[-.04em]">{{ t(`tintPricing.${i + 1}.price`) }}</p>
              <a href="#quote" class="inline-flex min-h-11 items-center gap-2 text-xs font-semibold underline decoration-black/20 underline-offset-4 transition hover:decoration-black" @click="chooseVehicle(i + 1)">
                <span data-edit="tintPricing.button">{{ t('tintPricing.button') }}</span><ArrowUpRight :size="15" />
              </a>
            </div>
          </article>
        </div>
        <p data-edit="tintPricing.note" class="mt-6 max-w-3xl text-xs leading-6 text-black/55">{{ t('tintPricing.note') }}</p>

        <div class="mt-12 grid items-center gap-6 border-y border-black/15 py-8 md:grid-cols-[1fr_auto]">
          <div>
            <h3 data-edit="tintPricing.helpTitle" class="font-display text-2xl font-semibold tracking-[-.03em]">{{ t('tintPricing.helpTitle') }}</h3>
            <p data-edit="tintPricing.helpText" class="mt-3 max-w-2xl text-sm leading-6 text-black/55">{{ t('tintPricing.helpText') }}</p>
          </div>
          <a href="#quote" class="inline-flex w-fit items-center gap-5 rounded-full bg-ink px-6 py-4 text-sm font-semibold text-white transition hover:bg-black/80">
            <span data-edit="tintPricing.helpButton">{{ t('tintPricing.helpButton') }}</span><ArrowUpRight :size="17" />
          </a>
        </div>
      </div>
    </section>

    <section class="bg-ink text-white">
      <div class="mx-auto max-w-[1500px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div class="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <div>
            <p data-edit="tintExtras.eyebrow" class="eyebrow text-white/40">{{ t('tintExtras.eyebrow') }}</p>
            <h2 data-edit="tintExtras.title" class="mt-5 font-display text-[clamp(2.8rem,5vw,5rem)] font-semibold uppercase leading-[.9] tracking-[-.055em]">{{ t('tintExtras.title') }}</h2>
          </div>
          <div class="border-t border-white/15">
            <article v-for="n in 2" :key="n" class="border-b border-white/15 py-7">
              <div class="flex flex-wrap items-baseline justify-between gap-3">
                <h3 :data-edit="`tintExtras.${n}.title`" class="font-display text-xl font-semibold sm:text-2xl">{{ t(`tintExtras.${n}.title`) }}</h3>
                <p :data-edit="`tintExtras.${n}.price`" class="font-display text-xl font-semibold text-acid">{{ t(`tintExtras.${n}.price`) }}</p>
              </div>
              <p :data-edit="`tintExtras.${n}.text`" class="mt-4 max-w-xl text-sm leading-7 text-white/50">{{ t(`tintExtras.${n}.text`) }}</p>
            </article>
            <a href="#quote" class="mt-7 inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-acid transition hover:text-white">
              <span data-edit="tintExtras.button">{{ t('tintExtras.button') }}</span><ArrowRight :size="17" />
            </a>
          </div>
        </div>

        <div class="mt-16 grid gap-8 border-t border-white/15 pt-10 md:grid-cols-3 lg:mt-24 lg:gap-12">
          <div v-for="(icon, i) in benefits" :key="i">
            <component :is="icon" :size="25" :stroke-width="1.4" class="text-acid" />
            <h3 :data-edit="`tintBenefits.${i + 1}.title`" class="mt-5 font-display text-xl font-semibold">{{ t(`tintBenefits.${i + 1}.title`) }}</h3>
            <p :data-edit="`tintBenefits.${i + 1}.text`" class="mt-3 max-w-sm text-sm leading-7 text-white/50">{{ t(`tintBenefits.${i + 1}.text`) }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-paper text-ink">
      <div class="mx-auto grid max-w-[1500px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:gap-20 lg:px-12 lg:py-28">
        <div>
          <p data-edit="tintQuestions.eyebrow" class="eyebrow text-black/45">{{ t('tintQuestions.eyebrow') }}</p>
          <h2 data-edit="tintQuestions.title" class="mt-5 font-display text-[clamp(2.8rem,5vw,5rem)] font-semibold uppercase leading-[.9] tracking-[-.055em]">{{ t('tintQuestions.title') }}</h2>
          <a href="https://www.gov.uk/tinted-vehicle-window-rules" target="_blank" rel="noopener noreferrer" class="mt-7 inline-flex items-center gap-2 text-xs leading-6 text-black/55 underline underline-offset-4 transition hover:text-black">
            <span data-edit="tintQuestions.rulesLink">{{ t('tintQuestions.rulesLink') }}</span><ArrowUpRight :size="14" class="shrink-0" />
          </a>
        </div>
        <div class="border-t border-black/15">
          <details v-for="n in 5" :key="n" :open="n === 1" class="group border-b border-black/15">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-lg font-semibold sm:text-xl">
              <span :data-edit="`tintQuestions.${n}.question`">{{ t(`tintQuestions.${n}.question`) }}</span>
              <span class="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-black/20"><span class="text-base leading-none group-open:hidden">+</span><Check :size="13" class="hidden group-open:block" /></span>
            </summary>
            <p :data-edit="`tintQuestions.${n}.answer`" class="max-w-2xl pb-7 text-sm leading-7 text-black/60">{{ t(`tintQuestions.${n}.answer`) }}</p>
          </details>
        </div>
      </div>
    </section>

    <QuoteForm default-service="Window tinting" :vehicle="selectedVehicle" />
    <SiteFooter />
  </main>
</template>

<style scoped>
.tint-grid {
  background-image: linear-gradient(rgb(255 255 255 / .035) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / .035) 1px, transparent 1px);
  background-size: 80px 80px;
  mask-image: linear-gradient(black, transparent 90%);
}
.tint-card:focus-within { border-color: #0a0a0a; }
summary::-webkit-details-marker { display: none; }
a:focus-visible, summary:focus-visible { outline: 2px solid currentColor; outline-offset: 5px; }
</style>

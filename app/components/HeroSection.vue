<script setup lang="ts">
import { ArrowDown, ArrowUpRight } from '@lucide/vue'

const cars = [
  { name: 'Pearl Silver', src: '/images/hero-car-silver.png', swatch: '#d7d9da' },
  { name: 'Acid Lime', src: '/images/hero-car-acid.png', swatch: '#c9ff32' },
  { name: 'Midnight Violet', src: '/images/hero-car-violet.png', swatch: '#6937a8' }
]

const active = ref(0)
const incoming = ref(1)
const activeCar = computed(() => cars[active.value]!)
const incomingCar = computed(() => cars[incoming.value]!)
const overlay = ref<HTMLImageElement | null>(null)
let timer: ReturnType<typeof setInterval> | undefined
let gsapApi: typeof import('gsap')['default'] | undefined

async function transitionTo(index: number) {
  if (index === active.value || !overlay.value) return
  incoming.value = index
  await nextTick()

  if (!gsapApi) {
    active.value = index
    return
  }

  gsapApi.killTweensOf(overlay.value)
  gsapApi.fromTo(
    overlay.value,
    { clipPath: 'inset(0 0 0 100%)' },
    {
      clipPath: 'inset(0 0 0 0%)',
      duration: 1.35,
      ease: 'power3.inOut',
      onComplete: () => {
        active.value = index
        if (overlay.value) gsapApi?.set(overlay.value, { clipPath: 'inset(0 0 0 100%)' })
      }
    }
  )
}

function nextColour() {
  transitionTo((active.value + 1) % cars.length)
}

onMounted(async () => {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsapApi = (await import('gsap')).default
    timer = setInterval(nextColour, 4200)
  }
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <section class="hero relative min-h-[760px] overflow-hidden bg-[#0b0b0b] sm:min-h-[820px] lg:min-h-[900px]">
    <SiteHeader />

    <div class="hero-grid pointer-events-none absolute inset-0 opacity-45" />
    <div class="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-black/50 to-transparent" />
    <div class="absolute -right-40 top-24 h-[460px] w-[460px] rounded-full bg-acid/10 blur-[150px]" />

    <div class="relative z-10 mx-auto flex min-h-[760px] max-w-[1500px] flex-col px-5 pb-10 pt-32 sm:min-h-[820px] sm:px-8 lg:min-h-[900px] lg:px-12 lg:pt-36">
      <div class="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[.2em] text-white/55">
        <span class="h-px w-8 bg-acid" />
        Sunderland · North East
      </div>

      <div class="relative mt-8 max-w-[1130px]">
        <p class="mb-4 max-w-sm text-sm leading-6 text-white/55 sm:absolute sm:right-0 sm:top-4 sm:mb-0">
          Precision vinyl wrapping, paint protection and window tinting — fitted one car at a time.
        </p>
        <h1 class="font-display text-[clamp(3.35rem,9.6vw,9.2rem)] font-semibold uppercase leading-[.79] tracking-[-.065em] text-white">
          Same car.<br>
          <span class="text-outline">New attitude.</span>
        </h1>
      </div>

      <div class="car-stage pointer-events-none absolute bottom-[120px] left-1/2 z-0 w-[175vw] max-w-none -translate-x-[53%] sm:bottom-[70px] sm:w-[1260px] sm:-translate-x-1/2 lg:bottom-[52px] lg:w-[min(82vw,1380px)] lg:translate-x-[-47%]">
        <img
          :src="activeCar.src"
          :alt="`${activeCar.name} wrapped sports coupe`"
          class="block h-auto w-full object-contain drop-shadow-[0_45px_50px_rgba(0,0,0,.7)]"
          width="1774"
          height="887"
        >
        <img
          ref="overlay"
          :key="incomingCar.src"
          :src="incomingCar.src"
          alt=""
          aria-hidden="true"
          class="absolute inset-0 block h-auto w-full object-contain"
          style="clip-path: inset(0 0 0 100%)"
          width="1774"
          height="887"
        >
      </div>

      <div class="relative z-10 mt-auto flex items-end justify-between gap-4">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
          <a href="#quote" class="group inline-flex w-fit items-center gap-3 rounded-full bg-acid px-6 py-4 font-semibold text-ink transition hover:bg-white">
            Start your transformation
            <ArrowUpRight :size="18" class="transition group-hover:rotate-45" />
          </a>
          <a href="#services" class="hidden items-center gap-2 text-sm text-white/65 transition hover:text-white sm:inline-flex">
            Explore services <ArrowDown :size="16" />
          </a>
        </div>

        <div class="pointer-events-auto hidden items-end gap-2 md:flex">
          <button
            v-for="(car, index) in cars"
            :key="car.name"
            type="button"
            class="group flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] uppercase tracking-[.14em] transition"
            :class="index === active ? 'border-white/30 bg-white/10 text-white' : 'border-white/10 text-white/40 hover:text-white'"
            :aria-label="`Show ${car.name}`"
            @click="transitionTo(index)"
          >
            <span class="h-3 w-3 rounded-full border border-white/20" :style="{ background: car.swatch }" />
            <span class="hidden xl:inline">{{ car.name }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-grid {
  background-image: linear-gradient(rgba(255,255,255,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.055) 1px, transparent 1px);
  background-size: 88px 88px;
  mask-image: linear-gradient(to bottom, black, transparent 78%);
}
.text-outline {
  color: transparent;
  -webkit-text-stroke: 1px rgba(255,255,255,.68);
}
@media (max-width: 639px) {
  .hero-grid { background-size: 52px 52px; }
  .text-outline { -webkit-text-stroke-width: .7px; }
}
</style>

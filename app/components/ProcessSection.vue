<script setup lang="ts">
import { ArrowDownRight } from '@lucide/vue'

const t = useSiteContent()
const root = ref<HTMLElement | null>(null)
const progress = ref(0)
const activeStep = ref(0)

const steps = [1, 2, 3, 4, 5]

function updateProgress() {
  if (!root.value) return
  const rect = root.value.getBoundingClientRect()
  const travel = root.value.offsetHeight - window.innerHeight
  progress.value = Math.min(1, Math.max(0, -rect.top / Math.max(travel, 1)))
  activeStep.value = Math.min(steps.length - 1, Math.floor(progress.value * steps.length))
}

onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true })
  window.addEventListener('resize', updateProgress, { passive: true })
  updateProgress()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateProgress)
  window.removeEventListener('resize', updateProgress)
})
</script>

<template>
  <section id="process" ref="root" class="relative bg-paper text-ink">
    <div class="mx-auto grid max-w-[1500px] gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[.72fr_1.28fr] lg:px-12 lg:py-32">
      <div class="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
        <p data-edit="process.eyebrow" class="eyebrow text-black/45">{{ t('process.eyebrow') }}</p>
        <h2 data-edit="process.title" class="mt-6 max-w-xl font-display text-[clamp(2.8rem,5.3vw,5.6rem)] font-semibold uppercase leading-[.9] tracking-[-.05em]">{{ t('process.title') }}</h2>
        <p data-edit="process.text" class="mt-7 max-w-md text-base leading-7 text-black/55">{{ t('process.text') }}</p>

        <div class="mt-12 hidden items-center gap-4 lg:flex">
          <span class="font-display text-5xl font-semibold">0{{ activeStep + 1 }}</span>
          <div class="relative h-24 w-px overflow-hidden bg-black/15">
            <span class="absolute inset-x-0 top-0 origin-top bg-ink" :style="{ height: `${progress * 100}%` }" />
          </div>
          <span class="text-xs uppercase tracking-[.18em] text-black/40">of 05</span>
        </div>
      </div>

      <div class="border-t border-black/15">
        <article
          v-for="(step, index) in steps"
          :key="step"
          class="process-step grid min-h-[44vh] grid-cols-[52px_1fr] gap-4 border-b border-black/15 py-12 sm:grid-cols-[82px_1fr] sm:py-16 lg:min-h-[58vh] lg:content-center"
          :class="index <= activeStep ? 'is-active' : ''"
        >
          <span class="pt-2 font-display text-sm font-semibold text-black/35">0{{ step }}</span>
          <div>
            <ArrowDownRight :size="28" :stroke-width="1.4" class="mb-8 text-black/25 transition duration-500" />
            <h3 :data-edit="`process.${step}.title`" class="font-display text-[clamp(2rem,4vw,4.6rem)] font-semibold leading-[.94] tracking-[-.04em]">{{ t(`process.${step}.title`) }}</h3>
            <p :data-edit="`process.${step}.text`" class="mt-6 max-w-xl text-base leading-7 text-black/55 sm:text-lg sm:leading-8">{{ t(`process.${step}.text`) }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.process-step > * { transition: opacity .55s ease, transform .55s ease; }
.process-step:not(.is-active) > * { opacity: .32; transform: translateY(14px); }
.process-step.is-active :deep(svg) { color: #0a0a0a; transform: rotate(-3deg); }
@media (prefers-reduced-motion: reduce) {
  .process-step > * { transition: none; }
  .process-step:not(.is-active) > * { opacity: 1; transform: none; }
}
</style>

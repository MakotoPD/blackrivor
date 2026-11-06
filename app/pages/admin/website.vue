<script setup lang="ts">
import { LoaderCircle, RotateCcw, Save } from '@lucide/vue'

definePageMeta({ layout: 'admin' })
useSeoMeta({ title: 'Website | Black Rivor Admin', robots: 'noindex, nofollow' })

const { data } = await useFetch<Record<string, string>>('/api/public/content')
const saved = ref<Record<string, string>>({ ...siteContentDefaults, ...data.value })
const draft = reactive({ ...saved.value })
const keys = Object.keys(siteContentDefaults)
const pages = [
  { path: '/', label: 'Homepage' },
  { path: '/window-tinting', label: 'Window tinting & prices' }
]
const selectedPage = ref('/')
const sharedSections = ['nav', 'quote', 'footer', 'social']
const sections = computed(() => Object.groupBy(keys.filter(key => {
  if (sharedSections.includes(key.split('.')[0]!)) return true
  return key.startsWith('tint') === (selectedPage.value === '/window-tinting')
}), key => key.split('.')[0]!))
const sectionLabels: Record<string, string> = {
  nav: 'Navigation · shared',
  quote: 'Quote form · shared',
  footer: 'Footer · shared',
  social: 'Social profiles · shared',
  tintHero: 'Window tinting · introduction & SEO',
  tintPricing: 'Vehicle packages & prices',
  tintExtras: 'Additional tinting services',
  tintBenefits: 'Window tinting benefits',
  tintQuestions: 'Window tinting FAQ'
}
const changes = computed(() => keys.filter(key => draft[key] !== saved.value[key]).length)
const frame = ref<HTMLIFrameElement | null>(null)
const saving = ref(false)
const feedback = ref('')

// 'services.1.title' → '1 · title', 'hero.titleOutline' → 'title outline'
const label = (key: string) => key.slice(key.indexOf('.') + 1).replace(/([a-z])([A-Z0-9])/g, '$1 $2').toLowerCase().replaceAll('.', ' · ')
const send = (message: object) => frame.value?.contentWindow?.postMessage(message, location.origin)

watch(draft, () => send({ type: 'content', content: { ...draft } }))

async function publish() {
  saving.value = true
  feedback.value = ''
  try {
    const stored = await $fetch<Record<string, string>>('/api/admin/content', { method: 'PUT', body: draft })
    saved.value = { ...siteContentDefaults, ...stored }
    Object.assign(draft, saved.value)
    feedback.value = 'Published. The website now shows these texts.'
  } catch (error: any) {
    feedback.value = error?.data?.statusMessage || 'Could not publish the changes.'
  } finally {
    saving.value = false
  }
}

function onPreviewMessage({ origin, source, data: message }: MessageEvent) {
  if (origin !== location.origin || source !== frame.value?.contentWindow) return
  if (message?.type === 'ready') send({ type: 'content', content: { ...draft } })
  if (message?.type === 'select') {
    const field = document.getElementById(`field-${message.key}`)
    field?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    field?.focus({ preventScroll: true })
  }
}

const warnBeforeUnload = (event: BeforeUnloadEvent) => {
  if (changes.value) event.preventDefault()
}

onMounted(() => {
  window.addEventListener('message', onPreviewMessage)
  window.addEventListener('beforeunload', warnBeforeUnload)
})
onBeforeUnmount(() => {
  window.removeEventListener('message', onPreviewMessage)
  window.removeEventListener('beforeunload', warnBeforeUnload)
})
onBeforeRouteLeave(() => !changes.value || window.confirm('Leave without publishing your website changes?'))
</script>

<template>
  <section class="grid lg:h-[calc(100dvh-4rem)] lg:grid-cols-[minmax(0,1fr)_25rem]">
    <div class="flex h-[70dvh] flex-col p-3 sm:p-5 lg:h-auto lg:min-h-0">
      <iframe :key="selectedPage" ref="frame" :src="`${selectedPage}?edit`" :title="`${pages.find(page => page.path === selectedPage)?.label} preview`" class="min-h-0 w-full flex-1 rounded-2xl border border-black/10 bg-ink" />
      <p class="mt-2 text-center text-[11px] text-black/40">Live preview. Click any text on the page to edit it.</p>
    </div>

    <aside class="flex min-h-0 flex-col border-t border-black/10 bg-white lg:border-l lg:border-t-0">
      <div class="border-b border-black/10 p-5">
        <p class="text-[10px] font-bold uppercase tracking-[.16em] text-black/35">Website</p>
        <h1 class="mt-1 font-display text-2xl font-semibold tracking-[-.03em]">Page content</h1>
        <label for="website-page" class="mt-4 block text-xs font-semibold text-black/55">Page to edit</label>
        <select id="website-page" v-model="selectedPage" class="admin-input mt-1.5">
          <option v-for="page in pages" :key="page.path" :value="page.path">{{ page.label }}</option>
        </select>
        <p class="mt-2 text-[11px] leading-5 text-black/45">Switch pages without losing your draft. Navigation, quote form and footer texts are shared across both pages.</p>
        <div class="mt-4 flex gap-2">
          <button type="button" :disabled="!changes || saving" class="action flex-1 bg-ink text-white" @click="publish">
            <LoaderCircle v-if="saving" :size="15" class="animate-spin" /><Save v-else :size="15" />
            {{ changes ? `Publish ${changes} ${changes === 1 ? 'change' : 'changes'}` : 'Everything is published' }}
          </button>
          <button type="button" :disabled="!changes || saving" class="action border border-black/15" @click="Object.assign(draft, saved)">Discard</button>
        </div>
        <p v-if="feedback" class="mt-3 text-xs font-semibold" role="status">{{ feedback }}</p>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto p-5">
        <fieldset v-for="(sectionKeys, section) in sections" :key="section" class="mb-8">
          <legend class="text-[10px] font-bold uppercase tracking-[.16em] text-black/35">{{ sectionLabels[section] || section }}</legend>
          <div v-for="key in sectionKeys" :key="key" class="mt-3">
            <div class="flex items-center justify-between gap-2">
              <label :for="`field-${key}`" class="text-xs font-semibold text-black/55 first-letter:uppercase">{{ label(key) }}</label>
              <button v-if="draft[key] !== siteContentDefaults[key]" type="button" title="Restore the original value" class="flex items-center gap-1 text-[11px] text-black/40 transition hover:text-black" @click="draft[key] = siteContentDefaults[key]!">
                <RotateCcw :size="12" /> {{ siteContentDefaults[key] ? 'Default' : 'Clear' }}
              </button>
            </div>
            <!-- Only social links start empty: an empty one stays hidden on the site. -->
            <textarea :id="`field-${key}`" v-model="draft[key]" :placeholder="siteContentDefaults[key] ? undefined : 'Paste the profile link, e.g. https://instagram.com/yourstudio'" class="admin-input mt-1.5 resize-none field-sizing-content" @focus="send({ type: 'focus', key })" />
          </div>
        </fieldset>
      </div>
    </aside>
  </section>
</template>

<style scoped>
.admin-input { min-height: 2.75rem; width: 100%; border: 1px solid rgb(0 0 0 / .12); border-radius: .5rem; background: white; padding: .65rem .75rem; font-size: .875rem; line-height: 1.45; color: #171714; outline: none; }
.admin-input:focus { border-color: #171714; box-shadow: 0 0 0 2px rgb(0 0 0 / .06); }
.action { display: flex; min-height: 2.5rem; align-items: center; justify-content: center; gap: .4rem; border-radius: 999px; padding: 0 .9rem; font-size: .75rem; font-weight: 600; }
.action:disabled { opacity: .5; }
</style>

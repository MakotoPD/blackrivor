<script setup lang="ts">
import { ArrowUpRight, Menu, X } from '@lucide/vue'

const t = useSiteContent()
const route = useRoute()
const open = ref(false)
const links = [
  { key: 'nav.services', href: '#services' },
  { key: 'nav.work', href: '#work' },
  { key: 'nav.process', href: '#process' },
  { key: 'nav.pricing', href: '#pricing' },
  { key: 'nav.tinting', href: '/window-tinting' }
]
const destination = (href: string) => href.startsWith('#') && route.path !== '/' ? `/${href}` : href

watch(() => route.fullPath, () => closeMenu())

function closeMenu() {
  open.value = false
}

watch(open, (value) => {
  if (import.meta.client) document.body.style.overflow = value ? 'hidden' : ''
})

onBeforeUnmount(() => {
  if (import.meta.client) document.body.style.overflow = ''
})
</script>

<template>
  <header class="absolute inset-x-0 top-0 z-50 border-b border-white/10">
    <div class="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-12">
      <AppLogo />

      <nav class="hidden items-center gap-6 text-sm text-white/70 lg:flex" aria-label="Main navigation">
        <NuxtLink
          v-for="link in links"
          :key="link.href"
          :to="destination(link.href)"
          :data-edit="link.key"
          :aria-current="route.path === link.href ? 'page' : undefined"
          :class="route.path === link.href ? 'text-acid' : ''"
          class="transition hover:text-white"
        >{{ t(link.key) }}</NuxtLink>
      </nav>

      <div class="flex items-center gap-3">
        <a
          href="#quote"
          data-edit="nav.button"
          class="hidden items-center gap-2 rounded-full bg-acid px-5 py-3 text-sm font-semibold text-ink transition hover:bg-white sm:inline-flex"
        >
          {{ t('nav.button') }}
          <ArrowUpRight :size="16" :stroke-width="2" />
        </a>
        <button
          type="button"
          class="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white lg:hidden"
          :aria-label="open ? 'Close menu' : 'Open menu'"
          :aria-expanded="open"
          @click="open = !open"
        >
          <X v-if="open" :size="21" />
          <Menu v-else :size="21" />
        </button>
      </div>
    </div>
  </header>

  <Transition name="menu-fade">
    <div v-if="open" class="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ink px-6 pb-8 pt-28 lg:hidden" @keydown.esc="closeMenu">
      <nav class="flex flex-1 flex-col border-t border-white/10" aria-label="Mobile navigation">
        <NuxtLink
          v-for="(link, index) in links"
          :key="link.href"
          :to="destination(link.href)"
          :data-edit="link.key"
          :aria-current="route.path === link.href ? 'page' : undefined"
          class="flex items-center justify-between gap-4 border-b border-white/10 py-4 font-display text-2xl text-white sm:py-6 sm:text-3xl"
          @click="closeMenu"
        >
          {{ t(link.key) }}
          <span class="font-sans text-xs text-white/30">0{{ index + 1 }}</span>
        </NuxtLink>
      </nav>
      <a href="#quote" data-edit="nav.menuButton" class="flex items-center justify-between rounded-full bg-acid px-6 py-4 font-semibold text-ink" @click="closeMenu">
        {{ t('nav.menuButton') }}
        <ArrowUpRight :size="18" />
      </a>
    </div>
  </Transition>
</template>

<style scoped>
.menu-fade-enter-active,
.menu-fade-leave-active { transition: opacity .25s ease; }
.menu-fade-enter-from,
.menu-fade-leave-to { opacity: 0; }
</style>


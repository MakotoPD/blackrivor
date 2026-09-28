<script setup lang="ts">
import { CalendarDays, ClipboardList, Inbox, LayoutDashboard, LogOut, Mail, Menu, PackageOpen, PanelsTopLeft, Settings2, Users, X, ExternalLink } from '@lucide/vue'

const route = useRoute()
const mobileOpen = ref(false)
const nav = [
  { label: 'Overview', to: '/admin', icon: LayoutDashboard },
  { label: 'Enquiries', to: '/admin/enquiries', icon: Inbox },
  { label: 'Bookings', to: '/admin/bookings', icon: CalendarDays },
  { label: 'Clients', to: '/admin/clients', icon: Users },
  { label: 'Jobs', to: '/admin/jobs', icon: ClipboardList },
  { label: 'Film inventory', to: '/admin/inventory', icon: PackageOpen },
  { label: 'Newsletter', to: '/admin/newsletter', icon: Mail },
  { label: 'Website', to: '/admin/website', icon: PanelsTopLeft },
  { label: 'Integrations', to: '/admin/integrations', icon: Settings2 }
]

async function logout() {
  await $fetch('/api/admin/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}

watch(() => route.path, () => { mobileOpen.value = false })
</script>

<template>
  <div class="min-h-screen bg-[#f4f4f0] text-[#171714]">
    <aside class="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-black/10 bg-[#11110f] p-5 text-white lg:flex">
      <AppLogo />
      <nav class="mt-10 grid gap-1" aria-label="Admin navigation">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition"
          :class="route.path === item.to ? 'bg-acid text-ink' : 'text-white/55 hover:bg-white/5 hover:text-white'"
        >
          <component :is="item.icon" :size="18" />{{ item.label }}
        </NuxtLink>
      </nav>
      <div class="mt-auto grid gap-2 border-t border-white/10 pt-5 text-sm">
        <NuxtLink to="/" target="_blank" class="flex items-center gap-3 px-3 py-2 text-white/45 transition hover:text-white"><ExternalLink :size="17" /> View website</NuxtLink>
        <button type="button" class="flex items-center gap-3 px-3 py-2 text-left text-white/45 transition hover:text-white" @click="logout"><LogOut :size="17" /> Sign out</button>
      </div>
    </aside>

    <header class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-black/10 bg-[#f4f4f0]/90 px-5 backdrop-blur lg:ml-64 lg:px-8">
      <div>
        <p class="text-[10px] font-semibold uppercase tracking-[.16em] text-black/35">Black Rivor</p>
        <p class="text-sm font-semibold">Studio operations</p>
      </div>
      <button type="button" class="grid h-10 w-10 place-items-center rounded-full border border-black/15 lg:hidden" aria-label="Open admin menu" @click="mobileOpen = true"><Menu :size="19" /></button>
    </header>

    <Transition name="drawer">
      <div v-if="mobileOpen" class="fixed inset-0 z-50 bg-[#11110f] p-5 text-white lg:hidden">
        <div class="flex items-center justify-between"><AppLogo /><button type="button" aria-label="Close admin menu" class="grid h-10 w-10 place-items-center rounded-full border border-white/15" @click="mobileOpen = false"><X :size="20" /></button></div>
        <nav class="mt-10 grid gap-1">
          <NuxtLink v-for="item in nav" :key="item.to" :to="item.to" class="flex items-center gap-4 border-b border-white/10 px-2 py-4 text-lg"><component :is="item.icon" :size="20" class="text-acid" />{{ item.label }}</NuxtLink>
        </nav>
        <button type="button" class="mt-8 flex items-center gap-3 text-white/55" @click="logout"><LogOut :size="18" /> Sign out</button>
      </div>
    </Transition>

    <main class="lg:ml-64">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.drawer-enter-active, .drawer-leave-active { transition: transform .3s ease; }
.drawer-enter-from, .drawer-leave-to { transform: translateX(100%); }
</style>

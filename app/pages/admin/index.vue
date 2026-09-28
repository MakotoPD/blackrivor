<script setup lang="ts">
import { ArrowRight, CalendarDays, Database, Inbox, LoaderCircle, PackageOpen, PoundSterling, Trash2, Users } from '@lucide/vue'

definePageMeta({ layout: 'admin' })
useSeoMeta({ title: 'Overview | Black Rivor Admin', robots: 'noindex, nofollow' })

type DashboardData = {
  counts: { clients: number, new_enquiries: number, upcoming_bookings: number, low_stock: number, month_revenue: number }
  upcoming: Array<{ id: string, title: string, vehicle: string, registration: string | null, starts_at: string, ends_at: string, status: string }>
  lowStock: Array<{ id: string, brand: string, name: string, colour: string, finish: string, remaining_metres: string, reorder_level: string }>
  enquiries: Array<{ id: string, name: string, vehicle: string, service: string, status: string, created_at: string }>
}

const { data, pending, refresh } = await useFetch<DashboardData>('/api/admin/dashboard')
const seeding = ref<'' | 'add' | 'remove'>('')
const seedFeedback = ref('')
const formatDate = (value: string) => new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
const money = (value: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value)

async function changeDemoData(action: 'add' | 'remove') {
  const adding = action === 'add'
  if (!window.confirm(adding ? 'Add example CRM records? Existing data will not be removed.' : 'Remove the example CRM records? Records you added yourself are kept.')) return
  seeding.value = action
  seedFeedback.value = ''
  try {
    await $fetch('/api/admin/demo', { method: adding ? 'POST' : 'DELETE' })
    await refresh()
    seedFeedback.value = adding ? 'Demo data is ready.' : 'Demo data removed.'
  } catch (error: any) {
    seedFeedback.value = error?.data?.statusMessage || `Could not ${action} demo data.`
  } finally {
    seeding.value = ''
  }
}
</script>

<template>
  <section class="p-5 sm:p-8 xl:p-10">
    <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div><p class="text-[10px] font-bold uppercase tracking-[.16em] text-black/35">Today at a glance</p><h1 class="mt-2 font-display text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Studio overview</h1><p class="mt-2 text-sm text-black/45">The work that needs your attention, without the noise.</p></div>
      <div class="flex flex-wrap gap-2">
        <button type="button" :disabled="!!seeding" class="flex min-h-11 items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-5 text-sm font-semibold transition hover:border-red-600 hover:bg-red-600 hover:text-white disabled:opacity-50" @click="changeDemoData('remove')"><LoaderCircle v-if="seeding === 'remove'" :size="17" class="animate-spin" /><Trash2 v-else :size="17" />{{ seeding === 'remove' ? 'Removing data...' : 'Remove demo data' }}</button>
        <button type="button" :disabled="!!seeding" class="flex min-h-11 items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-5 text-sm font-semibold transition hover:border-ink hover:bg-ink hover:text-white disabled:opacity-50" @click="changeDemoData('add')"><LoaderCircle v-if="seeding === 'add'" :size="17" class="animate-spin" /><Database v-else :size="17" />{{ seeding === 'add' ? 'Adding data...' : 'Load demo data' }}</button>
      </div>
    </div>
    <p v-if="seedFeedback" class="mt-4 text-sm font-semibold" role="status">{{ seedFeedback }}</p>

    <div v-if="pending" class="mt-8 h-80 animate-pulse rounded-2xl bg-black/5" />
    <template v-else>
      <div class="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <div class="metric"><span class="metric-icon"><Inbox :size="19" /></span><strong>{{ data?.counts.new_enquiries || 0 }}</strong><p>New enquiries</p></div>
        <div class="metric"><span class="metric-icon"><CalendarDays :size="19" /></span><strong>{{ data?.counts.upcoming_bookings || 0 }}</strong><p>Upcoming bookings</p></div>
        <div class="metric"><span class="metric-icon"><Users :size="19" /></span><strong>{{ data?.counts.clients || 0 }}</strong><p>Clients</p></div>
        <div class="metric"><span class="metric-icon"><PackageOpen :size="19" /></span><strong>{{ data?.counts.low_stock || 0 }}</strong><p>Low-stock films</p></div>
        <div class="metric sm:col-span-2 xl:col-span-1"><span class="metric-icon"><PoundSterling :size="19" /></span><strong>{{ money(data?.counts.month_revenue || 0) }}</strong><p>Completed this month</p></div>
      </div>

      <div class="mt-6 grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <div class="panel">
          <div class="panel-head"><div><p class="panel-kicker">Schedule</p><h2>Next bookings</h2></div><NuxtLink to="/admin/bookings" class="panel-link">Open calendar <ArrowRight :size="15" /></NuxtLink></div>
          <div v-if="!data?.upcoming.length" class="empty">No upcoming bookings.</div>
          <div v-else class="divide-y divide-black/[.07]">
            <div v-for="booking in data.upcoming" :key="booking.id" class="grid gap-2 py-4 sm:grid-cols-[150px_1fr_auto] sm:items-center">
              <span class="text-xs font-semibold text-black/45">{{ formatDate(booking.starts_at) }}</span>
              <div><p class="font-semibold">{{ booking.title }}</p><p class="mt-1 text-xs text-black/40">{{ booking.vehicle }} · {{ booking.registration || 'No reg' }}</p></div>
              <span class="status">{{ booking.status.replaceAll('_', ' ') }}</span>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-head"><div><p class="panel-kicker">Inventory</p><h2>Needs attention</h2></div><NuxtLink to="/admin/inventory" class="panel-link">View stock <ArrowRight :size="15" /></NuxtLink></div>
          <div v-if="!data?.lowStock.length" class="empty">Stock levels look healthy.</div>
          <div v-else class="divide-y divide-black/[.07]">
            <div v-for="item in data.lowStock" :key="item.id" class="flex items-center justify-between gap-4 py-4"><div><p class="text-sm font-semibold">{{ item.colour }} · {{ item.finish }}</p><p class="mt-1 text-xs text-black/40">{{ item.brand }} {{ item.name }}</p></div><strong class="text-sm text-red-600">{{ item.remaining_metres }}m</strong></div>
          </div>
        </div>
      </div>

      <div class="panel mt-6">
        <div class="panel-head"><div><p class="panel-kicker">Inbox</p><h2>Latest enquiries</h2></div><NuxtLink to="/admin/enquiries" class="panel-link">View all <ArrowRight :size="15" /></NuxtLink></div>
        <div v-if="!data?.enquiries.length" class="empty">Website enquiries will appear here.</div>
        <div v-else class="grid gap-px overflow-hidden rounded-xl bg-black/[.07] md:grid-cols-2 xl:grid-cols-3">
          <article v-for="enquiry in data.enquiries" :key="enquiry.id" class="bg-white p-4"><div class="flex items-center justify-between"><p class="font-semibold">{{ enquiry.name }}</p><span class="status">{{ enquiry.status }}</span></div><p class="mt-3 text-sm text-black/60">{{ enquiry.vehicle }}</p><p class="mt-1 text-xs text-black/40">{{ enquiry.service }}</p></article>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.metric { min-height: 170px; border: 1px solid rgb(0 0 0 / .09); border-radius: 1rem; background: white; padding: 1.2rem; }
.metric-icon { display: grid; height: 2.4rem; width: 2.4rem; place-items: center; border-radius: 999px; background: #c9ff32; }
.metric strong { display: block; margin-top: 1.4rem; font-family: var(--font-display); font-size: 2rem; line-height: 1; }
.metric p { margin-top: .5rem; font-size: .75rem; color: rgb(0 0 0 / .42); }
.panel { border: 1px solid rgb(0 0 0 / .09); border-radius: 1rem; background: white; padding: 1.25rem; }
.panel-head { display: flex; align-items: end; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
.panel-kicker { font-size: .6rem; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: rgb(0 0 0 / .32); }
.panel h2 { margin-top: .3rem; font-family: var(--font-display); font-size: 1.25rem; font-weight: 600; }
.panel-link { display: inline-flex; align-items: center; gap: .35rem; white-space: nowrap; font-size: .7rem; font-weight: 600; color: rgb(0 0 0 / .42); }
.empty { display: grid; min-height: 130px; place-items: center; font-size: .8rem; color: rgb(0 0 0 / .35); }
.status { width: fit-content; border-radius: 999px; background: rgb(0 0 0 / .055); padding: .3rem .55rem; font-size: .62rem; font-weight: 600; text-transform: capitalize; color: rgb(0 0 0 / .55); }
</style>

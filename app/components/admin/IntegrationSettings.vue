<script setup lang="ts">
import { CheckCircle2, FlaskConical, LoaderCircle, Mail, MessageCircle, Save, Send, Webhook, XCircle } from '@lucide/vue'

type Integration = { id: string, channel: string, enabled: boolean, configuration: Record<string, string>, events: string[], secret_configured: boolean, secret?: string, last_test_at?: string, last_error?: string, feedback?: string, busy?: boolean }
type Delivery = { id: number, channel: string, event_type: string, status: 'sent' | 'failed', message: string, error?: string, created_at: string }
type Field = { key: string, label: string, placeholder?: string, type?: string, options?: { label: string, value: string }[] }

const icons = { email: Mail, whatsapp: MessageCircle, telegram: Send, webhook: Webhook }
const details: Record<string, { title: string, description: string, secret: string, fields: Field[] }> = {
  email: { title: 'Email via SMTP', description: 'Works with any standard SMTP mailbox or transactional email service.', secret: 'SMTP password', fields: [
    { key: 'host', label: 'SMTP host', placeholder: 'smtp.example.com' }, { key: 'port', label: 'Port', placeholder: '587', type: 'number' },
    { key: 'secure', label: 'Connection security', type: 'select', options: [{ label: 'STARTTLS (port 587)', value: 'false' }, { label: 'TLS (port 465)', value: 'true' }] },
    { key: 'username', label: 'Username', placeholder: 'notifications@example.com' }, { key: 'from', label: 'From address', placeholder: 'Black Rivor <notifications@example.com>' }, { key: 'to', label: 'Alert recipient', placeholder: 'studio@example.com' }
  ] },
  whatsapp: { title: 'WhatsApp Cloud API', description: 'Connects directly to Meta. Use an approved template with one {{1}} body variable.', secret: 'Permanent access token', fields: [
    { key: 'phoneNumberId', label: 'Phone number ID' }, { key: 'to', label: 'Recipient number', placeholder: '447400123456' },
    { key: 'templateName', label: 'Approved template name', placeholder: 'studio_notification' }, { key: 'templateLanguage', label: 'Template language', placeholder: 'en_GB' },
    { key: 'apiVersion', label: 'Graph API version', placeholder: 'v23.0' }
  ] },
  telegram: { title: 'Telegram bot', description: 'A simple bot is usually the easiest zero-cost channel for internal alerts.', secret: 'Bot token', fields: [{ key: 'chatId', label: 'Chat or group ID', placeholder: '-1001234567890' }] },
  webhook: { title: 'Custom webhook', description: 'Send a JSON event to n8n, Make, Zapier or your own endpoint.', secret: 'Bearer token (optional)', fields: [{ key: 'url', label: 'HTTPS endpoint', placeholder: 'https://automation.example.com/hooks/black-rivor' }] }
}
const eventOptions = [
  { value: 'new_enquiry', label: 'New website enquiry' }, { value: 'new_booking', label: 'New booking' },
  { value: 'low_stock', label: 'Low film stock' }, { value: 'job_status', label: 'Job status changed' },
  { value: 'newsletter_unsubscribe', label: 'Newsletter unsubscribe' }
]

const integrations = ref<Integration[]>([])
const deliveries = ref<Delivery[]>([])
const loading = ref(true)
const formatDate = (value?: string) => value ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : 'Never'
const detailFor = (channel: string) => details[channel]!
const iconFor = (channel: string) => icons[channel as keyof typeof icons]

async function load() {
  loading.value = true
  try {
    const result = await $fetch<{ integrations: Integration[], deliveries: Delivery[] }>('/api/admin/integrations')
    integrations.value = result.integrations.map(item => ({ ...item, configuration: { secure: 'false', templateLanguage: 'en_GB', apiVersion: 'v23.0', ...item.configuration }, secret: '' }))
    deliveries.value = result.deliveries
  } finally { loading.value = false }
}

async function save(item: Integration) {
  item.busy = true
  item.feedback = ''
  try {
    const result = await $fetch<{ item: Integration }>(`/api/admin/integrations/${item.id}`, { method: 'PUT', body: { enabled: item.enabled, configuration: item.configuration, events: item.events, secret: item.secret } })
    Object.assign(item, result.item, { secret: '', feedback: 'Settings saved.' })
    return true
  } catch (error: any) {
    item.feedback = error?.data?.statusMessage || 'Could not save these settings.'
    return false
  } finally { item.busy = false }
}

async function test(item: Integration) {
  if (!await save(item)) return
  item.busy = true
  item.feedback = ''
  try {
    await $fetch(`/api/admin/integrations/${item.id}/test`, { method: 'POST' })
    item.feedback = 'Test notification delivered.'
  } catch (error: any) {
    item.feedback = error?.data?.statusMessage || 'The provider rejected the test.'
  } finally {
    item.busy = false
    const result = await $fetch<{ integrations: Integration[], deliveries: Delivery[] }>('/api/admin/integrations')
    deliveries.value = result.deliveries
  }
}

onMounted(load)
</script>

<template>
  <section class="p-5 sm:p-8 xl:p-10">
    <div><p class="text-[10px] font-bold uppercase tracking-[.16em] text-black/35">Automation</p><h1 class="mt-2 font-display text-3xl font-semibold tracking-[-.035em] sm:text-4xl">Notification integrations</h1><p class="mt-2 max-w-2xl text-sm leading-6 text-black/45">Choose where operational alerts are sent. Credentials are encrypted before they are stored and are never returned to the browser.</p></div>
    <div v-if="loading" class="mt-8 grid min-h-64 place-items-center"><LoaderCircle class="animate-spin text-black/30" /></div>
    <div v-else class="mt-8 grid gap-5 xl:grid-cols-2">
      <article v-for="item in integrations" :key="item.id" class="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
        <div class="flex items-start justify-between gap-4">
          <div class="flex gap-3"><span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink text-acid"><component :is="iconFor(item.channel)" :size="20" /></span><div><h2 class="font-display text-xl font-semibold">{{ detailFor(item.channel).title }}</h2><p class="mt-1 text-xs leading-5 text-black/45">{{ detailFor(item.channel).description }}</p></div></div>
          <label class="relative mt-1 inline-flex cursor-pointer items-center"><input v-model="item.enabled" type="checkbox" class="peer sr-only"><span class="h-6 w-11 rounded-full bg-black/15 transition after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:bg-ink peer-checked:after:translate-x-5" /><span class="sr-only">Enable {{ item.channel }}</span></label>
        </div>

        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <label v-for="field in detailFor(item.channel).fields" :key="field.key" class="field" :class="detailFor(item.channel).fields.length === 1 ? 'sm:col-span-2' : ''"><span>{{ field.label }}</span><select v-if="field.type === 'select'" v-model="item.configuration[field.key]" class="admin-input"><option v-for="option in field.options" :key="option.value" :value="option.value">{{ option.label }}</option></select><input v-else v-model="item.configuration[field.key]" :type="field.type || 'text'" :placeholder="field.placeholder" class="admin-input"></label>
          <label class="field sm:col-span-2"><span>{{ detailFor(item.channel).secret }} <small v-if="item.secret_configured" class="font-normal text-emerald-700">— configured; leave blank to keep it</small></span><input v-model="item.secret" type="password" autocomplete="new-password" :placeholder="item.secret_configured ? '••••••••••••' : 'Required to connect'" class="admin-input"></label>
        </div>

        <fieldset class="mt-5"><legend class="text-xs font-semibold text-black/55">Notify about</legend><div class="mt-3 grid gap-2 sm:grid-cols-2"><label v-for="event in eventOptions" :key="event.value" class="flex min-h-10 items-center gap-2 rounded-lg border border-black/10 px-3 text-xs"><input v-model="item.events" type="checkbox" :value="event.value" class="accent-black">{{ event.label }}</label></div></fieldset>
        <p v-if="item.last_error" class="mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700"><XCircle :size="15" class="mt-px shrink-0" />{{ item.last_error }}</p>
        <p v-if="item.feedback" class="mt-4 text-xs font-semibold" :class="item.feedback.includes('saved') || item.feedback.includes('delivered') ? 'text-emerald-700' : 'text-red-700'">{{ item.feedback }}</p>
        <div class="mt-5 flex flex-wrap items-center gap-2"><button type="button" :disabled="item.busy" class="action bg-ink text-white" @click="save(item)"><LoaderCircle v-if="item.busy" :size="15" class="animate-spin" /><Save v-else :size="15" /> Save</button><button type="button" :disabled="item.busy" class="action border border-black/15" @click="test(item)"><FlaskConical :size="15" /> Save & test</button><span class="ml-auto text-[10px] text-black/30">Last test: {{ formatDate(item.last_test_at) }}</span></div>
      </article>
    </div>

    <div class="mt-12"><h2 class="font-display text-2xl font-semibold">Delivery log</h2><p class="mt-1 text-sm text-black/40">The latest notification attempts across all channels.</p></div>
    <div class="mt-4 overflow-hidden rounded-xl border border-black/10 bg-white">
      <div v-if="!deliveries.length" class="p-6 text-sm text-black/40">No notifications have been attempted yet.</div>
      <div v-else class="divide-y divide-black/[.07]">
        <div v-for="delivery in deliveries" :key="delivery.id" class="grid gap-2 px-4 py-4 sm:grid-cols-[7rem_8rem_minmax(0,1fr)_10rem] sm:items-center sm:px-5">
          <span class="flex items-center gap-1.5 text-xs font-semibold capitalize"><CheckCircle2 v-if="delivery.status === 'sent'" :size="15" class="text-emerald-600" /><XCircle v-else :size="15" class="text-red-600" />{{ delivery.channel }}</span><span class="text-xs capitalize text-black/45">{{ delivery.event_type.replaceAll('_', ' ') }}</span><div class="min-w-0"><p class="truncate text-sm">{{ delivery.message }}</p><p v-if="delivery.error" class="truncate text-xs text-red-600">{{ delivery.error }}</p></div><time class="text-xs text-black/30 sm:text-right">{{ formatDate(delivery.created_at) }}</time>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.field { display: grid; gap: .45rem; font-size: .75rem; font-weight: 600; color: rgb(0 0 0 / .55); }
.admin-input { min-height: 2.75rem; width: 100%; border: 1px solid rgb(0 0 0 / .12); border-radius: .5rem; background: white; padding: .65rem .75rem; font-size: .875rem; color: #171714; outline: none; }
.admin-input:focus { border-color: #171714; box-shadow: 0 0 0 2px rgb(0 0 0 / .06); }
.action { display: flex; min-height: 2.5rem; align-items: center; gap: .4rem; border-radius: 999px; padding: 0 .9rem; font-size: .75rem; font-weight: 600; }
.action:disabled { opacity: .5; }
</style>

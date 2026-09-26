<script setup lang="ts">
import { Eye, History, LoaderCircle, MailPlus, Pencil, Send, X } from '@lucide/vue'

type Campaign = { id: string, subject: string, preview_text?: string, body: string, status: string, scheduled_for?: string, sent_at?: string, recipient_count: number, created_at: string }
type CampaignEvent = { id: number, event_type: string, note?: string, created_at: string, subject: string, user_name: string }

const campaigns = ref<Campaign[]>([])
const events = ref<CampaignEvent[]>([])
const loading = ref(true)
const saving = ref(false)
const sendingId = ref<string | null>(null)
const modalOpen = ref(false)
const previewOpen = ref(false)
const previewHtml = ref('')
const error = ref('')
const editingId = ref<string | null>(null)
const form = reactive({ subject: '', preview_text: '', status: 'draft', scheduled_for: '', body: '<p>Share the latest news from the studio...</p>' })
let previewTimer: ReturnType<typeof setTimeout>

const formatDate = (value?: string) => value ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—'

async function load() {
  loading.value = true
  try {
    const [campaignResult, historyResult] = await Promise.all([
      $fetch<{ items: Campaign[] }>('/api/admin/records/campaigns'),
      $fetch<{ items: CampaignEvent[] }>('/api/admin/newsletter/history')
    ])
    campaigns.value = campaignResult.items
    events.value = historyResult.items
  } finally { loading.value = false }
}

function openCampaign(campaign?: Campaign) {
  editingId.value = campaign?.id || null
  form.subject = campaign?.subject || ''
  form.preview_text = campaign?.preview_text || ''
  form.status = campaign?.status || 'draft'
  form.scheduled_for = campaign?.scheduled_for ? new Date(campaign.scheduled_for).toISOString().slice(0, 16) : ''
  form.body = campaign?.body || '<p>Share the latest news from the studio...</p>'
  error.value = ''
  modalOpen.value = true
  updatePreview()
}

async function updatePreview() {
  const result = await $fetch<{ html: string }>('/api/admin/newsletter/preview', { method: 'POST', body: { content: form.body } })
  previewHtml.value = result.html
}

watch(() => form.body, () => {
  if (!modalOpen.value) return
  clearTimeout(previewTimer)
  previewTimer = setTimeout(updatePreview, 350)
})

async function save() {
  saving.value = true
  error.value = ''
  try {
    if (form.status === 'scheduled' && !form.scheduled_for) throw new Error('Choose a delivery date before scheduling.')
    const url = editingId.value ? `/api/admin/records/campaigns/${editingId.value}` : '/api/admin/records/campaigns'
    await $fetch(url, { method: editingId.value ? 'PUT' : 'POST', body: form })
    modalOpen.value = false
    await load()
  } catch (requestError: any) {
    error.value = requestError?.data?.statusMessage || requestError?.message || 'Could not save this campaign.'
  } finally { saving.value = false }
}

async function showPreview(campaign: Campaign) {
  form.body = campaign.body
  await updatePreview()
  previewOpen.value = true
}

async function sendNow(campaign: Campaign) {
  if (!window.confirm(`Send “${campaign.subject}” to every active subscriber now?`)) return
  sendingId.value = campaign.id
  try {
    const result = await $fetch<{ sent: number, failed: number }>(`/api/admin/newsletter/campaigns/${campaign.id}/send`, { method: 'POST' })
    window.alert(`Campaign sent to ${result.sent} subscriber${result.sent === 1 ? '' : 's'}${result.failed ? `; ${result.failed} failed` : ''}.`)
    await load()
  } catch (requestError: any) {
    window.alert(requestError?.data?.statusMessage || 'The campaign could not be sent.')
  } finally { sendingId.value = null }
}

onMounted(load)
onBeforeUnmount(() => clearTimeout(previewTimer))
</script>

<template>
  <section class="border-t border-black/10 p-5 sm:p-8 xl:p-10">
    <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div><p class="text-[10px] font-bold uppercase tracking-[.16em] text-black/35">Campaign studio</p><h2 class="mt-2 font-display text-3xl font-semibold tracking-[-.035em] sm:text-4xl">Newsletter campaigns</h2><p class="mt-2 max-w-xl text-sm text-black/45">Compose rich emails, preview the locked compliance footer and retain a full activity history.</p></div>
      <button type="button" class="flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white hover:bg-acid hover:text-ink" @click="openCampaign()"><MailPlus :size="17" /> New campaign</button>
    </div>

    <div class="mt-8 overflow-hidden rounded-xl border border-black/10 bg-white">
      <div v-if="loading" class="grid min-h-48 place-items-center"><LoaderCircle class="animate-spin text-black/30" /></div>
      <div v-else-if="!campaigns.length" class="grid min-h-48 place-items-center px-6 text-center"><div><p class="font-semibold">No campaigns yet.</p><p class="mt-1 text-sm text-black/40">Create the first studio update.</p></div></div>
      <div v-else class="divide-y divide-black/[.07]">
        <article v-for="campaign in campaigns" :key="campaign.id" class="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div class="min-w-0"><div class="flex flex-wrap items-center gap-2"><h3 class="truncate font-semibold">{{ campaign.subject }}</h3><span class="rounded-full bg-black/[.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide">{{ campaign.status }}</span></div><p class="mt-1 truncate text-sm text-black/45">{{ campaign.preview_text || 'No preview text' }}</p><p class="mt-2 text-xs text-black/30">Created {{ formatDate(campaign.created_at) }}<template v-if="campaign.scheduled_for"> · Scheduled {{ formatDate(campaign.scheduled_for) }}</template></p></div>
          <div class="flex shrink-0 flex-wrap gap-2"><button type="button" class="campaign-action" @click="showPreview(campaign)"><Eye :size="16" /> Preview</button><button type="button" class="campaign-action" @click="openCampaign(campaign)"><Pencil :size="16" /> Edit</button><button v-if="['draft', 'scheduled'].includes(campaign.status)" type="button" :disabled="sendingId === campaign.id" class="campaign-action !border-ink !bg-ink !text-white disabled:opacity-50" @click="sendNow(campaign)"><LoaderCircle v-if="sendingId === campaign.id" :size="16" class="animate-spin" /><Send v-else :size="16" /> Send now</button></div>
        </article>
      </div>
    </div>

    <div class="mt-10 flex items-center gap-2"><History :size="19" /><h3 class="font-display text-2xl font-semibold">Campaign history</h3></div>
    <div class="mt-4 overflow-hidden rounded-xl border border-black/10 bg-white">
      <div v-if="!events.length" class="p-6 text-sm text-black/40">Campaign events will appear here.</div>
      <div v-else class="divide-y divide-black/[.07]">
        <div v-for="entry in events" :key="entry.id" class="grid gap-1 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_10rem_11rem] sm:items-center sm:px-5">
          <div class="min-w-0"><p class="truncate text-sm font-semibold">{{ entry.subject }}</p><p class="text-xs text-black/35">{{ entry.note || `Campaign ${entry.event_type}` }} · {{ entry.user_name }}</p></div>
          <span class="w-fit rounded-full bg-black/[.06] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide">{{ entry.event_type }}</span>
          <time class="text-xs text-black/35 sm:text-right">{{ formatDate(entry.created_at) }}</time>
        </div>
      </div>
    </div>
  </section>

  <Transition name="modal">
    <div v-if="modalOpen" class="fixed inset-0 z-[60] grid place-items-end bg-black/50 sm:place-items-center" @mousedown.self="modalOpen = false">
      <form class="max-h-[96vh] w-full overflow-y-auto bg-[#f4f4f0] p-5 text-ink sm:max-w-7xl sm:rounded-2xl sm:p-7" @submit.prevent="save">
        <div class="flex items-start justify-between gap-4"><div><p class="text-[10px] font-bold uppercase tracking-[.14em] text-black/35">{{ editingId ? 'Edit campaign' : 'New campaign' }}</p><h2 class="mt-1 font-display text-3xl font-semibold">Compose newsletter</h2></div><button type="button" class="close-button" aria-label="Close" @click="modalOpen = false"><X :size="19" /></button></div>
        <div class="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(340px,.88fr)]">
          <div class="grid content-start gap-4">
            <div class="grid gap-4 sm:grid-cols-2"><label class="field sm:col-span-2"><span>Subject *</span><input v-model="form.subject" required class="admin-input"></label><label class="field sm:col-span-2"><span>Preview text</span><input v-model="form.preview_text" maxlength="180" class="admin-input"></label><label class="field"><span>Status</span><select v-model="form.status" class="admin-input"><option value="draft">Draft</option><option value="scheduled">Scheduled</option><option v-if="form.status === 'sending'" value="sending" disabled>Sending</option><option v-if="form.status === 'sent'" value="sent" disabled>Sent</option><option value="cancelled">Cancelled</option></select></label><label class="field"><span>Schedule for</span><input v-model="form.scheduled_for" type="datetime-local" class="admin-input"></label></div>
            <label class="field"><span>Email content *</span><AdminNewsletterEditor v-model="form.body" /></label>
          </div>
          <div class="min-w-0"><p class="mb-2 text-xs font-semibold text-black/50">Live email preview</p><iframe :srcdoc="previewHtml" title="Newsletter preview" class="h-[650px] w-full rounded-xl border border-black/10 bg-white" sandbox /></div>
        </div>
        <p class="mt-4 rounded-lg bg-acid/25 p-3 text-xs text-black/60">The Black Rivor identity, business address and unsubscribe button are added automatically and cannot be removed from the campaign body.</p>
        <p v-if="error" class="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{{ error }}</p>
        <div class="mt-5 flex justify-end gap-3"><button type="button" class="rounded-full border border-black/15 px-5 py-3 text-sm font-semibold" @click="modalOpen = false">Cancel</button><button type="submit" :disabled="saving" class="flex min-w-36 items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"><LoaderCircle v-if="saving" :size="16" class="animate-spin" /><Send v-else :size="16" />{{ saving ? 'Saving...' : 'Save campaign' }}</button></div>
      </form>
    </div>
  </Transition>

  <Transition name="modal"><div v-if="previewOpen" class="fixed inset-0 z-[70] grid place-items-center bg-black/55 p-3" @mousedown.self="previewOpen = false"><div class="relative h-[92vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white"><button type="button" class="absolute right-3 top-3 z-10 rounded-full bg-ink p-2 text-white" aria-label="Close preview" @click="previewOpen = false"><X :size="18" /></button><iframe :srcdoc="previewHtml" title="Newsletter preview" class="h-full w-full" sandbox /></div></div></Transition>
</template>

<style scoped>
.campaign-action { display: flex; min-height: 2.5rem; align-items: center; gap: .4rem; border: 1px solid rgb(0 0 0 / .12); border-radius: 999px; padding: 0 .85rem; font-size: .75rem; font-weight: 600; }
.close-button { display: grid; height: 2.5rem; width: 2.5rem; place-items: center; border: 1px solid rgb(0 0 0 / .12); border-radius: 999px; }
.field { display: grid; gap: .45rem; font-size: .75rem; font-weight: 600; color: rgb(0 0 0 / .55); }
.admin-input { min-height: 2.75rem; width: 100%; border: 1px solid rgb(0 0 0 / .12); border-radius: .5rem; background: white; padding: .65rem .75rem; font-size: .875rem; color: #171714; outline: none; }
.modal-enter-active, .modal-leave-active { transition: opacity .2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>

<script setup lang="ts">
import { LoaderCircle, Pencil, Plus, Search, Trash2, X } from '@lucide/vue'

type Option = { label: string, value: string }
type Field = { key: string, label: string, type?: string, required?: boolean, options?: Option[], placeholder?: string, step?: string, default?: unknown }
type Column = { key: string, label: string, format?: 'date' | 'datetime' | 'currency' | 'number' | 'status' }

const props = withDefaults(defineProps<{
  resource: string
  title: string
  description: string
  fields: Field[]
  columns: Column[]
  allowCreate?: boolean
  allowDelete?: boolean
  singular?: string
}>(), { allowCreate: true, allowDelete: true, singular: 'record' })

const items = ref<Record<string, any>[]>([])
const loading = ref(true)
const saving = ref(false)
const search = ref('')
const modalOpen = ref(false)
const editingId = ref<string | null>(null)
const form = reactive<Record<string, any>>({})
const error = ref('')
let searchTimer: ReturnType<typeof setTimeout>

function resetForm(item?: Record<string, any>) {
  for (const key of Object.keys(form)) delete form[key]
  for (const field of props.fields) {
    let value = item?.[field.key] ?? field.default ?? (field.type === 'checkbox' ? false : '')
    if (value && field.type === 'datetime-local') value = new Date(value).toISOString().slice(0, 16)
    form[field.key] = value
  }
  editingId.value = item?.id || null
  error.value = ''
}

function openCreate() {
  resetForm()
  modalOpen.value = true
}

function openEdit(item: Record<string, any>) {
  resetForm(item)
  modalOpen.value = true
}

async function loadItems() {
  loading.value = true
  try {
    const result = await $fetch<{ items: Record<string, any>[] }>(`/api/admin/records/${props.resource}`, { query: search.value ? { q: search.value } : undefined })
    items.value = result.items
  } finally {
    loading.value = false
  }
}

async function save() {
  saving.value = true
  error.value = ''
  try {
    const url = editingId.value ? `/api/admin/records/${props.resource}/${editingId.value}` : `/api/admin/records/${props.resource}`
    await $fetch(url, { method: editingId.value ? 'PUT' : 'POST', body: form })
    modalOpen.value = false
    await loadItems()
  } catch (requestError: any) {
    error.value = requestError?.data?.statusMessage || 'Could not save this record.'
  } finally {
    saving.value = false
  }
}

async function remove(item: Record<string, any>) {
  if (!window.confirm(`Delete this ${props.singular}? This cannot be undone.`)) return
  await $fetch(`/api/admin/records/${props.resource}/${item.id}`, { method: 'DELETE' })
  await loadItems()
}

function display(value: unknown, format?: Column['format']) {
  if (value === null || value === undefined || value === '') return '—'
  if (format === 'currency') return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(Number(value))
  if (format === 'date') return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(String(value)))
  if (format === 'datetime') return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(String(value)))
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value).replaceAll('_', ' ')
}

watch(search, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(loadItems, 250)
})

onMounted(loadItems)
</script>

<template>
  <section class="p-5 sm:p-8 xl:p-10">
    <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="text-[10px] font-bold uppercase tracking-[.16em] text-black/35">Operations</p>
        <h1 class="mt-2 font-display text-3xl font-semibold tracking-[-.035em] sm:text-4xl">{{ title }}</h1>
        <p class="mt-2 max-w-xl text-sm text-black/45">{{ description }}</p>
      </div>
      <button v-if="allowCreate" type="button" class="flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-acid hover:text-ink" @click="openCreate"><Plus :size="17" /> Add {{ singular }}</button>
    </div>

    <div class="mt-8 flex items-center gap-3 rounded-xl border border-black/10 bg-white px-4">
      <Search :size="18" class="text-black/30" />
      <input v-model="search" type="search" :placeholder="`Search ${title.toLowerCase()}...`" class="min-h-12 w-full bg-transparent text-sm outline-none placeholder:text-black/30">
    </div>

    <div class="mt-4 overflow-hidden rounded-xl border border-black/10 bg-white">
      <div v-if="loading" class="grid min-h-56 place-items-center text-black/35"><LoaderCircle :size="24" class="animate-spin" /></div>
      <div v-else-if="!items.length" class="grid min-h-56 place-items-center px-6 text-center"><div><p class="font-semibold">Nothing here yet.</p><p class="mt-1 text-sm text-black/40">{{ allowCreate ? `Add your first ${singular} to get started.` : 'New website enquiries will appear here.' }}</p></div></div>
      <div v-else class="overflow-x-auto">
        <table class="resource-table w-full min-w-[720px] border-collapse text-left text-sm">
          <thead><tr class="border-b border-black/10 bg-black/[.025] text-[10px] uppercase tracking-[.12em] text-black/35"><th v-for="column in columns" :key="column.key" class="px-4 py-3 font-semibold">{{ column.label }}</th><th class="w-24 px-4 py-3 text-right font-semibold">Actions</th></tr></thead>
          <tbody>
            <tr v-for="item in items" :key="item.id" class="border-b border-black/[.07] last:border-0 hover:bg-black/[.015]">
              <td v-for="column in columns" :key="column.key" :data-label="column.label" class="max-w-[240px] px-4 py-4 text-black/70">
                <span v-if="column.format === 'status'" class="inline-flex rounded-full bg-black/[.06] px-2.5 py-1 text-[11px] font-semibold capitalize">{{ display(item[column.key]) }}</span>
                <span v-else class="line-clamp-2">{{ display(item[column.key], column.format) }}</span>
              </td>
              <td data-label="Actions" class="px-4 py-4"><div class="flex justify-end gap-1"><button type="button" class="icon-button" :aria-label="`Edit ${singular}`" @click="openEdit(item)"><Pencil :size="16" /></button><button v-if="allowDelete" type="button" class="icon-button hover:!bg-red-50 hover:!text-red-600" :aria-label="`Delete ${singular}`" @click="remove(item)"><Trash2 :size="16" /></button></div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <Transition name="modal">
    <div v-if="modalOpen" class="fixed inset-0 z-[60] grid place-items-end bg-black/45 sm:place-items-center" @mousedown.self="modalOpen = false">
      <form class="max-h-[92vh] w-full overflow-y-auto bg-white p-6 text-ink sm:max-w-2xl sm:rounded-2xl sm:p-8" @submit.prevent="save">
        <div class="flex items-start justify-between gap-5">
          <div><p class="text-[10px] font-bold uppercase tracking-[.14em] text-black/35">{{ editingId ? 'Edit' : 'New' }} {{ singular }}</p><h2 class="mt-2 font-display text-3xl font-semibold">{{ editingId ? 'Update details' : `Add ${singular}` }}</h2></div>
          <button type="button" class="icon-button" aria-label="Close" @click="modalOpen = false"><X :size="19" /></button>
        </div>
        <div class="mt-8 grid gap-5 sm:grid-cols-2">
          <label v-for="field in fields" :key="field.key" class="grid gap-2" :class="field.type === 'textarea' ? 'sm:col-span-2' : ''">
            <span class="text-xs font-semibold text-black/55">{{ field.label }}<b v-if="field.required" class="text-red-500"> *</b></span>
            <select v-if="field.type === 'select'" v-model="form[field.key]" :required="field.required" class="admin-input">
              <option value="">Choose...</option><option v-for="option in field.options" :key="option.value" :value="option.value">{{ option.label }}</option>
            </select>
            <textarea v-else-if="field.type === 'textarea'" v-model="form[field.key]" :required="field.required" :placeholder="field.placeholder" rows="4" class="admin-input resize-y" />
            <label v-else-if="field.type === 'checkbox'" class="flex min-h-11 items-center gap-3 rounded-lg border border-black/10 px-3"><input v-model="form[field.key]" type="checkbox" class="h-4 w-4 accent-black"><span class="text-sm">Yes</span></label>
            <input v-else v-model="form[field.key]" :type="field.type || 'text'" :step="field.step" :required="field.required" :placeholder="field.placeholder" class="admin-input">
          </label>
        </div>
        <p v-if="error" class="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{{ error }}</p>
        <div class="mt-8 flex gap-3">
          <button type="button" class="min-h-11 flex-1 rounded-full border border-black/15 px-5 text-sm font-semibold" @click="modalOpen = false">Cancel</button>
          <button type="submit" :disabled="saving" class="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white disabled:opacity-60"><LoaderCircle v-if="saving" :size="16" class="animate-spin" />{{ saving ? 'Saving...' : 'Save' }}</button>
        </div>
      </form>
    </div>
  </Transition>
</template>

<style scoped>
.icon-button { display: grid; height: 2.25rem; width: 2.25rem; place-items: center; border-radius: 999px; color: rgb(0 0 0 / .5); transition: .2s; }
.icon-button:hover { background: rgb(0 0 0 / .06); color: black; }
.admin-input { min-height: 2.75rem; width: 100%; border: 1px solid rgb(0 0 0 / .12); border-radius: .5rem; background: white; padding: .65rem .75rem; font-size: .875rem; outline: none; }
.admin-input:focus { border-color: #171714; box-shadow: 0 0 0 2px rgb(0 0 0 / .06); }
.modal-enter-active, .modal-leave-active { transition: opacity .2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
@media (max-width: 639px) {
  .resource-table { min-width: 0; }
  .resource-table thead { display: none; }
  .resource-table,
  .resource-table tbody,
  .resource-table tr,
  .resource-table td { display: block; width: 100%; }
  .resource-table tbody { display: grid; gap: .75rem; padding: .75rem; background: rgb(0 0 0 / .025); }
  .resource-table tr { overflow: hidden; border: 1px solid rgb(0 0 0 / .08); border-radius: .75rem; background: white; }
  .resource-table td { display: flex; max-width: none; align-items: center; justify-content: space-between; gap: 1rem; border-bottom: 1px solid rgb(0 0 0 / .06); padding: .7rem .85rem; text-align: right; }
  .resource-table td:last-child { border-bottom: 0; }
  .resource-table td::before { content: attr(data-label); flex: 0 0 auto; font-size: .6rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: rgb(0 0 0 / .34); }
  .resource-table td > span { margin-left: auto; }
}
</style>

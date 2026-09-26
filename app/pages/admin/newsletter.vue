<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useSeoMeta({ title: 'Newsletter | Black Rivor Admin', robots: 'noindex, nofollow' })
const statuses = (values: string[]) => values.map(value => ({ label: value.charAt(0).toUpperCase() + value.slice(1), value }))
const subscriberFields = [
  { key: 'email', label: 'Email', type: 'email', required: true }, { key: 'name', label: 'Name' }, { key: 'status', label: 'Status', type: 'select', default: 'active', options: statuses(['active', 'unsubscribed', 'bounced']) }, { key: 'source', label: 'Source', default: 'manual' }
]
const subscriberColumns = [{ key: 'email', label: 'Email' }, { key: 'name', label: 'Name' }, { key: 'status', label: 'Status', format: 'status' as const }, { key: 'source', label: 'Source' }, { key: 'consent_at', label: 'Consent', format: 'date' as const }]
</script>
<template>
  <div>
    <AdminResourcePage resource="subscribers" title="Newsletter audience" description="Consent-backed subscribers from the website and studio." singular="subscriber" :fields="subscriberFields" :columns="subscriberColumns" />
    <AdminNewsletterCampaigns />
  </div>
</template>

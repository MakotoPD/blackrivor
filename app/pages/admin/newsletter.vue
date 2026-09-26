<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useSeoMeta({ title: 'Newsletter | Black Rivor Admin', robots: 'noindex, nofollow' })
const statuses = (values: string[]) => values.map(value => ({ label: value.charAt(0).toUpperCase() + value.slice(1), value }))
const subscriberFields = [
  { key: 'email', label: 'Email', type: 'email', required: true }, { key: 'name', label: 'Name' }, { key: 'status', label: 'Status', type: 'select', default: 'active', options: statuses(['active', 'unsubscribed', 'bounced']) }, { key: 'source', label: 'Source', default: 'manual' }
]
const subscriberColumns = [{ key: 'email', label: 'Email' }, { key: 'name', label: 'Name' }, { key: 'status', label: 'Status', format: 'status' as const }, { key: 'source', label: 'Source' }, { key: 'consent_at', label: 'Consent', format: 'date' as const }]
const campaignFields = [
  { key: 'subject', label: 'Subject', required: true }, { key: 'preview_text', label: 'Preview text' }, { key: 'status', label: 'Status', type: 'select', default: 'draft', options: statuses(['draft', 'scheduled', 'cancelled']) }, { key: 'scheduled_for', label: 'Schedule for', type: 'datetime-local' }, { key: 'body', label: 'Email content', type: 'textarea', required: true, placeholder: 'Write the campaign message...' }
]
const campaignColumns = [{ key: 'subject', label: 'Campaign' }, { key: 'status', label: 'Status', format: 'status' as const }, { key: 'scheduled_for', label: 'Scheduled', format: 'datetime' as const }, { key: 'recipient_count', label: 'Recipients', format: 'number' as const }, { key: 'created_at', label: 'Created', format: 'date' as const }]
</script>
<template>
  <div>
    <AdminResourcePage resource="subscribers" title="Newsletter audience" description="Consent-backed subscribers from the website and studio." singular="subscriber" :fields="subscriberFields" :columns="subscriberColumns" />
    <div class="border-t border-black/10"><AdminResourcePage resource="campaigns" title="Campaigns" description="Draft and schedule studio updates. Connect an email provider before marking campaigns as sent." singular="campaign" :fields="campaignFields" :columns="campaignColumns" /></div>
  </div>
</template>

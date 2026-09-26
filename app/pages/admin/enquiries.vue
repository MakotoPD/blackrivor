<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useSeoMeta({ title: 'Enquiries | Black Rivor Admin', robots: 'noindex, nofollow' })
const statuses = ['new', 'contacted', 'quoted', 'booked', 'closed'].map(value => ({ label: value.charAt(0).toUpperCase() + value.slice(1), value }))
const fields = [
  { key: 'status', label: 'Status', type: 'select', options: statuses, required: true },
  { key: 'internal_notes', label: 'Internal notes', type: 'textarea', placeholder: 'Call notes, quote sent, next action...' }
]
const columns = [
  { key: 'name', label: 'Name' }, { key: 'vehicle', label: 'Vehicle' }, { key: 'service', label: 'Service' }, { key: 'phone', label: 'Phone' }, { key: 'status', label: 'Status', format: 'status' as const }, { key: 'created_at', label: 'Received', format: 'datetime' as const }
]
</script>
<template><AdminResourcePage resource="enquiries" title="Enquiries" description="Quote requests from the website, ready to qualify, price and convert." singular="enquiry" :fields="fields" :columns="columns" :allow-create="false" :allow-delete="false" /></template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useSeoMeta({ title: 'Clients | Black Rivor Admin', robots: 'noindex, nofollow' })
const fields = [
  { key: 'name', label: 'Full name', required: true },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Phone', type: 'tel', required: true },
  { key: 'postcode', label: 'Postcode' },
  { key: 'vehicle_registration', label: 'Registration' },
  { key: 'marketing_consent', label: 'Marketing consent', type: 'checkbox' },
  { key: 'notes', label: 'Notes', type: 'textarea' }
]
const columns = [
  { key: 'name', label: 'Client' }, { key: 'phone', label: 'Phone' }, { key: 'email', label: 'Email' }, { key: 'vehicle_registration', label: 'Reg' }, { key: 'created_at', label: 'Added', format: 'date' as const }
]
</script>
<template><AdminResourcePage resource="clients" title="Clients" description="Contact details, vehicles, consent and a useful history for every customer." singular="client" :fields="fields" :columns="columns" /></template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useSeoMeta({ title: 'Bookings | Black Rivor Admin', robots: 'noindex, nofollow' })
const options = (values: string[]) => values.map(value => ({ label: value.replaceAll('_', ' ').replace(/^./, c => c.toUpperCase()), value }))
const fields = [
  { key: 'title', label: 'Booking title', required: true, placeholder: 'Full wrap — satin black' },
  { key: 'service', label: 'Service', type: 'select', required: true, options: options(['Full colour wrap', 'Paint protection film', 'Window tinting', 'Commercial graphics']) },
  { key: 'vehicle', label: 'Vehicle', required: true, placeholder: '2023 Audi RS3' },
  { key: 'registration', label: 'Registration' },
  { key: 'starts_at', label: 'Starts', type: 'datetime-local', required: true },
  { key: 'ends_at', label: 'Ends', type: 'datetime-local', required: true },
  { key: 'status', label: 'Status', type: 'select', default: 'provisional', options: options(['provisional', 'confirmed', 'in_progress', 'completed', 'cancelled']) },
  { key: 'deposit_amount', label: 'Deposit (£)', type: 'number', step: '0.01', default: 0 },
  { key: 'notes', label: 'Notes', type: 'textarea' }
]
const columns = [
  { key: 'starts_at', label: 'Starts', format: 'datetime' as const }, { key: 'title', label: 'Booking' }, { key: 'vehicle', label: 'Vehicle' }, { key: 'registration', label: 'Reg' }, { key: 'status', label: 'Status', format: 'status' as const }, { key: 'deposit_amount', label: 'Deposit', format: 'currency' as const }
]
</script>
<template><AdminResourcePage resource="bookings" title="Bookings" description="Plan studio capacity and prevent overlapping vehicle slots." singular="booking" :fields="fields" :columns="columns" /></template>

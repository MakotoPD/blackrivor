<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useSeoMeta({ title: 'Jobs | Black Rivor Admin', robots: 'noindex, nofollow' })
const options = (values: string[]) => values.map(value => ({ label: value.replaceAll('_', ' ').replace(/^./, c => c.toUpperCase()), value }))
const fields = [
  { key: 'title', label: 'Job title', required: true },
  { key: 'service', label: 'Service', type: 'select', required: true, options: options(['Full colour wrap', 'Paint protection film', 'Window tinting', 'Commercial graphics']) },
  { key: 'vehicle', label: 'Vehicle', required: true },
  { key: 'registration', label: 'Registration' },
  { key: 'status', label: 'Status', type: 'select', default: 'lead', options: options(['lead', 'quoted', 'approved', 'scheduled', 'in_progress', 'quality_check', 'complete', 'cancelled']) },
  { key: 'quoted_amount', label: 'Quote total (£)', type: 'number', step: '0.01' },
  { key: 'deposit_amount', label: 'Deposit (£)', type: 'number', step: '0.01', default: 0 },
  { key: 'due_date', label: 'Due date', type: 'date' },
  { key: 'notes', label: 'Scope & notes', type: 'textarea' }
]
const columns = [
  { key: 'reference', label: 'Ref' }, { key: 'title', label: 'Job' }, { key: 'vehicle', label: 'Vehicle' }, { key: 'status', label: 'Status', format: 'status' as const }, { key: 'quoted_amount', label: 'Value', format: 'currency' as const }, { key: 'due_date', label: 'Due', format: 'date' as const }
]
</script>
<template><AdminResourcePage resource="jobs" title="Job history" description="Track each job from first quote through fitting, quality control and completion." singular="job" :fields="fields" :columns="columns" /></template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })
useSeoMeta({ title: 'Film Inventory | Black Rivor Admin', robots: 'noindex, nofollow' })
const fields = [
  { key: 'brand', label: 'Brand', required: true, placeholder: '3M' },
  { key: 'name', label: 'Film range', required: true, placeholder: '2080' },
  { key: 'colour', label: 'Colour', required: true },
  { key: 'finish', label: 'Finish', required: true },
  { key: 'sku', label: 'SKU / code' },
  { key: 'roll_width_mm', label: 'Roll width (mm)', type: 'number', default: 1520 },
  { key: 'remaining_metres', label: 'Metres remaining', type: 'number', step: '0.01', default: 0 },
  { key: 'reorder_level', label: 'Reorder at (m)', type: 'number', step: '0.01', default: 5 },
  { key: 'cost_per_metre', label: 'Cost per metre (£)', type: 'number', step: '0.01' },
  { key: 'location', label: 'Storage location' }
]
const columns = [
  { key: 'brand', label: 'Brand' }, { key: 'name', label: 'Range' }, { key: 'colour', label: 'Colour' }, { key: 'finish', label: 'Finish' }, { key: 'remaining_metres', label: 'Remaining', format: 'number' as const }, { key: 'reorder_level', label: 'Reorder at', format: 'number' as const }, { key: 'location', label: 'Location' }
]
</script>
<template><AdminResourcePage resource="inventory" title="Film inventory" description="Know what is on the rack, what it costs and what needs reordering." singular="film" :fields="fields" :columns="columns" /></template>

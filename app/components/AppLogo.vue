<script setup lang="ts">
defineProps<{ dark?: boolean }>()
</script>

<template>
  <NuxtLink to="/" class="group inline-flex items-center gap-3" aria-label="Black Rivor home">
    <span class="grid h-9 w-9 place-items-center rounded-full border transition group-hover:border-acid/60" :class="dark ? 'border-black/15 bg-black/5' : 'border-white/20 bg-white/5'">
      <span class="h-3 w-3 -skew-x-12 bg-acid" />
    </span>
    <span class="font-display text-[15px] font-semibold leading-none tracking-[.18em]" :class="dark ? 'text-ink' : 'text-white'">
      BLACK<span class="text-acid">RIVOR</span>
    </span>
  </NuxtLink>
</template>

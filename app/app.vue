<script setup lang="ts">
useSeoMeta({
  ogSiteName: 'Black Rivor Wrap Studio',
  ogLocale: 'en_GB',
  ogImageAlt: 'Black Rivor Wrap Studio in Sunderland',
  twitterCard: 'summary_large_image'
})

defineOgImage('BlackRivor', {
  title: 'Same car. New attitude.',
  description: 'Premium car wrapping, PPF and window tinting in Sunderland.'
})
</script>

<template>
  <NuxtLoadingIndicator color="#c9ff32" />
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

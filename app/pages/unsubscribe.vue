<script setup lang="ts">
const route = useRoute()
const state = ref<'loading' | 'done' | 'error'>('loading')
const message = ref('Updating your preferences…')

useSeoMeta({ title: 'Unsubscribe | Black Rivor', robots: 'noindex, nofollow' })

onMounted(async () => {
  try {
    await $fetch('/api/public/newsletter/unsubscribe', { method: 'POST', body: { token: route.query.token } })
    state.value = 'done'
    message.value = 'You have been unsubscribed. We will not send further marketing emails.'
  } catch (error: any) {
    state.value = 'error'
    message.value = error?.data?.statusMessage || 'This unsubscribe link is invalid or has expired.'
  }
})
</script>

<template>
  <main class="grid min-h-screen place-items-center bg-paper p-5 text-ink">
    <section class="w-full max-w-lg rounded-2xl border border-black/10 bg-white p-8 text-center shadow-xl sm:p-12">
      <AppLogo dark class="mx-auto" />
      <p class="mt-10 text-[10px] font-bold uppercase tracking-[.18em] text-black/35">Email preferences</p>
      <h1 class="mt-3 font-display text-4xl font-semibold">{{ state === 'done' ? 'Unsubscribed' : state === 'error' ? 'Link unavailable' : 'One moment' }}</h1>
      <p class="mt-4 text-sm leading-6 text-black/55">{{ message }}</p>
      <NuxtLink to="/" class="mt-8 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white">Return to Black Rivor</NuxtLink>
    </section>
  </main>
</template>

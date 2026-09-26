<script setup lang="ts">
import { ArrowRight, Camera, MapPin, Phone } from '@lucide/vue'

const config = useRuntimeConfig()
const email = ref('')
const joined = ref(false)
const pending = ref(false)

async function subscribe() {
  pending.value = true
  try {
    await $fetch('/api/public/newsletter', { method: 'POST', body: { email: email.value, consent: true } })
    joined.value = true
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <footer class="border-t border-white/10 bg-ink text-white">
    <div class="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
      <div class="grid gap-14 border-b border-white/10 pb-16 lg:grid-cols-[1fr_.6fr_.6fr]">
        <div>
          <AppLogo />
          <p class="mt-6 max-w-sm text-sm leading-6 text-white/45">
            Vehicle wrapping, paint protection and window tinting fitted with care in Sunderland, Tyne and Wear.
          </p>
        </div>
        <div>
          <p class="text-xs uppercase tracking-[.18em] text-white/35">Visit & contact</p>
          <div class="mt-5 grid gap-3 text-sm text-white/70">
            <span class="flex items-center gap-3"><MapPin :size="16" /> Sunderland, Tyne and Wear</span>
            <a :href="`tel:${config.public.phone}`" class="flex items-center gap-3 transition hover:text-acid"><Phone :size="16" /> {{ config.public.phone }}</a>
            <a href="#" class="flex items-center gap-3 transition hover:text-acid"><Camera :size="16" /> Instagram</a>
          </div>
        </div>
        <div>
          <p class="text-xs uppercase tracking-[.18em] text-white/35">Stay in the loop</p>
          <p class="mt-5 text-sm leading-6 text-white/55">New finishes, recent transformations and the occasional open slot.</p>
          <p v-if="joined" class="mt-5 text-sm font-semibold text-acid">You’re on the list.</p>
          <form v-else class="mt-5 flex border-b border-white/20" @submit.prevent="subscribe">
            <input v-model="email" required type="email" autocomplete="email" placeholder="Your email" aria-label="Email for newsletter" class="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-white/25">
            <button type="submit" :disabled="pending" class="px-2 text-acid" aria-label="Join newsletter"><ArrowRight :size="18" /></button>
          </form>
        </div>
      </div>
      <div class="flex flex-col gap-3 pt-6 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">
        <span>© {{ new Date().getFullYear() }} Black Rivor Wrap Studio.</span>
        <span>Privacy · Terms · Admin</span>
      </div>
    </div>
  </footer>
</template>

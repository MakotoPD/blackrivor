<script setup lang="ts">
import { ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole } from '@lucide/vue'

definePageMeta({ layout: false })
useSeoMeta({ title: 'Admin sign in | Black Rivor', robots: 'noindex, nofollow' })

const route = useRoute()
const email = ref('admin@blackrivor.co.uk')
const password = ref('')
const showPassword = ref(false)
const pending = ref(false)
const error = ref('')

async function login() {
  pending.value = true
  error.value = ''
  try {
    await $fetch('/api/admin/login', { method: 'POST', body: { email: email.value, password: password.value } })
    await navigateTo(String(route.query.redirect || '/admin'))
  } catch (requestError: any) {
    error.value = requestError?.data?.statusMessage || 'Could not sign in.'
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <main class="grid min-h-screen bg-[#11110f] lg:grid-cols-2">
    <section class="hidden overflow-hidden border-r border-white/10 p-10 text-white lg:flex lg:flex-col">
      <AppLogo />
      <div class="my-auto max-w-xl">
        <p class="eyebrow text-acid">Studio command centre</p>
        <h1 class="mt-6 font-display text-7xl font-semibold uppercase leading-[.85] tracking-[-.06em]">Every car.<br>Every detail.</h1>
        <p class="mt-7 max-w-md text-base leading-7 text-white/45">Keep enquiries, bookings, jobs, stock and client history in one focused workspace.</p>
      </div>
      <p class="text-xs text-white/25">Black Rivor Wrap Studio · Sunderland</p>
    </section>

    <section class="grid place-items-center bg-[#f4f4f0] px-5 py-12 text-ink">
      <div class="w-full max-w-md">
        <span class="grid h-12 w-12 place-items-center rounded-full bg-ink text-acid"><LockKeyhole :size="21" /></span>
        <h2 class="mt-8 font-display text-4xl font-semibold tracking-[-.04em]">Welcome back.</h2>
        <p class="mt-2 text-sm text-black/45">Sign in to manage the studio.</p>
        <form class="mt-9 grid gap-5" @submit.prevent="login">
          <label class="grid gap-2"><span class="text-xs font-semibold text-black/55">Email address</span><input v-model="email" required type="email" autocomplete="username" class="login-input"></label>
          <label class="grid gap-2">
            <span class="text-xs font-semibold text-black/55">Password</span>
            <span class="relative"><input v-model="password" required :type="showPassword ? 'text' : 'password'" autocomplete="current-password" class="login-input pr-12"><button type="button" class="absolute inset-y-0 right-0 grid w-11 place-items-center text-black/40" :aria-label="showPassword ? 'Hide password' : 'Show password'" @click="showPassword = !showPassword"><EyeOff v-if="showPassword" :size="17" /><Eye v-else :size="17" /></button></span>
          </label>
          <p v-if="error" class="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{{ error }}</p>
          <button type="submit" :disabled="pending" class="group flex min-h-12 items-center justify-between rounded-full bg-ink px-5 font-semibold text-white transition hover:bg-acid hover:text-ink disabled:opacity-60"><span>{{ pending ? 'Signing in...' : 'Sign in' }}</span><LoaderCircle v-if="pending" :size="18" class="animate-spin" /><ArrowRight v-else :size="18" class="transition group-hover:translate-x-1" /></button>
        </form>
        <NuxtLink to="/" class="mt-8 inline-block text-xs text-black/40 transition hover:text-black">← Back to website</NuxtLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.login-input { min-height: 3rem; width: 100%; border: 1px solid rgb(0 0 0 / .14); border-radius: .6rem; background: white; padding: .75rem; outline: none; }
.login-input:focus { border-color: #171714; box-shadow: 0 0 0 3px rgb(0 0 0 / .05); }
</style>


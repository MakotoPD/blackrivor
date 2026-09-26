<script setup lang="ts">
import { ArrowRight, Check, LoaderCircle } from '@lucide/vue'

const form = reactive({
  name: '',
  email: '',
  phone: '',
  postcode: '',
  vehicle: '',
  registration: '',
  service: 'Full colour wrap',
  finish: 'Not sure yet',
  message: '',
  consent: false
})
const pending = ref(false)
const sent = ref(false)
const error = ref('')

const services = ['Full colour wrap', 'Paint protection film', 'Window tinting', 'Commercial graphics']

async function submit() {
  pending.value = true
  error.value = ''
  try {
    await $fetch('/api/public/enquiries', { method: 'POST', body: form })
    sent.value = true
  } catch (requestError: any) {
    error.value = requestError?.data?.statusMessage || 'Something went wrong. Please try again or call us.'
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <section id="quote" class="relative overflow-hidden bg-acid text-ink">
    <div class="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border border-black/10" />
    <div class="absolute -right-20 -top-20 h-[340px] w-[340px] rounded-full border border-black/10" />
    <div class="relative mx-auto grid max-w-[1500px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[.75fr_1.25fr] lg:px-12 lg:py-32">
      <div>
        <p class="eyebrow text-black/50">Your car. Your call.</p>
        <h2 class="mt-6 font-display text-[clamp(3rem,6vw,6.5rem)] font-semibold uppercase leading-[.85] tracking-[-.06em]">
          Let’s make<br>it yours.
        </h2>
        <p class="mt-7 max-w-md text-base leading-7 text-black/60">
          Tell us what you drive and what you have in mind. Add your registration if you know it — we’ll reply with the right questions and a clear next step.
        </p>
        <div class="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold">
          <span class="inline-flex items-center gap-2"><Check :size="16" /> Free estimate</span>
          <span class="inline-flex items-center gap-2"><Check :size="16" /> No hard sell</span>
          <span class="inline-flex items-center gap-2"><Check :size="16" /> Direct reply</span>
        </div>
      </div>

      <div v-if="sent" class="grid min-h-[480px] place-items-center border border-black/15 bg-black p-8 text-center text-white sm:p-12">
        <div>
          <span class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-acid text-ink"><Check :size="26" /></span>
          <h3 class="mt-8 font-display text-4xl font-semibold">Enquiry received.</h3>
          <p class="mx-auto mt-4 max-w-md text-white/55">Thanks, {{ form.name }}. We’ll take a look and get back to you shortly.</p>
        </div>
      </div>

      <form v-else class="grid gap-x-5 gap-y-6 bg-ink p-6 text-white sm:grid-cols-2 sm:p-9" @submit.prevent="submit">
        <label class="field">
          <span>Your name *</span>
          <input v-model="form.name" required autocomplete="name" placeholder="Alex Morgan">
        </label>
        <label class="field">
          <span>Phone number *</span>
          <input v-model="form.phone" required autocomplete="tel" inputmode="tel" placeholder="+44 7...">
        </label>
        <label class="field">
          <span>Email *</span>
          <input v-model="form.email" required type="email" autocomplete="email" placeholder="alex@example.com">
        </label>
        <label class="field">
          <span>Postcode</span>
          <input v-model="form.postcode" autocomplete="postal-code" placeholder="SR1 1AA">
        </label>
        <label class="field">
          <span>Vehicle *</span>
          <input v-model="form.vehicle" required placeholder="2022 Audi A5">
        </label>
        <label class="field">
          <span>Registration</span>
          <input v-model="form.registration" class="uppercase" placeholder="AB12 CDE">
        </label>
        <label class="field sm:col-span-2">
          <span>Service *</span>
          <select v-model="form.service" required>
            <option v-for="service in services" :key="service">{{ service }}</option>
          </select>
        </label>
        <label class="field sm:col-span-2">
          <span>Finish or colour</span>
          <input v-model="form.finish" placeholder="Gloss black, satin green, not sure yet...">
        </label>
        <label class="field sm:col-span-2">
          <span>Anything else?</span>
          <textarea v-model="form.message" rows="3" placeholder="Tell us what you would like covered, your preferred timing, or any questions." />
        </label>
        <label class="flex items-start gap-3 text-xs leading-5 text-white/45 sm:col-span-2">
          <input v-model="form.consent" required type="checkbox" class="mt-1 h-4 w-4 accent-[#c9ff32]">
          <span>I agree that Black Rivor may use these details to reply to my enquiry. My details won’t be added to marketing lists.</span>
        </label>
        <p v-if="error" class="text-sm text-red-300 sm:col-span-2" role="alert">{{ error }}</p>
        <button
          type="submit"
          :disabled="pending"
          class="group flex min-h-14 items-center justify-between bg-acid px-5 font-semibold text-ink transition hover:bg-white disabled:cursor-wait disabled:opacity-70 sm:col-span-2"
        >
          {{ pending ? 'Sending...' : 'Request my free quote' }}
          <LoaderCircle v-if="pending" :size="19" class="animate-spin" />
          <ArrowRight v-else :size="19" class="transition group-hover:translate-x-1" />
        </button>
      </form>
    </div>
  </section>
</template>

<style scoped>
.field { display: grid; gap: .55rem; }
.field > span { font-size: .7rem; font-weight: 600; letter-spacing: .12em; text-transform: uppercase; color: rgb(255 255 255 / .42); }
.field input,
.field select,
.field textarea {
  width: 100%; border: 0; border-bottom: 1px solid rgb(255 255 255 / .18); border-radius: 0;
  background: transparent; padding: .65rem 0 .85rem; color: white; outline: none;
  transition: border-color .2s ease; appearance: none;
}
.field input:focus,
.field select:focus,
.field textarea:focus { border-color: #c9ff32; }
.field input::placeholder,
.field textarea::placeholder { color: rgb(255 255 255 / .25); }
.field select option { background: #141414; }
</style>


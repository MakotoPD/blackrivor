<script setup lang="ts">
useSeoMeta({ title: 'Privacy Notice | Black Rivor', description: 'How Black Rivor Wrap Studio handles personal data and marketing consent.' })
const config = useRuntimeConfig()
</script>

<template>
  <main class="min-h-screen bg-paper text-ink">
    <LegalPageHeader />
    <article class="prose-legal mx-auto max-w-[900px] px-5 py-20 sm:px-8 sm:py-28">
      <p class="eyebrow text-black/40">Legal</p>
      <h1>Privacy notice</h1>
      <p class="lead">This notice explains how Black Rivor Wrap Studio uses the details you give us when requesting a quote, making a booking or joining our mailing list.</p>

      <h2>What we collect</h2>
      <p>We may collect your name, contact details, postcode, vehicle information, enquiry messages, booking and job history, payment status and marketing preferences. We do not collect card details through this website.</p>

      <h2>Why we use it</h2>
      <p>We use personal data to answer enquiries, prepare quotes, manage bookings, carry out agreed work, maintain service records and meet legal or accounting obligations. We rely on consent for newsletter marketing and legitimate interests or contract for normal customer service.</p>

      <h2>Marketing</h2>
      <p>We only add you to the newsletter when you actively subscribe. You can withdraw consent at any time by contacting us or using the unsubscribe link included in a future campaign.</p>

      <h2>Storage and sharing</h2>
      <p>Data is stored in our secured customer system and is only shared with service providers where needed to operate the business, subject to appropriate safeguards. We do not sell personal data.</p>

      <h2>How long we keep it</h2>
      <p>Enquiry data is reviewed regularly. Customer and job records may be retained for up to six years where needed for service, tax or legal purposes. Newsletter records are kept until you unsubscribe or the address is no longer usable.</p>

      <h2>Your rights</h2>
      <p>Under UK data protection law you may ask for access, correction, deletion, restriction, portability or object to certain uses. You may also complain to the Information Commissioner’s Office at ico.org.uk.</p>

      <h2>Contact</h2>
      <p>For privacy questions or requests, email <a :href="`mailto:${config.public.email}`">{{ config.public.email }}</a>. This notice was last updated on 26 September 2026.</p>
    </article>
  </main>
</template>

<style scoped>
.prose-legal h1 { margin-top: 1.5rem; font-family: var(--font-display); font-size: clamp(3rem, 7vw, 6rem); font-weight: 600; line-height: .9; letter-spacing: -.055em; text-transform: uppercase; }
.prose-legal .lead { margin-top: 2rem; max-width: 45rem; font-size: 1.15rem; line-height: 1.8; color: rgb(0 0 0 / .58); }
.prose-legal h2 { margin-top: 3.5rem; font-family: var(--font-display); font-size: 1.6rem; font-weight: 600; }
.prose-legal h2 + p { margin-top: .8rem; max-width: 45rem; line-height: 1.8; color: rgb(0 0 0 / .58); }
.prose-legal a { text-decoration: underline; }
</style>


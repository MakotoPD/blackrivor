<script setup lang="ts">
useSeoMeta({ title: 'Service Terms | Black Rivor', description: 'Booking, deposit and vehicle preparation terms for Black Rivor Wrap Studio.' })
</script>

<template>
  <main class="min-h-screen bg-paper text-ink">
    <LegalPageHeader />
    <article class="prose-legal mx-auto max-w-[900px] px-5 py-20 sm:px-8 sm:py-28">
      <p class="eyebrow text-black/40">Legal</p>
      <h1>Service terms</h1>
      <p class="lead">These headline terms keep quotations, bookings and handovers clear. Your written quote will always set out the exact work agreed for your vehicle.</p>

      <h2>Quotes and bookings</h2>
      <p>Guide prices on the website are not fixed quotations. Final pricing depends on the vehicle, existing paint condition, film, finish and coverage. A booking is confirmed once the stated material deposit has cleared.</p>

      <h2>Deposits and cancellations</h2>
      <p>Deposits cover reserved workshop time and materials ordered for your job. Cancellation and rescheduling terms will be confirmed with your quote because custom-cut or specially ordered film may not be refundable.</p>

      <h2>Vehicle condition</h2>
      <p>Please disclose repairs, resprays, corrosion, lacquer failure, ceramic coatings or other surface treatments before booking. Vinyl and PPF can only perform correctly on sound, suitably prepared paint. We may decline unsafe or unsuitable surfaces.</p>

      <h2>Timing and collection</h2>
      <p>Estimated completion dates are given in good faith and can change if hidden paint issues or additional preparation are found. The remaining balance is due after inspection and before the vehicle leaves the studio.</p>

      <h2>Aftercare</h2>
      <p>You will receive care guidance at handover. Avoid pressure washing edges, aggressive chemicals and automatic brush washes. Contact us promptly if you notice lifting or another fitting concern.</p>

      <h2>Window tinting</h2>
      <p>Front glazing must remain within current UK legal light-transmission limits. We will advise on compliant options; the vehicle owner remains responsible for keeping the vehicle road legal after any later modification.</p>
    </article>
  </main>
</template>

<style scoped>
.prose-legal h1 { margin-top: 1.5rem; font-family: var(--font-display); font-size: clamp(3rem, 7vw, 6rem); font-weight: 600; line-height: .9; letter-spacing: -.055em; text-transform: uppercase; }
.prose-legal .lead { margin-top: 2rem; max-width: 45rem; font-size: 1.15rem; line-height: 1.8; color: rgb(0 0 0 / .58); }
.prose-legal h2 { margin-top: 3.5rem; font-family: var(--font-display); font-size: 1.6rem; font-weight: 600; }
.prose-legal h2 + p { margin-top: .8rem; max-width: 45rem; line-height: 1.8; color: rgb(0 0 0 / .58); }
</style>

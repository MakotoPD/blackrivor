<script setup lang="ts">
import { ArrowRight, ArrowUpRight, Check, ShieldCheck, Sparkles, SunMedium } from '@lucide/vue'

useSeoMeta({
  title: 'Car Wrapping, PPF & Window Tinting in Sunderland',
  description: 'Premium car wrapping, paint protection film and window tinting in Sunderland. Direct service, precise fitting and clear UK pricing.',
  ogTitle: 'Black Rivor Wrap Studio — Sunderland',
  ogDescription: 'Same car. New attitude. Precision vehicle wrapping, PPF and tinting in Sunderland.',
  ogType: 'website'
})

const services = [
  { number: '01', title: 'Colour change wraps', text: 'Gloss, satin, matte and speciality finishes fitted edge to edge for a clean, factory-like transformation.', price: 'From £600' },
  { number: '02', title: 'Paint protection film', text: 'Clear or satin PPF shields high-impact areas from stone chips, road debris and everyday wear.', price: 'Tailored quote' },
  { number: '03', title: 'Window tinting', text: 'A sharper look, more privacy and reduced glare with road-legal film fitted cleanly to your glass.', price: 'From £70' },
  { number: '04', title: 'Commercial graphics', text: 'Turn your van or fleet into a moving brand asset with considered graphics, lettering and partial wraps.', price: 'Tailored quote' }
]

useSchemaOrg(services.map(service => defineService({
  '@id': `#service-${service.number}`,
  name: service.title,
  description: service.text,
  serviceType: service.title,
  areaServed: 'Sunderland and North East England'
})))

const faqs = ref([
  { q: 'How long does a full wrap take?', a: 'Most full colour changes take three to five working days, depending on the vehicle, coverage and film. We confirm timing before your booking.', open: true },
  { q: 'Will a wrap damage my paint?', a: 'Quality film applied to sound factory paint should not damage it. We inspect the car before accepting the job and flag repairs, resprays or weak lacquer first.', open: false },
  { q: 'How long will the vinyl last?', a: 'With the right care, premium cast vinyl typically looks its best for around five to seven years. Exposure, mileage and maintenance all play a part.', open: false },
  { q: 'Do I need to pay everything upfront?', a: 'No. A material deposit secures your slot and orders the chosen film. The remaining balance is due after you inspect and approve the completed work.', open: false },
  { q: 'Are your window tints UK legal?', a: 'Yes. We advise on current UK limits and only fit road-legal film to front windows. Rear glass can be tinted more heavily.', open: false }
])

const pageRoot = ref<HTMLElement | null>(null)
let revealContext: { revert: () => void } | undefined

onMounted(async () => {
  const root = pageRoot.value
  if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
  gsap.registerPlugin(ScrollTrigger)
  revealContext = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
      gsap.from(element, {
        opacity: 0,
        y: 42,
        duration: .85,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
        scrollTrigger: { trigger: element, start: 'top 88%', once: true }
      })
    })
  }, root)
})

onBeforeUnmount(() => revealContext?.revert())
</script>

<template>
  <main ref="pageRoot">
    <HeroSection />

    <section class="overflow-hidden border-y border-white/10 bg-acid py-4 text-ink" aria-label="Services ticker">
      <div class="marquee flex w-max items-center gap-8 font-display text-sm font-semibold uppercase tracking-[.16em]">
        <template v-for="repeat in 2" :key="repeat">
          <span>Full colour wraps</span><span>✦</span><span>Paint protection</span><span>✦</span><span>Window tinting</span><span>✦</span><span>Commercial graphics</span><span>✦</span>
        </template>
      </div>
    </section>

    <section id="services" class="bg-ink text-white">
      <div class="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div data-reveal class="grid gap-8 lg:grid-cols-[.65fr_1.35fr] lg:items-end">
          <p class="eyebrow text-white/40">What we do</p>
          <h2 class="font-display text-[clamp(2.75rem,6.2vw,6.8rem)] font-semibold uppercase leading-[.87] tracking-[-.055em]">
            More than a<br><span class="text-acid">colour change.</span>
          </h2>
        </div>

        <div class="mt-16 grid border-t border-white/15 md:grid-cols-2 xl:grid-cols-4">
          <article v-for="service in services" :key="service.number" data-reveal class="group flex min-h-[360px] flex-col border-b border-white/15 py-7 md:border-r md:px-6 xl:min-h-[420px] first:pl-0 last:border-r-0">
            <div class="flex items-center justify-between text-xs text-white/35">
              <span>{{ service.number }}</span>
              <ArrowUpRight :size="18" class="transition duration-300 group-hover:rotate-45 group-hover:text-acid" />
            </div>
            <div class="mt-auto">
              <p class="mb-5 text-xs font-semibold uppercase tracking-[.14em] text-acid">{{ service.price }}</p>
              <h3 class="font-display text-3xl font-semibold leading-none">{{ service.title }}</h3>
              <p class="mt-5 text-sm leading-6 text-white/45">{{ service.text }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="bg-paper text-ink">
      <div class="mx-auto grid max-w-[1500px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:px-12 lg:py-32">
        <div data-reveal class="relative min-h-[480px] overflow-hidden sm:min-h-[620px]">
          <img src="/images/gallery-workshop.jpg" alt="Performance car in a specialist workshop" class="absolute inset-0 h-full w-full object-cover" width="1800" height="1013" loading="lazy">
          <div class="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
          <div class="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white sm:bottom-8 sm:left-8 sm:right-8">
            <p class="max-w-[210px] text-sm leading-6 text-white/65">One vehicle at a time. No rushed assembly line.</p>
            <span class="font-display text-6xl font-semibold text-acid">100%</span>
          </div>
        </div>
        <div data-reveal class="flex flex-col justify-center lg:pl-14">
          <p class="eyebrow text-black/40">The Black Rivor standard</p>
          <h2 class="mt-6 font-display text-[clamp(2.75rem,5vw,5.7rem)] font-semibold uppercase leading-[.88] tracking-[-.05em]">
            Your car gets<br>our full focus.
          </h2>
          <p class="mt-8 max-w-xl text-lg leading-8 text-black/55">
            You deal directly with the person fitting your car. From panel preparation to the last heat cycle, every stage is handled with patience, sharp edges and honest communication.
          </p>
          <div class="mt-10 grid gap-6 border-t border-black/15 pt-8 sm:grid-cols-3">
            <div><strong class="font-display text-3xl">1:1</strong><p class="mt-2 text-xs leading-5 text-black/45">Direct installer contact</p></div>
            <div><strong class="font-display text-3xl">05–07</strong><p class="mt-2 text-xs leading-5 text-black/45">Years typical film life</p></div>
            <div><strong class="font-display text-3xl">UK</strong><p class="mt-2 text-xs leading-5 text-black/45">Road-legal tint advice</p></div>
          </div>
          <a href="#quote" class="group mt-10 inline-flex w-fit items-center gap-3 border-b border-black pb-2 text-sm font-semibold">
            Talk through your car <ArrowRight :size="17" class="transition group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>

    <section id="work" class="bg-ink text-white">
      <div class="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div class="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div data-reveal>
            <p class="eyebrow text-white/40">Built to be noticed</p>
            <h2 class="mt-6 font-display text-[clamp(3rem,6vw,6.5rem)] font-semibold uppercase leading-[.86] tracking-[-.055em]">Fresh finish.<br>Clean detail.</h2>
          </div>
          <p data-reveal class="max-w-sm text-sm leading-6 text-white/45">A finish only works when the details disappear: even tension, tucked edges and body lines that still look intentional.</p>
        </div>

        <div class="mt-16 grid auto-rows-[260px] gap-3 sm:auto-rows-[340px] lg:grid-cols-12 lg:auto-rows-[360px]">
          <figure data-reveal class="group relative overflow-hidden lg:col-span-7 lg:row-span-2">
            <img src="/images/gallery-studio.jpg" alt="Silver performance car in studio light" class="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" width="1800" height="1063" loading="lazy">
            <figcaption class="image-caption"><span>Full wrap</span><strong>Satin silver</strong></figcaption>
          </figure>
          <figure data-reveal class="group relative overflow-hidden lg:col-span-5">
            <img src="/images/gallery-detail.jpg" alt="Premium car interior and exterior detail" class="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" width="1800" height="1266" loading="lazy">
            <figcaption class="image-caption"><span>Detail</span><strong>Every edge matters</strong></figcaption>
          </figure>
          <figure data-reveal class="group relative overflow-hidden lg:col-span-5">
            <img src="/images/gallery-road.jpg" alt="Dark sports car on an open road" class="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" width="1800" height="1200" loading="lazy">
            <figcaption class="image-caption"><span>Protection</span><strong>Ready for the road</strong></figcaption>
          </figure>
        </div>
      </div>
    </section>

    <ProcessSection />

    <section id="pricing" class="bg-ink text-white">
      <div class="mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div class="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div data-reveal>
            <p class="eyebrow text-white/40">Guide pricing</p>
            <h2 class="mt-6 font-display text-[clamp(2.8rem,5.8vw,6.2rem)] font-semibold uppercase leading-[.87] tracking-[-.05em]">Premium look.<br>Fair price.</h2>
          </div>
          <p data-reveal class="max-w-xl text-base leading-7 text-white/45 lg:justify-self-end">Every quote is based on the actual car, panel complexity and film. These ranges give you an honest place to start.</p>
        </div>

        <div class="mt-16 grid gap-px bg-white/15 lg:grid-cols-3">
          <article data-reveal class="price-card">
            <p class="eyebrow text-acid">Small</p><h3>Hatchback</h3><strong>£600–£800</strong><p>Fiesta, Polo, Golf-class cars. Full colour change in matte, gloss or satin.</p>
          </article>
          <article data-reveal class="price-card featured">
            <div class="mb-8 flex items-center justify-between"><p class="eyebrow text-acid">Medium</p><span class="rounded-full bg-acid px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">Most popular</span></div>
            <h3>Saloon / Coupé</h3><strong>£700–£900</strong><p>Saloons, coupés and larger hatchbacks, measured and fitted to suit their body shape.</p>
          </article>
          <article data-reveal class="price-card">
            <p class="eyebrow text-acid">Large</p><h3>SUV / Estate</h3><strong>£800–£1,300</strong><p>SUVs, estates and large saloons. Maximum coverage with the same considered finish.</p>
          </article>
        </div>

        <div class="mt-8 grid gap-4 text-sm sm:grid-cols-3">
          <div data-reveal class="benefit"><ShieldCheck :size="20" /><span>Material deposit secures your slot</span></div>
          <div data-reveal class="benefit"><Sparkles :size="20" /><span>Matte, gloss, satin and speciality films</span></div>
          <div data-reveal class="benefit"><SunMedium :size="20" /><span>Balance after your final inspection</span></div>
        </div>
      </div>
    </section>

    <section class="bg-paper text-ink">
      <div class="mx-auto grid max-w-[1500px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-12 lg:py-32">
        <div data-reveal>
          <p class="eyebrow text-black/40">Before you book</p>
          <h2 class="mt-6 font-display text-[clamp(2.8rem,5vw,5.6rem)] font-semibold uppercase leading-[.88] tracking-[-.05em]">Good questions.<br>Clear answers.</h2>
        </div>
        <div data-reveal class="border-t border-black/15">
          <article v-for="faq in faqs" :key="faq.q" class="border-b border-black/15">
            <button type="button" class="flex w-full items-center justify-between gap-5 py-6 text-left font-display text-lg font-semibold sm:text-2xl" :aria-expanded="faq.open" @click="faq.open = !faq.open">
              {{ faq.q }}<span class="text-2xl font-light">{{ faq.open ? '−' : '+' }}</span>
            </button>
            <div v-if="faq.open" class="max-w-2xl pb-7 text-sm leading-7 text-black/55 sm:text-base">{{ faq.a }}</div>
          </article>
        </div>
      </div>
    </section>

    <QuoteForm />
    <SiteFooter />
  </main>
</template>

<style scoped>
.marquee { animation: marquee 22s linear infinite; }
@keyframes marquee { to { transform: translateX(-50%); } }
.image-caption { position: absolute; inset: auto 1.5rem 1.5rem; display: flex; align-items: end; justify-content: space-between; gap: 1rem; color: white; }
.image-caption::before { content: ''; position: absolute; z-index: -1; inset: -6rem -1.5rem -1.5rem; background: linear-gradient(transparent, rgb(0 0 0 / .72)); }
.image-caption span { font-size: .65rem; letter-spacing: .14em; text-transform: uppercase; color: rgb(255 255 255 / .55); }
.image-caption strong { font-family: var(--font-display); font-size: 1.1rem; }
.price-card { display: flex; min-height: 430px; flex-direction: column; background: #0a0a0a; padding: 2rem; }
.price-card h3 { margin-top: auto; font-family: var(--font-display); font-size: clamp(1.8rem, 3vw, 2.6rem); font-weight: 600; }
.price-card strong { margin-top: .8rem; font-family: var(--font-display); font-size: clamp(2.2rem, 3vw, 3.5rem); color: #c9ff32; }
.price-card > p:last-child { margin-top: 1.5rem; max-width: 22rem; font-size: .875rem; line-height: 1.6; color: rgb(255 255 255 / .42); }
.price-card.featured { background: #151515; }
.benefit { display: flex; align-items: center; gap: .75rem; border: 1px solid rgb(255 255 255 / .12); padding: 1rem; color: rgb(255 255 255 / .62); }
.benefit :deep(svg) { flex: 0 0 auto; color: #c9ff32; }
@media (prefers-reduced-motion: reduce) { .marquee { animation: none; } }
</style>

import Link from 'next/link'
import {
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Zap,
  Music,
  Monitor,
  Pen,
  ShieldCheck,
  Music as MusicIcon,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { searchListings } from '@/lib/services/listings.service'
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel'
import type { Listing } from '@/lib/types'
import { createPublicPageMetadata } from '@/lib/seo'

export const metadata = createPublicPageMetadata({
  path: '/',
  title: 'Musical Instrument Marketplace & Gear Guides | Suede AI',
  description: 'Browse musical instruments on suedeMarket by Suede AI. Prepare a detailed gear listing and compare condition, compatibility, accessories and handoff terms.',
})

const HERO_CATEGORIES = [
  { label: 'Guitars', slug: 'guitars' },
  { label: 'Acoustic & Electronic', slug: 'keyboards' },
  { label: 'Drums', slug: 'drums' },
  { label: 'Headphones', slug: 'pro-audio' },
  { label: 'Bass', slug: 'bass-guitars' },
  { label: 'Amps & Effects', slug: 'amps-effects' },
  { label: 'DJ / Electronic', slug: 'dj-electronic' },
  { label: 'Strings', slug: 'strings' },
  { label: 'Pro Audio', slug: 'pro-audio' },
  { label: 'Accessories', slug: 'accessories' },
]

const CATEGORY_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&q=80', alt: 'Acoustic guitar', tall: true },
  { src: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&q=80', alt: 'Studio gear' },
  { src: 'https://images.unsplash.com/photo-1524578471438-cdd96d68d82c?w=500&q=80', alt: 'Violin' },
  { src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', alt: 'Headphones' },
  { src: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=500&q=80', alt: 'Drums', tall: true },
]

const AGENT_FEATURES = [
  { title: 'Describe the exact instrument', desc: 'Include maker, model, condition, modifications, and accessories. Explain what you tested and what needs attention.' },
  { title: 'Show the details', desc: 'Photograph the whole instrument, identifying marks, controls, connectors, and wear. Include close-ups of repairs.' },
  { title: 'Agree the handoff', desc: 'Discuss collection or shipping, packing, included items, and the agreed terms. Keep the conversation with the listing record.' },
]

const GEAR_CHECKS = [
  { icon: Zap, name: 'Amps & effects', desc: 'Confirm voltage, the required power supply, noise, switching, and all inputs and outputs.' },
  { icon: Music, name: 'Guitars & basses', desc: 'Ask about fret wear, neck condition, electronics, repairs, and changed parts.' },
  { icon: Monitor, name: 'Studio equipment', desc: 'Check computer compatibility, connections, included adapters, and software licenses separately.' },
  { icon: Pen, name: 'Keys & drums', desc: 'Check every key, pad, pedal, trigger, stand, and the pieces included in the pictured setup.' },
]

const FOOTER_SHOP = [
  { label: 'Guitars', href: '/listings?category=guitars' },
  { label: 'Amps & Effects', href: '/listings?category=amps-effects' },
  { label: 'Drums & Percussion', href: '/listings?category=drums' },
  { label: 'Synths & Keyboards', href: '/listings?category=keyboards' },
  { label: 'All Instruments', href: '/listings' },
]

const FOOTER_MARKETPLACE = [
  { label: "AI Instructions", href: "/ai-instructions" },
  { label: 'Selling as an Agent', href: '/register' },
  { label: 'Prepare a Listing', href: '#selling-guide' },
  { label: 'Buying Checklist', href: '#buying-guide' },
]

const FOOTER_RESOURCES = [
  { label: 'Guitar Rig Archive', href: 'https://dna.suedeai.ai/' },
  { label: 'Signal Chain Guides', href: 'https://strumly.suedeai.ai/guides' },
  { label: 'Guitar Community', href: 'https://social.suedeai.ai/' },
]

export default async function HomePage() {
  let listings: Listing[] = []
  try {
    const supabase = await createClient()
    ;({ listings } = await searchListings(supabase, { limit: 5, sort: 'newest' }))
  } catch (error) {
    console.error('[home] failed to load featured listings', error)
  }

  return (
    <main>
      {/* ═══════════════════════════════════════════════════════════════════
          HERO — full viewport, dark cinematic
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0f0f14]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f14]/60 via-transparent to-[#0f0f14]" />

        <div className="relative z-10 flex flex-col items-center px-4 text-center">
          <p className="text-[13px] font-medium tracking-[0.35em] text-white/50 uppercase">
            The Instrument Marketplace
          </p>
          <h1 className="mt-6">
            <span className="block text-[clamp(4rem,12vw,9rem)] font-light leading-[0.9] tracking-tight text-white">
              suede
            </span>
            <span className="block font-serif text-[clamp(4rem,12vw,9rem)] font-light italic leading-[0.9] tracking-tight text-white">
              Market
            </span>
          </h1>
          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-white/50">
            Browse musical instruments, compare condition and specifications,
            and prepare a clear gear listing with Suede AI.
          </p>
          <form
            action="/listings"
            method="get"
            className="mt-10 flex w-full max-w-lg items-center overflow-hidden rounded-sm border border-white/15 bg-white/5 backdrop-blur-sm transition-colors focus-within:border-white/30"
          >
            <Search className="ml-4 h-4 w-4 shrink-0 text-white/30" />
            <input
              name="q"
              type="text"
              placeholder="Search instruments..."
              className="flex-1 bg-transparent px-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none"
            />
            <button
              type="submit"
              className="h-full border-l border-white/15 px-6 py-3.5 text-[12px] font-semibold tracking-[0.2em] text-white/60 uppercase transition-colors hover:bg-white/5 hover:text-white"
            >
              Search
            </button>
          </form>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="mx-auto max-w-7xl px-6 pb-8">
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {HERO_CATEGORIES.map(({ label, slug }) => (
                <Link
                  key={slug + label}
                  href={`/listings?category=${slug}`}
                  className="text-[12px] font-medium tracking-[0.1em] text-white/30 uppercase transition-colors hover:text-white/70"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SHOP BY CATEGORY — light bg, masonry-style images
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#f8f7f5] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          {/* Header row */}
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-[12px] font-medium tracking-[0.35em] text-primary/40 uppercase">
                Collections
              </p>
              <h2 className="mt-4">
                <span className="block text-[clamp(2.5rem,6vw,4rem)] font-light leading-[1] tracking-tight text-primary">
                  Shop by
                </span>
                <span className="block font-serif text-[clamp(2.5rem,6vw,4rem)] font-light italic leading-[1] tracking-tight text-primary">
                  Category
                </span>
              </h2>
            </div>
            <div className="flex flex-col justify-end lg:items-end">
              <p className="max-w-xs text-[14px] leading-relaxed text-primary/40 lg:text-right">
                Browse by instrument, then compare condition, specifications,
                included accessories, and the seller&apos;s description.
              </p>
              <Link
                href="/listings"
                className="mt-6 inline-flex items-center gap-2 text-[12px] font-semibold tracking-[0.2em] text-primary uppercase hover:opacity-70"
              >
                View All Collections
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Image grid — staggered masonry with offset columns */}
          <div className="mt-16 hidden gap-4 md:grid md:grid-cols-4">
            {/* Col 1 — tall single image, pushed down to create stagger */}
            <div className="mt-16">
              <div className="overflow-hidden rounded-sm">
                <img
                  src={CATEGORY_IMAGES[0].src}
                  alt={CATEGORY_IMAGES[0].alt}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>

            {/* Col 2 — taller top image + shorter bottom image */}
            <div className="flex flex-col gap-4">
              <div className="overflow-hidden rounded-sm">
                <img
                  src={CATEGORY_IMAGES[1].src}
                  alt={CATEGORY_IMAGES[1].alt}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="overflow-hidden rounded-sm">
                <img
                  src={CATEGORY_IMAGES[2].src}
                  alt={CATEGORY_IMAGES[2].alt}
                  className="aspect-[5/4] w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>

            {/* Col 3 — shorter placeholder top + taller image bottom */}
            <div className="flex flex-col gap-4">
              <div className="flex aspect-[5/3] items-center justify-center rounded-sm border border-primary/8 bg-white">
                <MusicIcon className="h-8 w-8 text-primary/10" />
              </div>
              <div className="overflow-hidden rounded-sm">
                <img
                  src={CATEGORY_IMAGES[3].src}
                  alt={CATEGORY_IMAGES[3].alt}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>

            {/* Col 4 — tall single image, starts at top */}
            <div className="-mt-2">
              <div className="overflow-hidden rounded-sm">
                <img
                  src={CATEGORY_IMAGES[4].src}
                  alt={CATEGORY_IMAGES[4].alt}
                  className="aspect-[3/4] w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* Mobile: simple 2-col grid */}
          <div className="mt-12 grid grid-cols-2 gap-3 md:hidden">
            {CATEGORY_IMAGES.map(({ src, alt }) => (
              <div key={alt} className="overflow-hidden rounded-sm">
                <img src={src} alt={alt} className="aspect-[4/3] w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FEATURED LISTINGS — dark bg, full-bleed carousel
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#1a1a22] px-6 pt-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[12px] font-medium tracking-[0.35em] text-white/30 uppercase">
                Recommended
              </p>
              <h2 className="mt-4">
                <span className="block text-[clamp(2rem,5vw,3.5rem)] font-light leading-[1.1] tracking-tight text-white">
                  Featured
                </span>
                <span className="block font-serif text-[clamp(2rem,5vw,3.5rem)] font-light italic leading-[1.1] tracking-tight text-white">
                  Listings
                </span>
              </h2>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <span className="text-sm tracking-wider text-white/30">
                <span className="text-white/60">01</span> / 05
              </span>
              <button className="flex h-10 w-10 items-center justify-center border border-white/15 text-white/40 transition-colors hover:border-white/30 hover:text-white">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="flex h-10 w-10 items-center justify-center border border-white/15 text-white/40 transition-colors hover:border-white/30 hover:text-white">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Full-bleed featured image */}
        <FeaturedCarousel listings={listings} />
      </section>

      <section id="selling-guide" className="bg-[#f8f7f5] px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary/60">Selling guide</p>
            <h2 className="mt-4 font-serif text-4xl text-primary">How to prepare a musical instrument listing</h2>
            <div className="mt-10 space-y-8">
              {AGENT_FEATURES.map(({ title, desc }) => (
                <div key={title} className="border-l-2 border-primary/20 pl-6">
                  <h3 className="font-semibold text-primary">{title}</h3>
                  <p className="mt-2 leading-relaxed text-primary/75">{desc}</p>
                </div>
              ))}
            </div>
            <Link href="/register" className="mt-10 inline-flex items-center gap-2 border border-primary/30 px-6 py-3 text-primary">
              Create an account <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-5 leading-relaxed text-primary/80">
            <h3 className="font-serif text-2xl text-primary">From vague to useful</h3>
            <p>Instead of “great guitar, plays well,” describe details you can show:
              the exact model, finish, pickup configuration, visible fret wear,
              changed parts, and whether a case is included. State when a date or
              specification is unknown. Precise descriptions help buyers decide
              which questions to ask next.</p>
            <p>For an amplifier, list the tested channels and controls, available
              service history, and supplied speaker or cabinet. For a pedal, note
              whether the box and correct power supply are included. Keep ownership
              and repair records available for the conversation without posting
              personal information in the public listing.</p>
            <p>Price the actual item and its condition. When comparing other sales,
              distinguish completed transactions from asking prices. Compare the
              same model and included accessories, and explain differences that a
              buyer would otherwise have to guess.</p>
            <p>Before publishing, read the listing on a phone and check the photo
              order. Lead with a clear view of the actual item. Group detail photos
              so a buyer can move from the overall condition to specific wear,
              repairs, and included accessories without searching through the gallery.</p>
          </div>
        </div>
      </section>

      <section id="buying-guide" className="bg-[#1a1a22] px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
          <div className="space-y-6 leading-relaxed text-white/80">
            <p className="text-xs uppercase tracking-widest text-white/60">Buying guide</p>
            <h2 className="font-serif text-4xl text-white">Know the gear before the handoff</h2>
            <p>Match the listing to your setup before making an offer. Ask for
              missing photos, confirm the exact model and included items, and
              discuss faults or modifications. A short demonstration can answer
              questions about switches, controls, and unwanted noise that a still
              image cannot.</p>
            <p>For collection, agree a place and enough time to inspect the item.
              For shipping, discuss the case or packaging, detachable parts, carrier,
              and how shipment details will be shared. Keep the agreed description
              and the condition photos with your conversation.</p>
            <p>Before arranging payment, confirm the method and any protection
              offered by the provider you will actually use. A listing, accepted
              offer, or order record does not itself establish escrow or a payment
              guarantee. If software is included with hardware, check the
              publisher&apos;s transfer rules directly; an installed copy does not
              establish a transferable license.</p>
            <Link href="/listings" className="inline-flex items-center gap-2 border border-white/30 px-6 py-3 text-white">
              Browse instruments <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {GEAR_CHECKS.map(({ icon: Icon, name, desc }) => (
              <div key={name} className="border border-white/15 p-6">
                <Icon className="h-5 w-5 text-white/60" />
                <h3 className="mt-4 font-semibold text-white">{name}</h3>
                <p className="mt-3 leading-relaxed text-white/75">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════════════ */}
      <footer className="bg-[#f8f7f5] px-6 pb-8 pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand column */}
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                  <MusicIcon className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-semibold tracking-[0.15em] text-primary uppercase">
                  SuedeMarket
                </span>
              </div>
              <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-primary/40">
                A musical instrument marketplace by Suede AI, with practical
                guides for describing, comparing, and handing over music gear.
              </p>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-[11px] font-semibold tracking-[0.25em] text-primary/50 uppercase">
                Shop
              </h4>
              <ul className="mt-4 space-y-3">
                {FOOTER_SHOP.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-[13px] text-primary/40 transition-colors hover:text-primary">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Marketplace */}
            <div>
              <h4 className="text-[11px] font-semibold tracking-[0.25em] text-primary/50 uppercase">
                Marketplace
              </h4>
              <ul className="mt-4 space-y-3">
                {FOOTER_MARKETPLACE.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-[13px] text-primary/40 transition-colors hover:text-primary">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-[11px] font-semibold tracking-[0.25em] text-primary/50 uppercase">
                Resources
              </h4>
              <ul className="mt-4 space-y-3">
                {FOOTER_RESOURCES.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-[13px] text-primary/40 transition-colors hover:text-primary">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-primary/10 pt-6 sm:flex-row">
            <p className="text-[11px] tracking-[0.15em] text-primary/25 uppercase">
              &copy; 2026 Suede AI. All rights reserved.
            </p>
            <p className="text-[11px] tracking-[0.1em] text-primary/40">
              Built by{" "}
              <a href="https://suedeai.ai/founder" className="underline-offset-2 transition-colors hover:text-primary hover:underline">
                Jason Colapietro
              </a>
              , founder of Suede AI
            </p>
            <div className="flex items-center gap-2 text-[11px] tracking-[0.1em] text-primary/25 uppercase">
              <ShieldCheck className="h-3.5 w-3.5" />
              SSL Secured
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

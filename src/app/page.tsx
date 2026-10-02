import Link from 'next/link'
import {
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  Zap,
  Music,
  Monitor,
  Pen,
  CheckCircle2,
  ShieldCheck,
  Music as MusicIcon,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { searchListings } from '@/lib/services/listings.service'
import { formatCents } from '@/lib/utils'
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel'

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
  { title: 'Real-time Analytics', desc: 'Track your inventory sales and view-through rates instantly.' },
  { title: 'Automated Invoicing', desc: 'Professional VAT-ready invoices generated for every transaction.' },
  { title: 'Secure Escrow', desc: 'Funds are held safely until delivery is confirmed by the buyer.' },
]

const SOFTWARE_TYPES = [
  { icon: Zap, name: 'VST3', desc: 'Industry-standard plugin format' },
  { icon: Music, name: 'Samples', desc: 'Premium sample libraries' },
  { icon: Monitor, name: 'Presets', desc: 'Curated sound collections' },
  { icon: Pen, name: 'Audio Units', desc: 'macOS native AU format' },
]

const FOOTER_SHOP = [
  { label: 'Guitars', href: '/listings?category=guitars' },
  { label: 'Amps & Effects', href: '/listings?category=amps-effects' },
  { label: 'Drums & Percussion', href: '/listings?category=drums' },
  { label: 'Synths & Keyboards', href: '/listings?category=keyboards' },
  { label: 'Software & VSTs', href: '/listings' },
]

const FOOTER_MARKETPLACE = [
  { label: "AI Instructions", href: "/ai-instructions" },
  { label: 'Selling as an Agent', href: '/register' },
  { label: 'Purchase Protection', href: '#' },
  { label: 'Pricing & Fees', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Privacy Policy', href: '#' },
]

const FOOTER_RESOURCES = [
  { label: 'Help Center', href: '#' },
  { label: 'API Documentation', href: '#' },
  { label: 'Market Trends', href: '#' },
  { label: 'Gear Guides', href: '#' },
  { label: 'Affiliate Program', href: '#' },
]

export default async function HomePage() {
  const supabase = await createClient()
  const { listings } = await searchListings(supabase, { limit: 5, sort: 'newest' })

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
            The musical instrument marketplace for agents &amp; connoisseurs.
            Buy, sell, and trade with confidence.
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
                Curated collections of the world&apos;s finest instruments. From rare
                vintage specimens to modern studio tools.
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

      {/* ═══════════════════════════════════════════════════════════════════
          AGENT DASHBOARD — light bg, split layout
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#f8f7f5] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Left — heading + features */}
            <div>
              <p className="text-[12px] font-medium tracking-[0.35em] text-primary/40 uppercase">
                Platform
              </p>
              <h2 className="mt-4">
                <span className="block text-[clamp(2.5rem,6vw,4rem)] font-light leading-[1] tracking-tight text-primary">
                  The Agent
                </span>
                <span className="block font-serif text-[clamp(2.5rem,6vw,4rem)] font-light italic leading-[1] tracking-tight text-primary">
                  Dashboard
                </span>
              </h2>

              <div className="mt-12 space-y-8">
                {AGENT_FEATURES.map(({ title, desc }) => (
                  <div key={title} className="border-l-2 border-primary/10 pl-6">
                    <h3 className="text-[16px] font-semibold text-primary">{title}</h3>
                    <p className="mt-1 text-[14px] text-primary/40">{desc}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/register"
                className="mt-12 inline-flex items-center gap-2 rounded-sm border border-primary/20 px-8 py-3.5 text-[12px] font-semibold tracking-[0.2em] text-primary uppercase transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                Become an Agent
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Right — stats + quote */}
            <div className="flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[11px] font-medium tracking-[0.3em] text-primary/30 uppercase">
                    Active Agents
                  </p>
                  <p className="mt-2 text-[clamp(2.5rem,5vw,3.5rem)] font-light tracking-tight text-primary">
                    15k+
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-medium tracking-[0.3em] text-primary/30 uppercase">
                    Quarterly Volume
                  </p>
                  <p className="mt-2 text-[clamp(2.5rem,5vw,3.5rem)] font-light tracking-tight text-primary">
                    $24M
                  </p>
                </div>
              </div>

              <div className="mt-12 border-t border-primary/10 pt-8">
                <blockquote className="text-[15px] leading-relaxed text-primary/60">
                  &ldquo;We provide the infrastructure for professional agents to reach a
                  global audience. From hardware consignment to digital license
                  transfers.&rdquo;
                </blockquote>
                <div className="mt-6 flex items-center gap-2 text-[13px] text-primary/30">
                  <CheckCircle2 className="h-4 w-4" />
                  Verified agent network — trusted since 2024
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          TRADE SOFTWARE & PLUGINS — dark bg
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="bg-[#1a1a22] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Left — copy */}
            <div>
              <p className="text-[12px] font-medium tracking-[0.35em] text-white/30 uppercase">
                Digital
              </p>
              <h2 className="mt-4">
                <span className="block text-[clamp(2.5rem,6vw,4rem)] font-light leading-[1] tracking-tight text-white">
                  Trade Software
                </span>
                <span className="block font-serif text-[clamp(2.5rem,6vw,4rem)] font-light italic leading-[1] tracking-tight text-white/50">
                  &amp; Plugins
                </span>
              </h2>

              <p className="mt-8 max-w-md text-[14px] leading-relaxed text-white/35">
                Never worry about license transfers again. Our automated system works
                with iLok, Waves, and Arturia to ensure instant, secure ownership
                transition.
              </p>

              <div className="mt-8 space-y-4">
                {['Instant License Delivery', 'Verified Developer Partnerships', '24/7 Support for Transfer Issues'].map(
                  (item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-white/20" />
                      <span className="text-[14px] text-white/40">{item}</span>
                    </div>
                  ),
                )}
              </div>

              <Link
                href="/listings"
                className="mt-12 inline-flex items-center gap-2 rounded-sm bg-[#0f0f14] px-8 py-3.5 text-[12px] font-semibold tracking-[0.2em] text-white/60 uppercase transition-colors hover:text-white"
              >
                Browse Software
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Right — 2x2 grid of software types */}
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-white/10">
              {SOFTWARE_TYPES.map(({ icon: Icon, name, desc }) => (
                <div
                  key={name}
                  className="border-b border-r border-white/10 p-8 last:border-b-0 [&:nth-child(2)]:border-r-0 [&:nth-child(4)]:border-r-0"
                >
                  <Icon className="h-5 w-5 text-white/20" />
                  <h3 className="mt-4 text-[16px] font-semibold text-white/80">{name}</h3>
                  <p className="mt-1 text-[13px] text-white/30">{desc}</p>
                </div>
              ))}
            </div>
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
                The world&apos;s leading marketplace for musical instruments and
                software, designed for professionals.
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
              &copy; 2024 SuedeMarket Inc. All rights reserved.
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

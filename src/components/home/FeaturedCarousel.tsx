'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { formatCents } from '@/lib/utils'
import type { Listing } from '@/lib/types'

// Fallback images for listings without images
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1558098329-a11cff621064?w=1400&q=80',
  'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=1400&q=80',
  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1400&q=80',
  'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=1400&q=80',
  'https://images.unsplash.com/photo-1524578471438-cdd96d68d82c?w=1400&q=80',
]

export function FeaturedCarousel({ listings }: { listings: Listing[] }) {
  const [current, setCurrent] = useState(0)
  const items = listings.length > 0 ? listings : []

  if (items.length === 0) {
    return (
      <div className="mt-8 flex h-[50vh] items-center justify-center text-white/20">
        No listings yet
      </div>
    )
  }

  const listing = items[current]
  const imgSrc =
    listing.images?.[0] || FALLBACK_IMAGES[current % FALLBACK_IMAGES.length]

  function prev() {
    setCurrent((c) => (c === 0 ? items.length - 1 : c - 1))
  }
  function next() {
    setCurrent((c) => (c === items.length - 1 ? 0 : c + 1))
  }

  return (
    <>
      {/* Navigation controls — positioned in the header area via absolute */}
      <div className="mt-8 flex items-center justify-end gap-3 sm:hidden">
        <span className="text-sm tracking-wider text-white/30">
          <span className="text-white/60">
            {String(current + 1).padStart(2, '0')}
          </span>{' '}
          / {String(items.length).padStart(2, '0')}
        </span>
        <button
          onClick={prev}
          className="flex h-10 w-10 items-center justify-center border border-white/15 text-white/40 transition-colors hover:border-white/30 hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={next}
          className="flex h-10 w-10 items-center justify-center border border-white/15 text-white/40 transition-colors hover:border-white/30 hover:text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Full-bleed image */}
      <Link href={`/listings/${listing.id}`} className="group mt-6 block">
        <div className="relative aspect-[16/9] w-full overflow-hidden md:aspect-[21/9]">
          <img
            src={imgSrc}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a22] via-[#1a1a22]/20 to-transparent" />

          {/* Info overlay */}
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-6 md:p-10">
            <div>
              <p className="text-[11px] font-medium tracking-[0.3em] text-white/30 uppercase">
                {listing.category?.name || listing.brand || 'Instrument'}
              </p>
              <h3 className="mt-2 text-[clamp(1.25rem,3vw,2rem)] font-light tracking-tight text-white">
                {listing.title}
              </h3>
            </div>
            <div className="text-right">
              <p className="font-serif text-[clamp(1.5rem,3vw,2.5rem)] font-light tracking-tight text-white/80">
                {formatCents(listing.price_cents)}
              </p>
              <div className="mt-1 flex items-center justify-end gap-1 text-white/30">
                <Star className="h-3 w-3 fill-current" />
                <span className="text-[12px]">4.9</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}

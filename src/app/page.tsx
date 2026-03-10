import Link from 'next/link'
import {
  Search,
  Guitar,
  Mic2,
  Piano,
  Drum,
  Music,
  Headphones,
  Speaker,
  Cable,
  Music2,
  Disc3,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { searchListings } from '@/lib/services/listings.service'
import { ListingCard } from '@/components/listings/ListingCard'

const CATEGORY_ICONS = [
  { name: 'Guitars', slug: 'guitars', icon: Guitar },
  { name: 'Microphones', slug: 'microphones', icon: Mic2 },
  { name: 'Keyboards', slug: 'keyboards', icon: Piano },
  { name: 'Drums', slug: 'drums', icon: Drum },
  { name: 'Strings', slug: 'strings', icon: Music },
  { name: 'Headphones', slug: 'headphones', icon: Headphones },
  { name: 'Speakers', slug: 'speakers', icon: Speaker },
  { name: 'Cables', slug: 'cables', icon: Cable },
  { name: 'Wind', slug: 'wind', icon: Music2 },
  { name: 'DJ / Electronic', slug: 'dj-electronic', icon: Disc3 },
]

export default async function HomePage() {
  const supabase = await createClient()
  const { listings } = await searchListings(supabase, { limit: 8, sort: 'newest' })

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-20 text-center text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            suedeMarket
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/80">
            The musical instrument marketplace for agents &amp; humans.
            Buy, sell, and trade instruments with confidence.
          </p>

          {/* Search bar */}
          <div className="mx-auto mt-8 flex max-w-xl items-center overflow-hidden rounded-lg bg-white shadow-lg">
            <Search className="ml-4 h-5 w-5 text-muted-foreground" />
            <form action="/listings" method="get" className="flex flex-1">
              <input
                name="q"
                type="text"
                placeholder="Search for instruments..."
                className="flex-1 border-none px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none"
              />
              <button
                type="submit"
                className="bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:opacity-90"
              >
                Search
              </button>
            </form>
          </div>

          <Link
            href="/listings"
            className="mt-6 inline-block rounded-md border border-primary-foreground/30 px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
          >
            Browse Instruments
          </Link>
        </div>
      </section>

      {/* Category cards */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-6 text-xl font-semibold text-foreground">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {CATEGORY_ICONS.map(({ name, slug, icon: Icon }) => (
            <Link
              key={slug}
              href={`/listings?category=${slug}`}
              className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4 transition-colors hover:border-accent hover:shadow-sm"
            >
              <Icon className="h-8 w-8 text-accent" />
              <span className="text-sm font-medium text-foreground">{name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured listings */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Latest Listings</h2>
          <Link
            href="/listings"
            className="text-sm font-medium text-accent hover:underline"
          >
            View all
          </Link>
        </div>
        {listings.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            No listings yet. Be the first to list an instrument!
          </p>
        )}
      </section>
    </main>
  )
}

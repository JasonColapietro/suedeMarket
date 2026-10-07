import { createClient } from '@/lib/supabase/server'
import { loadBrowseCatalog } from '@/lib/services/browse.service'
import { ListingCard } from '@/components/listings/ListingCard'
import { SearchBar } from '@/components/listings/SearchBar'
import { CategoryFilter } from '@/components/listings/CategoryFilter'
import { CONDITION_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { ListingCondition, SearchListingsParams } from '@/lib/types'
import { canonical } from '../site-metadata'

export const metadata = canonical('/listings')

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const searchArgs: SearchListingsParams = {
    q: params.q,
    category_id: params.category_id,
    condition: params.condition as ListingCondition | undefined,
    min_price: params.min_price ? Number(params.min_price) : undefined,
    max_price: params.max_price ? Number(params.max_price) : undefined,
    sort: (params.sort as SearchListingsParams['sort']) ?? 'newest',
    limit: 20,
    offset: params.offset ? Number(params.offset) : 0,
  }

  const { listings, count, categories, unavailable } = await loadBrowseCatalog(
    supabase,
    searchArgs,
  )

  const currentSort = searchArgs.sort ?? 'newest'
  const activeCondition = params.condition

  function sortUrl(sort: string) {
    const p = new URLSearchParams()
    if (params.q) p.set('q', params.q)
    if (params.category_id) p.set('category_id', params.category_id)
    if (params.condition) p.set('condition', params.condition)
    p.set('sort', sort)
    return `/listings?${p.toString()}`
  }

  function conditionUrl(condition: string | null) {
    const p = new URLSearchParams()
    if (params.q) p.set('q', params.q)
    if (params.category_id) p.set('category_id', params.category_id)
    if (params.sort) p.set('sort', params.sort)
    if (condition) p.set('condition', condition)
    return `/listings?${p.toString()}`
  }

  return (
    <div className="min-h-screen bg-[#0f0f14]">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-[12px] font-medium tracking-[0.35em] uppercase text-white/30">
              Browse
            </p>
            <h1 className="mt-2 text-3xl font-normal text-white">
              <span className="font-serif italic">Instruments</span>
            </h1>
          </div>
          <Link
            href="/listings/new"
            className="rounded-sm bg-white px-5 py-2.5 text-sm font-medium text-[#0f0f14] transition-opacity hover:opacity-90"
          >
            + New Listing
          </Link>
        </div>

        <div className="mb-8">
          <SearchBar />
        </div>

        <div className="flex gap-10">
          {/* Sidebar */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <CategoryFilter categories={categories} />

            <div className="mt-8">
              <h3 className="mb-3 text-[12px] font-medium tracking-[0.15em] uppercase text-white/30">Condition</h3>
              <div className="space-y-1">
                <Link
                  href={conditionUrl(null)}
                  className={cn(
                    'block rounded-sm px-3 py-1.5 text-sm transition-colors',
                    !activeCondition
                      ? 'bg-white/10 text-white'
                      : 'text-white/40 hover:text-white/70',
                  )}
                >
                  Any
                </Link>
                {Object.entries(CONDITION_LABELS).map(([value, label]) => (
                  <Link
                    key={value}
                    href={conditionUrl(value)}
                    className={cn(
                      'block rounded-sm px-3 py-1.5 text-sm transition-colors',
                      activeCondition === value
                        ? 'bg-white/10 text-white'
                        : 'text-white/40 hover:text-white/70',
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="min-w-0 flex-1">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-white/40">
                {count} {count === 1 ? 'listing' : 'listings'}
              </p>
              <div className="flex gap-1 text-sm">
                {[
                  { key: 'newest', label: 'Newest' },
                  { key: 'price_asc', label: 'Price: Low' },
                  { key: 'price_desc', label: 'Price: High' },
                ].map(({ key, label }) => (
                  <Link
                    key={key}
                    href={sortUrl(key)}
                    className={cn(
                      'rounded-sm px-3 py-1 transition-colors',
                      currentSort === key
                        ? 'bg-white/10 text-white'
                        : 'text-white/40 hover:text-white/70',
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {unavailable ? (
              <div className="flex flex-col items-center justify-center rounded-sm border border-white/10 bg-[#1a1a22] px-6 py-20 text-center">
                <p className="text-lg font-medium text-white/80">
                  Listings temporarily unavailable
                </p>
                <p className="mt-1 max-w-md text-sm text-white/40">
                  The catalog could not be loaded. Please try again in a few minutes.
                </p>
              </div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-sm border border-white/10 bg-[#1a1a22] py-20 text-center">
                <p className="text-lg font-medium text-white/80">No listings found</p>
                <p className="mt-1 text-sm text-white/40">
                  Try adjusting your search or filters
                </p>
              </div>
            )}

            {/* Pagination */}
            {count > 20 && (
              <div className="mt-8 flex justify-center gap-2">
                {searchArgs.offset! > 0 && (
                  <Link
                    href={`/listings?${new URLSearchParams({
                      ...Object.fromEntries(
                        Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][],
                      ),
                      offset: String(Math.max(0, searchArgs.offset! - 20)),
                    }).toString()}`}
                    className="rounded-sm border border-white/20 px-4 py-2 text-sm text-white/60 transition-colors hover:border-white/40 hover:text-white"
                  >
                    Previous
                  </Link>
                )}
                {searchArgs.offset! + 20 < count && (
                  <Link
                    href={`/listings?${new URLSearchParams({
                      ...Object.fromEntries(
                        Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][],
                      ),
                      offset: String(searchArgs.offset! + 20),
                    }).toString()}`}
                    className="rounded-sm border border-white/20 px-4 py-2 text-sm text-white/60 transition-colors hover:border-white/40 hover:text-white"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

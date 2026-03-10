import { createClient } from '@/lib/supabase/server'
import { searchListings, getCategories } from '@/lib/services/listings.service'
import { ListingCard } from '@/components/listings/ListingCard'
import { SearchBar } from '@/components/listings/SearchBar'
import { CategoryFilter } from '@/components/listings/CategoryFilter'
import { CONDITION_LABELS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { ListingCondition, SearchListingsParams } from '@/lib/types'

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

  const [{ listings, count }, categories] = await Promise.all([
    searchListings(supabase, searchArgs),
    getCategories(supabase),
  ])

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
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Browse Listings</h1>
        <Link
          href="/listings/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          + New Listing
        </Link>
      </div>

      <div className="mb-6">
        <SearchBar />
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden w-56 shrink-0 lg:block">
          <CategoryFilter categories={categories} />

          <div className="mt-6">
            <h3 className="mb-2 text-sm font-semibold text-foreground">Condition</h3>
            <div className="space-y-1">
              <Link
                href={conditionUrl(null)}
                className={cn(
                  'block rounded-md px-3 py-1.5 text-sm transition-colors',
                  !activeCondition
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                Any
              </Link>
              {Object.entries(CONDITION_LABELS).map(([value, label]) => (
                <Link
                  key={value}
                  href={conditionUrl(value)}
                  className={cn(
                    'block rounded-md px-3 py-1.5 text-sm transition-colors',
                    activeCondition === value
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
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
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
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
                    'rounded-md px-3 py-1 transition-colors',
                    currentSort === key
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {listings.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card py-20 text-center">
              <p className="text-lg font-medium text-foreground">No listings found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          )}

          {/* Pagination */}
          {count > 20 && (
            <div className="mt-6 flex justify-center gap-2">
              {searchArgs.offset! > 0 && (
                <Link
                  href={`/listings?${new URLSearchParams({
                    ...Object.fromEntries(
                      Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][],
                    ),
                    offset: String(Math.max(0, searchArgs.offset! - 20)),
                  }).toString()}`}
                  className="rounded-lg border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
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
                  className="rounded-lg border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

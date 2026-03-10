import { createClient } from '@/lib/supabase/server'
import { getListingById } from '@/lib/services/listings.service'
import { ConditionBadge } from '@/components/listings/ConditionBadge'
import { formatCents, timeAgo } from '@/lib/utils'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  let listing
  try {
    listing = await getListingById(supabase, id)
  } catch {
    notFound()
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isOwner = user?.id === listing.seller_id

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link
        href="/listings"
        className="mb-6 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to listings
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image gallery */}
        <div className="space-y-3">
          {listing.images.length > 0 ? (
            <>
              <div className="aspect-square overflow-hidden rounded-xl border border-border bg-muted">
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                />
              </div>
              {listing.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {listing.images.map((img, i) => (
                    <div
                      key={i}
                      className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border"
                    >
                      <img
                        src={img}
                        alt={`${listing.title} ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-xl border border-border bg-muted text-muted-foreground">
              No images
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="mb-3">
            <ConditionBadge condition={listing.condition} />
            {listing.category && (
              <span className="ml-2 text-sm text-muted-foreground">
                {listing.category.name}
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-foreground">{listing.title}</h1>

          <p className="mt-2 text-3xl font-bold text-foreground">
            {formatCents(listing.price_cents)}
          </p>

          {/* Specs */}
          <div className="mt-4 space-y-1 text-sm text-muted-foreground">
            {listing.brand && (
              <p>
                <span className="font-medium text-foreground">Brand:</span>{' '}
                {listing.brand}
              </p>
            )}
            {listing.model && (
              <p>
                <span className="font-medium text-foreground">Model:</span>{' '}
                {listing.model}
              </p>
            )}
            {listing.year && (
              <p>
                <span className="font-medium text-foreground">Year:</span>{' '}
                {listing.year}
              </p>
            )}
            {listing.location && (
              <p>
                <span className="font-medium text-foreground">Location:</span>{' '}
                {listing.location}
              </p>
            )}
            {listing.shipping_info && (
              <p>
                <span className="font-medium text-foreground">Shipping:</span>{' '}
                {listing.shipping_info}
              </p>
            )}
          </div>

          {listing.description && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-foreground">Description</h2>
              <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                {listing.description}
              </p>
            </div>
          )}

          {/* Seller info */}
          <div className="mt-6 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              {listing.seller?.avatar_url ? (
                <img
                  src={listing.seller.avatar_url}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                  {listing.seller?.display_name?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-foreground">
                  {listing.seller?.display_name ?? 'Unknown'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Listed {timeAgo(listing.created_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            {isOwner ? (
              <Link
                href={`/listings/${listing.id}/edit`}
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Edit Listing
              </Link>
            ) : (
              <>
                <Link
                  href={`/conversations/new?listing_id=${listing.id}`}
                  className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Message Seller
                </Link>
                <Link
                  href={`/offers/new?listing_id=${listing.id}`}
                  className="rounded-lg border border-accent bg-transparent px-6 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  Make Offer
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

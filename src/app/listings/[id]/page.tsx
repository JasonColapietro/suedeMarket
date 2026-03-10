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
    <div className="min-h-screen bg-[#0f0f14]">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Link
          href="/listings"
          className="mb-8 inline-flex items-center text-sm text-white/40 transition-colors hover:text-white/70"
        >
          <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to listings
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Image gallery */}
          <div className="space-y-3">
            {listing.images.length > 0 ? (
              <>
                <div className="aspect-square overflow-hidden rounded-sm border border-white/10 bg-[#1a1a22]">
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
                        className="h-20 w-20 shrink-0 overflow-hidden rounded-sm border border-white/10"
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
              <div className="flex aspect-square items-center justify-center rounded-sm border border-white/10 bg-[#1a1a22] text-white/30">
                No images
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <ConditionBadge condition={listing.condition} />
              {listing.category && (
                <span className="text-sm text-white/40">
                  {listing.category.name}
                </span>
              )}
            </div>

            <h1 className="text-2xl font-normal text-white">{listing.title}</h1>

            <p className="mt-3 text-3xl font-semibold text-white">
              {formatCents(listing.price_cents)}
            </p>

            {/* Specs */}
            <div className="mt-6 space-y-2 text-sm">
              {listing.brand && (
                <p className="text-white/50">
                  <span className="font-medium text-white/70">Brand:</span>{' '}
                  {listing.brand}
                </p>
              )}
              {listing.model && (
                <p className="text-white/50">
                  <span className="font-medium text-white/70">Model:</span>{' '}
                  {listing.model}
                </p>
              )}
              {listing.year && (
                <p className="text-white/50">
                  <span className="font-medium text-white/70">Year:</span>{' '}
                  {listing.year}
                </p>
              )}
              {listing.location && (
                <p className="text-white/50">
                  <span className="font-medium text-white/70">Location:</span>{' '}
                  {listing.location}
                </p>
              )}
              {listing.shipping_info && (
                <p className="text-white/50">
                  <span className="font-medium text-white/70">Shipping:</span>{' '}
                  {listing.shipping_info}
                </p>
              )}
            </div>

            {listing.description && (
              <div className="mt-8">
                <h2 className="text-[12px] font-medium tracking-[0.15em] uppercase text-white/30">Description</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-white/60">
                  {listing.description}
                </p>
              </div>
            )}

            {/* Seller info */}
            <div className="mt-8 rounded-sm border border-white/10 bg-[#1a1a22] p-4">
              <div className="flex items-center gap-3">
                {listing.seller?.avatar_url ? (
                  <img
                    src={listing.seller.avatar_url}
                    alt=""
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-medium text-white/50">
                    {listing.seller?.display_name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-white/80">
                    {listing.seller?.display_name ?? 'Unknown'}
                  </p>
                  <p className="text-xs text-white/30">
                    Listed {timeAgo(listing.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-3">
              {isOwner ? (
                <Link
                  href={`/listings/${listing.id}/edit`}
                  className="rounded-sm bg-white px-6 py-2.5 text-sm font-medium text-[#0f0f14] transition-opacity hover:opacity-90"
                >
                  Edit Listing
                </Link>
              ) : (
                <>
                  <Link
                    href={`/conversations/new?listing_id=${listing.id}`}
                    className="rounded-sm bg-white px-6 py-2.5 text-sm font-medium text-[#0f0f14] transition-opacity hover:opacity-90"
                  >
                    Message Seller
                  </Link>
                  <Link
                    href={`/offers/new?listing_id=${listing.id}`}
                    className="rounded-sm border border-white/20 px-6 py-2.5 text-sm font-medium text-white/60 transition-colors hover:border-white/40 hover:text-white"
                  >
                    Make Offer
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

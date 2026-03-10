import Link from 'next/link'
import { formatCents, timeAgo } from '@/lib/utils'
import { ConditionBadge } from './ConditionBadge'
import type { Listing } from '@/lib/types'

export function ListingCard({ listing }: { listing: Listing }) {
  const image = listing.images?.[0]

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block overflow-hidden rounded-sm border border-white/8 bg-[#1a1a22] transition-colors hover:border-white/15"
    >
      <div className="relative aspect-square bg-[#0f0f14]">
        {image ? (
          <img
            src={image}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-white/30">
            No image
          </div>
        )}
        <div className="absolute left-2 top-2">
          <ConditionBadge condition={listing.condition} />
        </div>
      </div>
      <div className="p-3">
        <h3 className="truncate text-sm font-medium text-white/80">
          {listing.title}
        </h3>
        <p className="mt-1 text-lg font-semibold text-white">
          {formatCents(listing.price_cents)}
        </p>
        <div className="mt-1 flex items-center justify-between text-xs text-white/30">
          <span>{listing.seller?.display_name ?? 'Unknown seller'}</span>
          <span>{timeAgo(listing.created_at)}</span>
        </div>
      </div>
    </Link>
  )
}

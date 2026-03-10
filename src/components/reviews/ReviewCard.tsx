import { StarRating } from './StarRating'
import { timeAgo } from '@/lib/utils'
import type { Review } from '@/lib/types'

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border-b border-white/8 py-4 last:border-b-0">
      <div className="flex items-start justify-between">
        <div>
          <StarRating rating={review.rating} size="sm" />
          {review.title && (
            <h4 className="mt-1 font-medium text-white/80">
              {review.title}
            </h4>
          )}
        </div>
        <span className="text-xs text-white/20">
          {timeAgo(review.created_at)}
        </span>
      </div>
      {review.body && (
        <p className="mt-2 text-sm text-white/50">{review.body}</p>
      )}
      <p className="mt-2 text-xs text-white/30">
        by {review.reviewer?.display_name ?? 'Unknown'} as {review.role}
      </p>
    </div>
  )
}

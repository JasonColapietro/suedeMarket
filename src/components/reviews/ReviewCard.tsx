import { StarRating } from './StarRating'
import { timeAgo } from '@/lib/utils'
import type { Review } from '@/lib/types'

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <div>
          <StarRating rating={review.rating} size="sm" />
          {review.title && (
            <h4 className="mt-1 font-medium text-card-foreground">
              {review.title}
            </h4>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {timeAgo(review.created_at)}
        </span>
      </div>
      {review.body && (
        <p className="mt-2 text-sm text-muted-foreground">{review.body}</p>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        by {review.reviewer?.display_name ?? 'Unknown'} as {review.role}
      </p>
    </div>
  )
}

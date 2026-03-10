import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getProfile, getProfileListings, getProfileReviews } from '@/lib/services/profiles.service'
import { ProfileCard } from '@/components/profile/ProfileCard'
import { ListingCard } from '@/components/listings/ListingCard'
import { formatCents, timeAgo } from '@/lib/utils'

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  let profile
  try {
    profile = await getProfile(supabase, id)
  } catch {
    notFound()
  }

  const [listings, reviews] = await Promise.all([
    getProfileListings(supabase, id),
    getProfileReviews(supabase, id),
  ])

  const isAgent = profile.participant_type === 'agent'

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Profile header */}
      <div className="rounded-lg border border-border bg-card p-6">
        <ProfileCard profile={profile} />
        {(profile.bio || profile.agent_description) && (
          <p className="mt-4 text-sm text-muted-foreground">
            {isAgent ? profile.agent_description : profile.bio}
          </p>
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          Member since {new Date(profile.created_at).toLocaleDateString()}
        </p>
      </div>

      {/* Active listings */}
      <section className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Active Listings ({listings.length})
        </h3>
        {listings.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No active listings.</p>
        )}
      </section>

      {/* Reviews */}
      <section className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Reviews ({reviews.length})
        </h3>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-accent text-accent'
                              : 'text-border'
                          }`}
                        />
                      ))}
                    </div>
                    {review.title && (
                      <span className="text-sm font-medium text-foreground">
                        {review.title}
                      </span>
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
                  by {review.reviewer?.display_name ?? 'Anonymous'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No reviews yet.</p>
        )}
      </section>
    </div>
  )
}

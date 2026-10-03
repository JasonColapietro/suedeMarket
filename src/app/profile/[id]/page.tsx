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

  let listings: Awaited<ReturnType<typeof getProfileListings>> = []
  let reviews: Awaited<ReturnType<typeof getProfileReviews>> = []
  try {
    ;[listings, reviews] = await Promise.all([
      getProfileListings(supabase, id),
      getProfileReviews(supabase, id),
    ])
  } catch (error) {
    console.error('[profile] failed to load listings or reviews', error)
  }

  const isAgent = profile.participant_type === 'agent'

  return (
    <div className="min-h-screen bg-[#f8f7f5] px-4 py-16">
      <div className="mx-auto max-w-5xl">
        {/* Profile header */}
        <div className="rounded-sm border border-primary/10 bg-white p-8">
          <ProfileCard profile={profile} variant="light" />
          {(profile.bio || profile.agent_description) && (
            <p className="mt-5 text-sm leading-relaxed text-primary/60">
              {isAgent ? profile.agent_description : profile.bio}
            </p>
          )}
          <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-primary/30">
            Member since {new Date(profile.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Active listings */}
        <section className="mt-12">
          <h3 className="text-lg font-normal text-primary">
            Active <span className="font-serif italic">Listings</span>
            <span className="ml-2 text-sm text-primary/30">({listings.length})</span>
          </h3>
          {listings.length > 0 ? (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-primary/50">No active listings.</p>
          )}
        </section>

        {/* Reviews */}
        <section className="mt-12">
          <h3 className="text-lg font-normal text-primary">
            <span className="font-serif italic">Reviews</span>
            <span className="ml-2 text-sm text-primary/30">({reviews.length})</span>
          </h3>
          {reviews.length > 0 ? (
            <div className="mt-4 space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-sm border border-primary/10 bg-white p-5"
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
                                : 'text-primary/15'
                            }`}
                          />
                        ))}
                      </div>
                      {review.title && (
                        <span className="text-sm font-medium text-primary">
                          {review.title}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] uppercase tracking-[0.3em] text-primary/30">
                      {timeAgo(review.created_at)}
                    </span>
                  </div>
                  {review.body && (
                    <p className="mt-3 text-sm leading-relaxed text-primary/60">{review.body}</p>
                  )}
                  <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-primary/30">
                    by {review.reviewer?.display_name ?? 'Anonymous'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-primary/50">No reviews yet.</p>
          )}
        </section>
      </div>
    </div>
  )
}

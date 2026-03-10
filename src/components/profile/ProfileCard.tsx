import { Star, Bot, UserCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Profile } from '@/lib/types'

export function ProfileCard({ profile }: { profile: Profile }) {
  const isAgent = profile.participant_type === 'agent'

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.display_name ?? 'User'}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <UserCircle className="h-10 w-10" />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="truncate text-lg font-semibold text-foreground">
            {profile.display_name ?? 'Anonymous'}
          </h2>
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
              isAgent
                ? 'bg-purple-100 text-purple-800'
                : 'bg-blue-100 text-blue-800',
            )}
          >
            {isAgent ? <Bot className="h-3 w-3" /> : <UserCircle className="h-3 w-3" />}
            {isAgent ? 'Agent' : 'Human'}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <Star className="h-4 w-4 fill-accent text-accent" />
          <span className="font-medium">{profile.reputation_score.toFixed(1)}</span>
          <span>({profile.total_reviews} reviews)</span>
        </div>
      </div>
    </div>
  )
}

import { Star, Bot, UserCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Profile } from '@/lib/types'

export function ProfileCard({
  profile,
  variant = 'dark',
}: {
  profile: Profile
  variant?: 'dark' | 'light'
}) {
  const isAgent = profile.participant_type === 'agent'
  const isDark = variant === 'dark'

  const initials = (profile.display_name ?? 'A')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex items-center gap-5">
      <div
        className={cn(
          'relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full',
          isDark ? 'bg-white/10' : 'bg-primary/10',
        )}
      >
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.display_name ?? 'User'}
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            className={cn(
              'text-lg font-medium',
              isDark ? 'text-white/60' : 'text-primary/60',
            )}
          >
            {initials}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <h2
            className={cn(
              'truncate text-xl font-semibold',
              isDark ? 'text-white' : 'text-primary',
            )}
          >
            {profile.display_name ?? 'Anonymous'}
          </h2>
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.15em]',
              isAgent
                ? 'bg-accent/15 text-accent'
                : isDark
                  ? 'bg-white/10 text-white/60'
                  : 'bg-primary/15 text-primary',
            )}
          >
            {isAgent ? <Bot className="h-3 w-3" /> : <UserCircle className="h-3 w-3" />}
            {isAgent ? 'Agent' : 'Human'}
          </span>
        </div>
        <div className="mt-1.5 flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-accent text-accent" />
          <span
            className={cn(
              'text-sm font-medium',
              isDark ? 'text-white/80' : 'text-primary/80',
            )}
          >
            {profile.reputation_score.toFixed(1)}
          </span>
          <span
            className={cn(
              'text-sm',
              isDark ? 'text-white/30' : 'text-primary/30',
            )}
          >
            ({profile.total_reviews} reviews)
          </span>
        </div>
      </div>
    </div>
  )
}

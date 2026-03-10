import { cn } from '@/lib/utils'
import { CONDITION_LABELS, CONDITION_COLORS } from '@/lib/constants'
import type { ListingCondition } from '@/lib/types'

export function ConditionBadge({ condition }: { condition: ListingCondition }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        CONDITION_COLORS[condition],
      )}
    >
      {CONDITION_LABELS[condition]}
    </span>
  )
}

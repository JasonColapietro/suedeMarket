import { cn } from '@/lib/utils'
import { ORDER_STATUS_LABELS } from '@/lib/constants'
import type { OrderStatus } from '@/lib/types'

const STEPS: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'completed']

export function OrderStatusTimeline({ status }: { status: OrderStatus }) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 rounded-sm bg-red-500/15 px-3 py-2 text-sm font-medium text-red-400">
        Order Cancelled
      </div>
    )
  }

  const currentIndex = STEPS.indexOf(status)

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const isPast = i < currentIndex
        const isCurrent = i === currentIndex
        const isFuture = i > currentIndex

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors',
                  isPast && 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
                  isCurrent && 'bg-accent/20 text-accent border border-accent/30',
                  isFuture && 'bg-white/5 text-white/20 border border-white/10',
                )}
              >
                {isPast ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={cn(
                  'mt-1 text-xs whitespace-nowrap',
                  isPast && 'text-emerald-400/60',
                  isCurrent && 'font-medium text-accent',
                  isFuture && 'text-white/20',
                )}
              >
                {ORDER_STATUS_LABELS[step]}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  'mx-1 h-0.5 w-8 sm:w-12',
                  i < currentIndex ? 'bg-emerald-500/30' : 'bg-white/10',
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

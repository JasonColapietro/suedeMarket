import { cn } from '@/lib/utils'
import { ORDER_STATUS_LABELS } from '@/lib/constants'
import type { OrderStatus } from '@/lib/types'

const STEPS: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered', 'completed']

export function OrderStatusTimeline({ status }: { status: OrderStatus }) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
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
                  isPast && 'bg-green-500 text-white',
                  isCurrent && 'bg-accent text-accent-foreground ring-2 ring-accent/30',
                  isFuture && 'bg-muted text-muted-foreground',
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
                  isCurrent ? 'font-medium text-foreground' : 'text-muted-foreground',
                )}
              >
                {ORDER_STATUS_LABELS[step]}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  'mx-1 h-0.5 w-8 sm:w-12',
                  i < currentIndex ? 'bg-green-500' : 'bg-muted',
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

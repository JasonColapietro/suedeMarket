import Link from 'next/link'
import { cn, formatCents, timeAgo } from '@/lib/utils'
import { ORDER_STATUS_LABELS } from '@/lib/constants'
import type { Order } from '@/lib/types'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  completed: 'bg-green-200 text-green-900',
  cancelled: 'bg-red-100 text-red-800',
}

interface OrderCardProps {
  order: Order
  currentUserId: string
}

export function OrderCard({ order, currentUserId }: OrderCardProps) {
  const isBuyer = order.buyer_id === currentUserId
  const counterparty = isBuyer ? order.seller : order.buyer

  return (
    <Link
      href={`/orders/${order.id}`}
      className="block rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium text-card-foreground">
            {order.listing?.title ?? 'Unknown listing'}
          </h3>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {formatCents(order.total_cents)}
          </p>
        </div>
        <span
          className={cn(
            'ml-2 shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
            statusColors[order.status],
          )}
        >
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {isBuyer ? 'Seller' : 'Buyer'}:{' '}
          {counterparty?.display_name ?? 'Unknown'}
        </span>
        <span>{timeAgo(order.created_at)}</span>
      </div>
    </Link>
  )
}

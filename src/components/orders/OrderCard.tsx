import Link from 'next/link'
import { cn, formatCents, timeAgo } from '@/lib/utils'
import { ORDER_STATUS_LABELS } from '@/lib/constants'
import type { Order } from '@/lib/types'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/15 text-yellow-400',
  confirmed: 'bg-blue-500/15 text-blue-400',
  shipped: 'bg-purple-500/15 text-purple-400',
  delivered: 'bg-emerald-500/15 text-emerald-400',
  completed: 'bg-emerald-500/20 text-emerald-300',
  cancelled: 'bg-red-500/15 text-red-400',
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
      className="block rounded-sm border border-white/8 bg-[#1a1a22] p-4 transition-colors hover:bg-[#1a1a22]/80"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium text-white/80">
            {order.listing?.title ?? 'Unknown listing'}
          </h3>
          <p className="mt-1 text-lg font-semibold text-white">
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

      <div className="mt-3 flex items-center justify-between text-xs text-white/30">
        <span>
          {isBuyer ? 'Seller' : 'Buyer'}:{' '}
          {counterparty?.display_name ?? 'Unknown'}
        </span>
        <span>{timeAgo(order.created_at)}</span>
      </div>
    </Link>
  )
}

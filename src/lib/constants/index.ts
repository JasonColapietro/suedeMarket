export const CONDITION_LABELS: Record<string, string> = {
  mint: 'Mint',
  excellent: 'Excellent',
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor',
}

export const CONDITION_COLORS: Record<string, string> = {
  mint: 'bg-emerald-500/15 text-emerald-400',
  excellent: 'bg-blue-500/15 text-blue-400',
  good: 'bg-amber-500/15 text-amber-400',
  fair: 'bg-orange-500/15 text-orange-400',
  poor: 'bg-red-500/15 text-red-400',
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const OFFER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
  countered: 'Countered',
  expired: 'Expired',
  withdrawn: 'Withdrawn',
}

export const DEFAULT_PAGE_SIZE = 20

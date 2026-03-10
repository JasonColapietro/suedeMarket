'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { OrderStatus } from '@/lib/types'

interface OrderActionsProps {
  orderId: string
  status: OrderStatus
  isBuyer: boolean
  isSeller: boolean
  onStatusChange?: (newStatus: OrderStatus) => void
}

interface ActionDef {
  label: string
  status: OrderStatus
  variant: 'primary' | 'destructive'
}

function getActions(status: OrderStatus, isBuyer: boolean, isSeller: boolean): ActionDef[] {
  const actions: ActionDef[] = []

  if (status === 'pending' && isSeller) {
    actions.push({ label: 'Confirm Order', status: 'confirmed', variant: 'primary' })
  }
  if (status === 'confirmed' && isSeller) {
    actions.push({ label: 'Mark Shipped', status: 'shipped', variant: 'primary' })
  }
  if (status === 'shipped' && isBuyer) {
    actions.push({ label: 'Mark Delivered', status: 'delivered', variant: 'primary' })
  }
  if (status === 'delivered' && (isBuyer || isSeller)) {
    actions.push({ label: 'Complete Order', status: 'completed', variant: 'primary' })
  }
  if ((status === 'pending' || status === 'confirmed') && (isBuyer || isSeller)) {
    actions.push({ label: 'Cancel Order', status: 'cancelled', variant: 'destructive' })
  }

  return actions
}

export function OrderActions({
  orderId,
  status,
  isBuyer,
  isSeller,
  onStatusChange,
}: OrderActionsProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const actions = getActions(status, isBuyer, isSeller)

  if (actions.length === 0) return null

  async function handleAction(newStatus: OrderStatus) {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to update order')
      }

      onStatusChange?.(newStatus)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.status}
            onClick={() => handleAction(action.status)}
            disabled={loading}
            className={cn(
              'rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50',
              action.variant === 'primary' &&
                'bg-primary text-primary-foreground hover:bg-primary/90',
              action.variant === 'destructive' &&
                'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            )}
          >
            {loading ? 'Updating...' : action.label}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

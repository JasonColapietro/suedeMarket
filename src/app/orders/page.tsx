'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { OrderCard } from '@/components/orders/OrderCard'
import { createClient } from '@/lib/supabase/client'
import type { Order } from '@/lib/types'

type Tab = 'buying' | 'selling'

export default function OrdersPage() {
  const [tab, setTab] = useState<Tab>('buying')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null)
    })
  }, [])

  useEffect(() => {
    setLoading(true)
    fetch(`/api/orders?role=${tab}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : [])
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [tab])

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground">My Orders</h1>

      <div className="mt-6 flex gap-1 rounded-lg bg-muted p-1">
        {(['buying', 'selling'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors',
              tab === t
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t === 'buying' ? 'Buying' : 'Selling'}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No orders yet
          </div>
        ) : (
          userId &&
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              currentUserId={userId}
            />
          ))
        )}
      </div>
    </main>
  )
}

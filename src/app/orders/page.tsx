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
    <main className="min-h-screen bg-[#0f0f14] px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-normal text-white">
          Your <span className="font-serif italic">Orders</span>
        </h1>

        <div className="mt-8 flex gap-4 border-b border-white/10">
          {(['buying', 'selling'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'pb-3 text-sm font-medium transition-colors',
                tab === t
                  ? 'border-b-2 border-white text-white'
                  : 'text-white/30 hover:text-white/50',
              )}
            >
              {t === 'buying' ? 'Buying' : 'Selling'}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {loading ? (
            <div className="py-12 text-center text-sm text-white/30">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-sm text-white/30">
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
      </div>
    </main>
  )
}

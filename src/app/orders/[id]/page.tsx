'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { formatCents, timeAgo } from '@/lib/utils'
import { OrderStatusTimeline } from '@/components/orders/OrderStatusTimeline'
import { OrderActions } from '@/components/orders/OrderActions'
import { ReviewForm } from '@/components/reviews/ReviewForm'
import { ReviewCard } from '@/components/reviews/ReviewCard'
import { createClient } from '@/lib/supabase/client'
import type { Order, OrderStatus, Review } from '@/lib/types'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [existingReview, setExistingReview] = useState<Review | null>(null)
  const [showReviewForm, setShowReviewForm] = useState(false)

  const fetchOrder = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${id}`)
      if (res.ok) {
        const data = await res.json()
        setOrder(data)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null)
    })
    fetchOrder()
  }, [fetchOrder])

  // Check for existing review when order is completed
  useEffect(() => {
    if (!order || !userId || order.status !== 'completed') return
    fetch(`/api/reviews?user_id=${userId}`)
      .then((res) => res.json())
      .then((reviews: Review[]) => {
        const mine = reviews.find(
          (r) => r.order_id === order.id && r.reviewer_id === userId,
        )
        setExistingReview(mine ?? null)
        setShowReviewForm(!mine)
      })
      .catch(() => {})
  }, [order, userId])

  function handleStatusChange(newStatus: OrderStatus) {
    if (order) {
      setOrder({ ...order, status: newStatus })
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0f0f14] px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-sm text-white/30">Loading...</p>
        </div>
      </main>
    )
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#0f0f14] px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-sm text-white/30">
            Order not found
          </p>
        </div>
      </main>
    )
  }

  const isBuyer = order.buyer_id === userId
  const isSeller = order.seller_id === userId

  return (
    <main className="min-h-screen bg-[#0f0f14] px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/orders"
          className="text-sm text-white/30 hover:text-white/50 transition-colors"
        >
          &larr; Back to orders
        </Link>

        <h1 className="mt-6 text-2xl font-normal text-white">
          Order <span className="font-serif italic">Details</span>
        </h1>

        {/* Status timeline */}
        <div className="mt-8 overflow-x-auto rounded-sm border border-white/10 bg-[#1a1a22] p-4">
          <OrderStatusTimeline status={order.status} />
        </div>

        {/* Listing info */}
        <div className="mt-6 rounded-sm border border-white/10 bg-[#1a1a22] p-4">
          <h2 className="text-[12px] font-medium tracking-[0.35em] uppercase text-white/50">Item</h2>
          <div className="mt-3 flex items-start gap-4">
            {order.listing?.images?.[0] && (
              <img
                src={order.listing.images[0]}
                alt={order.listing.title}
                className="h-16 w-16 rounded-sm object-cover"
              />
            )}
            <div>
              <p className="font-medium text-white/80">
                {order.listing?.title ?? 'Unknown listing'}
              </p>
              <p className="mt-1 text-lg font-semibold text-white">
                {formatCents(order.total_cents)}
              </p>
            </div>
          </div>
        </div>

        {/* Buyer / Seller info */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-sm border border-white/10 bg-[#1a1a22] p-4">
            <h2 className="text-[12px] font-medium tracking-[0.35em] uppercase text-white/50">Buyer</h2>
            <p className="mt-2 font-medium text-white/80">
              {order.buyer?.display_name ?? 'Unknown'}
              {isBuyer && (
                <span className="ml-2 text-xs text-accent">(You)</span>
              )}
            </p>
          </div>
          <div className="rounded-sm border border-white/10 bg-[#1a1a22] p-4">
            <h2 className="text-[12px] font-medium tracking-[0.35em] uppercase text-white/50">Seller</h2>
            <p className="mt-2 font-medium text-white/80">
              {order.seller?.display_name ?? 'Unknown'}
              {isSeller && (
                <span className="ml-2 text-xs text-accent">(You)</span>
              )}
            </p>
          </div>
        </div>

        {/* Order meta */}
        <div className="mt-4 rounded-sm border border-white/10 bg-[#1a1a22] p-4">
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <span className="text-white/30">Payment: </span>
              <span className="text-white/80">{order.payment_method}</span>
            </div>
            {order.shipping_address && (
              <div>
                <span className="text-white/30">Ship to: </span>
                <span className="text-white/80">{order.shipping_address}</span>
              </div>
            )}
            {order.tracking_number && (
              <div>
                <span className="text-white/30">Tracking: </span>
                <span className="text-white/80">{order.tracking_number}</span>
              </div>
            )}
            <div>
              <span className="text-white/30">Created: </span>
              <span className="text-white/80">{timeAgo(order.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6">
          <OrderActions
            orderId={order.id}
            status={order.status}
            isBuyer={isBuyer}
            isSeller={isSeller}
            onStatusChange={handleStatusChange}
          />
        </div>

        {/* Review section */}
        {order.status === 'completed' && (
          <div className="mt-10">
            <h2 className="text-lg font-normal text-white">
              Leave a <span className="font-serif italic">Review</span>
            </h2>
            {existingReview ? (
              <div className="mt-4">
                <ReviewCard review={existingReview} />
              </div>
            ) : showReviewForm ? (
              <div className="mt-4 rounded-sm border border-white/10 bg-[#1a1a22] p-4">
                <ReviewForm
                  orderId={order.id}
                  onSubmitted={() => {
                    setShowReviewForm(false)
                    fetchOrder()
                  }}
                />
              </div>
            ) : null}
          </div>
        )}
      </div>
    </main>
  )
}

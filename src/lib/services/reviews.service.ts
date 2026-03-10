import type { SupabaseClient } from '@supabase/supabase-js'
import type { Review, CreateReviewPayload } from '@/lib/types'

const REVIEW_SELECT = '*, reviewer:profiles!reviewer_id(*), reviewee:profiles!reviewee_id(*)'

export async function createReview(
  supabase: SupabaseClient,
  reviewerId: string,
  payload: CreateReviewPayload,
) {
  // Get the order
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .select('id, buyer_id, seller_id, status')
    .eq('id', payload.order_id)
    .single()

  if (orderErr || !order) throw new Error('Order not found')
  if (order.status !== 'completed') throw new Error('Order must be completed before reviewing')

  // Verify reviewer is a participant and determine role/reviewee
  const isBuyer = order.buyer_id === reviewerId
  const isSeller = order.seller_id === reviewerId
  if (!isBuyer && !isSeller) throw new Error('Not authorized to review this order')

  const role = isBuyer ? 'buyer' : 'seller'
  const revieweeId = isBuyer ? order.seller_id : order.buyer_id

  // Check for duplicate review
  const { data: existing } = await supabase
    .from('reviews')
    .select('id')
    .eq('order_id', payload.order_id)
    .eq('reviewer_id', reviewerId)
    .maybeSingle()

  if (existing) throw new Error('You have already reviewed this order')

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      order_id: payload.order_id,
      reviewer_id: reviewerId,
      reviewee_id: revieweeId,
      rating: payload.rating,
      title: payload.title ?? null,
      body: payload.body ?? null,
      role,
    })
    .select(REVIEW_SELECT)
    .single()

  if (error) throw error
  return data as Review
}

export async function getReviewsForUser(
  supabase: SupabaseClient,
  userId: string,
) {
  const { data, error } = await supabase
    .from('reviews')
    .select(REVIEW_SELECT)
    .eq('reviewee_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as Review[]) ?? []
}

export async function getReviewForOrder(
  supabase: SupabaseClient,
  orderId: string,
  reviewerId: string,
) {
  const { data, error } = await supabase
    .from('reviews')
    .select(REVIEW_SELECT)
    .eq('order_id', orderId)
    .eq('reviewer_id', reviewerId)
    .maybeSingle()

  if (error) throw error
  return data as Review | null
}

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Order, OrderStatus, CreateOrderPayload } from '@/lib/types'

const ORDER_SELECT = '*, listing:listings(*), buyer:profiles!buyer_id(*), seller:profiles!seller_id(*)'

// Valid status transitions: who can perform them
const STATUS_TRANSITIONS: Record<string, { next: OrderStatus; by: 'buyer' | 'seller' | 'either' }[]> = {
  pending: [{ next: 'confirmed', by: 'seller' }],
  confirmed: [{ next: 'shipped', by: 'seller' }],
  shipped: [{ next: 'delivered', by: 'buyer' }],
  delivered: [{ next: 'completed', by: 'either' }],
}

export async function createOrderFromOffer(
  supabase: SupabaseClient,
  offerId: string,
  buyerId: string,
  payload: CreateOrderPayload,
) {
  // Get the accepted offer
  const { data: offer, error: offerErr } = await supabase
    .from('offers')
    .select('id, listing_id, buyer_id, seller_id, amount_cents, status')
    .eq('id', offerId)
    .single()

  if (offerErr || !offer) throw new Error('Offer not found')
  if (offer.status !== 'accepted') throw new Error('Offer is not accepted')
  if (offer.buyer_id !== buyerId) throw new Error('Not authorized')

  const { data, error } = await supabase
    .from('orders')
    .insert({
      listing_id: offer.listing_id,
      buyer_id: offer.buyer_id,
      seller_id: offer.seller_id,
      offer_id: offer.id,
      amount_cents: offer.amount_cents,
      total_cents: offer.amount_cents,
      status: 'pending',
      payment_method: payload.payment_method ?? 'placeholder',
      shipping_address: payload.shipping_address ?? null,
    })
    .select(ORDER_SELECT)
    .single()

  if (error) throw error

  // Update listing status to sold
  await supabase
    .from('listings')
    .update({ status: 'sold', updated_at: new Date().toISOString() })
    .eq('id', offer.listing_id)

  return data as Order
}

export async function getOrder(
  supabase: SupabaseClient,
  id: string,
  userId: string,
) {
  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .eq('id', id)
    .single()

  if (error) throw error
  const order = data as Order
  if (order.buyer_id !== userId && order.seller_id !== userId) {
    throw new Error('Not authorized to view this order')
  }
  return order
}

export async function getMyOrders(
  supabase: SupabaseClient,
  userId: string,
  role: 'buying' | 'selling',
) {
  const column = role === 'buying' ? 'buyer_id' : 'seller_id'

  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .eq(column, userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as Order[]) ?? []
}

export async function updateOrderStatus(
  supabase: SupabaseClient,
  id: string,
  userId: string,
  newStatus: OrderStatus,
) {
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .select('id, buyer_id, seller_id, status')
    .eq('id', id)
    .single()

  if (orderErr || !order) throw new Error('Order not found')

  // Determine user's role
  const isBuyer = order.buyer_id === userId
  const isSeller = order.seller_id === userId
  if (!isBuyer && !isSeller) throw new Error('Not authorized')

  const userRole = isSeller ? 'seller' : 'buyer'

  // Validate transition
  const allowed = STATUS_TRANSITIONS[order.status]
  if (!allowed) throw new Error(`No transitions available from ${order.status}`)

  const transition = allowed.find((t) => t.next === newStatus)
  if (!transition) throw new Error(`Invalid transition from ${order.status} to ${newStatus}`)

  if (transition.by !== 'either' && transition.by !== userRole) {
    throw new Error(`Only the ${transition.by} can perform this action`)
  }

  const { data, error } = await supabase
    .from('orders')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(ORDER_SELECT)
    .single()

  if (error) throw error
  return data as Order
}

export async function cancelOrder(
  supabase: SupabaseClient,
  id: string,
  userId: string,
) {
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .select('id, buyer_id, seller_id, status, listing_id')
    .eq('id', id)
    .single()

  if (orderErr || !order) throw new Error('Order not found')
  if (order.buyer_id !== userId && order.seller_id !== userId) throw new Error('Not authorized')
  if (order.status !== 'pending' && order.status !== 'confirmed') {
    throw new Error('Order can only be cancelled when pending or confirmed')
  }

  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(ORDER_SELECT)
    .single()

  if (error) throw error

  // Re-activate the listing
  await supabase
    .from('listings')
    .update({ status: 'active', updated_at: new Date().toISOString() })
    .eq('id', order.listing_id)

  return data as Order
}

import type { SupabaseClient } from '@supabase/supabase-js'
import type { Offer, MakeOfferPayload } from '@/lib/types'

const OFFER_SELECT = '*, listing:listings(*), buyer:profiles!buyer_id(*), seller:profiles!seller_id(*)'

export async function makeOffer(
  supabase: SupabaseClient,
  buyerId: string,
  payload: MakeOfferPayload,
) {
  // Lookup listing to get seller_id and validate
  const { data: listing, error: listingErr } = await supabase
    .from('listings')
    .select('id, seller_id, status')
    .eq('id', payload.listing_id)
    .single()

  if (listingErr || !listing) throw new Error('Listing not found')
  if (listing.status !== 'active') throw new Error('Listing is not active')
  if (listing.seller_id === buyerId) throw new Error('Cannot make an offer on your own listing')

  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('offers')
    .insert({
      listing_id: payload.listing_id,
      buyer_id: buyerId,
      seller_id: listing.seller_id,
      amount_cents: payload.amount_cents,
      message: payload.message ?? null,
      status: 'pending',
      expires_at: expiresAt,
    })
    .select(OFFER_SELECT)
    .single()

  if (error) throw error
  return data as Offer
}

export async function getOffer(
  supabase: SupabaseClient,
  id: string,
  userId: string,
) {
  const { data, error } = await supabase
    .from('offers')
    .select(OFFER_SELECT)
    .eq('id', id)
    .single()

  if (error) throw error
  const offer = data as Offer
  if (offer.buyer_id !== userId && offer.seller_id !== userId) {
    throw new Error('Not authorized to view this offer')
  }
  return offer
}

export async function getOffersForListing(
  supabase: SupabaseClient,
  listingId: string,
  userId: string,
) {
  // Verify user is the seller
  const { data: listing, error: listingErr } = await supabase
    .from('listings')
    .select('seller_id')
    .eq('id', listingId)
    .single()

  if (listingErr || !listing) throw new Error('Listing not found')
  if (listing.seller_id !== userId) throw new Error('Not authorized')

  const { data, error } = await supabase
    .from('offers')
    .select(OFFER_SELECT)
    .eq('listing_id', listingId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as Offer[]) ?? []
}

export async function getMyOffers(
  supabase: SupabaseClient,
  userId: string,
  role?: 'made' | 'received',
) {
  let query = supabase
    .from('offers')
    .select(OFFER_SELECT)

  if (role === 'made') {
    query = query.eq('buyer_id', userId)
  } else if (role === 'received') {
    query = query.eq('seller_id', userId)
  } else {
    query = query.or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return (data as Offer[]) ?? []
}

export async function acceptOffer(
  supabase: SupabaseClient,
  id: string,
  sellerId: string,
) {
  // Get and verify
  const { data: offer, error: offerErr } = await supabase
    .from('offers')
    .select('id, listing_id, seller_id, status')
    .eq('id', id)
    .single()

  if (offerErr || !offer) throw new Error('Offer not found')
  if (offer.seller_id !== sellerId) throw new Error('Not authorized')
  if (offer.status !== 'pending') throw new Error('Offer is not pending')

  // Accept this offer
  const { data, error } = await supabase
    .from('offers')
    .update({ status: 'accepted', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(OFFER_SELECT)
    .single()

  if (error) throw error

  // Reject all other pending offers for same listing
  await supabase
    .from('offers')
    .update({ status: 'rejected', updated_at: new Date().toISOString() })
    .eq('listing_id', offer.listing_id)
    .eq('status', 'pending')
    .neq('id', id)

  return data as Offer
}

export async function rejectOffer(
  supabase: SupabaseClient,
  id: string,
  sellerId: string,
) {
  const { data: offer, error: offerErr } = await supabase
    .from('offers')
    .select('id, seller_id, status')
    .eq('id', id)
    .single()

  if (offerErr || !offer) throw new Error('Offer not found')
  if (offer.seller_id !== sellerId) throw new Error('Not authorized')
  if (offer.status !== 'pending') throw new Error('Offer is not pending')

  const { data, error } = await supabase
    .from('offers')
    .update({ status: 'rejected', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(OFFER_SELECT)
    .single()

  if (error) throw error
  return data as Offer
}

export async function counterOffer(
  supabase: SupabaseClient,
  id: string,
  sellerId: string,
  amount: number,
  message?: string,
) {
  const { data: original, error: origErr } = await supabase
    .from('offers')
    .select('id, listing_id, buyer_id, seller_id, status')
    .eq('id', id)
    .single()

  if (origErr || !original) throw new Error('Offer not found')
  if (original.seller_id !== sellerId) throw new Error('Not authorized')
  if (original.status !== 'pending') throw new Error('Offer is not pending')

  // Mark original as countered
  await supabase
    .from('offers')
    .update({ status: 'countered', updated_at: new Date().toISOString() })
    .eq('id', id)

  // Create new counter offer
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
  const { data, error } = await supabase
    .from('offers')
    .insert({
      listing_id: original.listing_id,
      buyer_id: original.buyer_id,
      seller_id: sellerId,
      amount_cents: amount,
      message: message ?? null,
      status: 'pending',
      parent_offer_id: id,
      expires_at: expiresAt,
    })
    .select(OFFER_SELECT)
    .single()

  if (error) throw error
  return data as Offer
}

export async function withdrawOffer(
  supabase: SupabaseClient,
  id: string,
  buyerId: string,
) {
  const { data: offer, error: offerErr } = await supabase
    .from('offers')
    .select('id, buyer_id, status')
    .eq('id', id)
    .single()

  if (offerErr || !offer) throw new Error('Offer not found')
  if (offer.buyer_id !== buyerId) throw new Error('Not authorized')
  if (offer.status !== 'pending') throw new Error('Offer is not pending')

  const { data, error } = await supabase
    .from('offers')
    .update({ status: 'withdrawn', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(OFFER_SELECT)
    .single()

  if (error) throw error
  return data as Offer
}

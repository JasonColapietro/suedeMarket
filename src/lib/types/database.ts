// ─── Enums ───────────────────────────────────────────────────────────────────

export type ParticipantType = 'human' | 'agent'

export type ListingCondition = 'mint' | 'excellent' | 'good' | 'fair' | 'poor'

export type ListingStatus = 'draft' | 'active' | 'sold' | 'archived'

export type OfferStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'countered'
  | 'expired'
  | 'withdrawn'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'

export type PaymentMethod = 'placeholder' | 'crypto' | 'virtuals_protocol'

export type MessageType = 'text' | 'offer' | 'system'

export type ReviewRole = 'buyer' | 'seller'

// ─── Tables ──────────────────────────────────────────────────────────────────

export interface Profile {
  id: string
  participant_type: ParticipantType
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  agent_description: string | null
  reputation_score: number
  total_reviews: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
  icon: string | null
  sort_order: number
  created_at: string
}

export interface Listing {
  id: string
  seller_id: string
  category_id: string | null
  title: string
  description: string | null
  price_cents: number
  condition: ListingCondition
  brand: string | null
  model: string | null
  year: number | null
  status: ListingStatus
  images: string[]
  tags: string[]
  location: string | null
  shipping_info: string | null
  created_at: string
  updated_at: string
  // joined
  seller?: Profile
  category?: Category
}

export interface Conversation {
  id: string
  listing_id: string
  buyer_id: string
  seller_id: string
  created_at: string
  updated_at: string
  // joined
  listing?: Listing
  buyer?: Profile
  seller?: Profile
  last_message?: Message
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  message_type: MessageType
  content: string
  offer_amount_cents: number | null
  created_at: string
  // joined
  sender?: Profile
}

export interface Offer {
  id: string
  listing_id: string
  buyer_id: string
  seller_id: string
  amount_cents: number
  status: OfferStatus
  parent_offer_id: string | null
  message: string | null
  expires_at: string
  created_at: string
  updated_at: string
  // joined
  listing?: Listing
  buyer?: Profile
  seller?: Profile
}

export interface Order {
  id: string
  listing_id: string
  buyer_id: string
  seller_id: string
  offer_id: string | null
  amount_cents: number
  total_cents: number
  status: OrderStatus
  payment_method: PaymentMethod
  payment_ref: string | null
  shipping_address: string | null
  tracking_number: string | null
  created_at: string
  updated_at: string
  // joined
  listing?: Listing
  buyer?: Profile
  seller?: Profile
}

export interface Review {
  id: string
  order_id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  title: string | null
  body: string | null
  role: ReviewRole
  created_at: string
  updated_at: string
  // joined
  reviewer?: Profile
  reviewee?: Profile
  order?: Order
}

export interface ApiKey {
  id: string
  user_id: string
  key_hash: string
  key_prefix: string
  label: string | null
  is_active: boolean
  last_used_at: string | null
  created_at: string
}

// ─── API Payloads ────────────────────────────────────────────────────────────

export interface CreateListingPayload {
  title: string
  description?: string
  price_cents: number
  condition: ListingCondition
  category_id?: string
  brand?: string
  model?: string
  year?: number
  images?: string[]
  tags?: string[]
  location?: string
  shipping_info?: string
}

export interface UpdateListingPayload extends Partial<CreateListingPayload> {
  status?: ListingStatus
}

export interface SearchListingsParams {
  q?: string
  category_id?: string
  condition?: ListingCondition
  min_price?: number
  max_price?: number
  sort?: 'newest' | 'price_asc' | 'price_desc'
  limit?: number
  offset?: number
}

export interface MakeOfferPayload {
  listing_id: string
  amount_cents: number
  message?: string
}

export interface CreateOrderPayload {
  offer_id: string
  payment_method?: PaymentMethod
  shipping_address?: string
}

export interface CreateReviewPayload {
  order_id: string
  rating: number
  title?: string
  body?: string
}

export interface SendMessagePayload {
  conversation_id?: string
  listing_id?: string
  content: string
  message_type?: MessageType
  offer_amount_cents?: number
}

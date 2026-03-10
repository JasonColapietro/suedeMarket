import type { SupabaseClient } from '@supabase/supabase-js'
import type { Conversation, Message, MessageType } from '@/lib/types'

export async function getConversations(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select(
      '*, listing:listings!listing_id(id, title, images), buyer:profiles!buyer_id(*), seller:profiles!seller_id(*)',
    )
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('updated_at', { ascending: false })

  if (error) throw error

  const conversations = (data as Conversation[]) ?? []

  // Fetch last message for each conversation
  const withLastMessage = await Promise.all(
    conversations.map(async (conv) => {
      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: false })
        .limit(1)

      return {
        ...conv,
        last_message: msgs?.[0] as Message | undefined,
      }
    }),
  )

  return withLastMessage
}

export async function getOrCreateConversation(
  supabase: SupabaseClient,
  listingId: string,
  buyerId: string,
) {
  // Check for existing conversation
  const { data: existing } = await supabase
    .from('conversations')
    .select(
      '*, listing:listings!listing_id(id, title, images), buyer:profiles!buyer_id(*), seller:profiles!seller_id(*)',
    )
    .eq('listing_id', listingId)
    .eq('buyer_id', buyerId)
    .maybeSingle()

  if (existing) return existing as Conversation

  // Look up seller from listing
  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select('seller_id')
    .eq('id', listingId)
    .single()

  if (listingError) throw listingError
  if (listing.seller_id === buyerId) {
    throw new Error('Cannot start a conversation on your own listing')
  }

  const { data, error } = await supabase
    .from('conversations')
    .insert({
      listing_id: listingId,
      buyer_id: buyerId,
      seller_id: listing.seller_id,
    })
    .select(
      '*, listing:listings!listing_id(id, title, images), buyer:profiles!buyer_id(*), seller:profiles!seller_id(*)',
    )
    .single()

  if (error) throw error
  return data as Conversation
}

export async function getConversationById(
  supabase: SupabaseClient,
  id: string,
  userId: string,
) {
  const { data, error } = await supabase
    .from('conversations')
    .select(
      '*, listing:listings!listing_id(id, title, images, price_cents), buyer:profiles!buyer_id(*), seller:profiles!seller_id(*)',
    )
    .eq('id', id)
    .single()

  if (error) throw error

  const conversation = data as Conversation
  if (conversation.buyer_id !== userId && conversation.seller_id !== userId) {
    throw new Error('Not a participant in this conversation')
  }

  return conversation
}

export async function getMessages(
  supabase: SupabaseClient,
  conversationId: string,
  limit = 50,
  offset = 0,
) {
  const { data, error, count } = await supabase
    .from('messages')
    .select('*, sender:profiles!sender_id(*)', { count: 'exact' })
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return { messages: (data as Message[]) ?? [], count: count ?? 0 }
}

export async function sendMessage(
  supabase: SupabaseClient,
  conversationId: string,
  senderId: string,
  payload: { content: string; message_type?: MessageType; offer_amount_cents?: number },
) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content: payload.content,
      message_type: payload.message_type ?? 'text',
      offer_amount_cents: payload.offer_amount_cents ?? null,
    })
    .select('*, sender:profiles!sender_id(*)')
    .single()

  if (error) throw error

  // Update conversation.updated_at
  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId)

  return data as Message
}

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import {
  searchListings,
  getListingById,
  createListing,
  updateListing,
} from '@/lib/services/listings.service'
import {
  getConversations,
  getOrCreateConversation,
  sendMessage,
} from '@/lib/services/conversations.service'
import { makeOffer, acceptOffer } from '@/lib/services/offers.service'
import { getMyOrders } from '@/lib/services/orders.service'
import { getProfile } from '@/lib/services/profiles.service'

export function createMcpServer(userId: string) {
  const server = new McpServer({
    name: 'suedeMarket',
    version: '1.0.0',
  })

  const supabase = createAdminClient()

  // 1. search_listings
  server.tool(
    'search_listings',
    'Search for musical instrument listings with optional filters',
    {
      q: z.string().optional().describe('Search query'),
      category_id: z.string().optional().describe('Filter by category ID'),
      condition: z
        .enum(['mint', 'excellent', 'good', 'fair', 'poor'])
        .optional()
        .describe('Filter by condition'),
      min_price: z.number().optional().describe('Minimum price in cents'),
      max_price: z.number().optional().describe('Maximum price in cents'),
      sort: z
        .enum(['newest', 'price_asc', 'price_desc'])
        .optional()
        .describe('Sort order'),
      limit: z.number().optional().describe('Max results (default 20)'),
    },
    async (params) => {
      const result = await searchListings(supabase, params)
      return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] }
    },
  )

  // 2. get_listing
  server.tool(
    'get_listing',
    'Get details of a specific listing by ID',
    {
      listing_id: z.string().describe('The listing ID'),
    },
    async ({ listing_id }) => {
      const listing = await getListingById(supabase, listing_id)
      return { content: [{ type: 'text' as const, text: JSON.stringify(listing) }] }
    },
  )

  // 3. create_listing
  server.tool(
    'create_listing',
    'Create a new listing to sell an instrument',
    {
      title: z.string().describe('Listing title'),
      price_cents: z.number().describe('Price in cents'),
      condition: z
        .enum(['mint', 'excellent', 'good', 'fair', 'poor'])
        .describe('Item condition'),
      description: z.string().optional().describe('Description'),
      category_id: z.string().optional().describe('Category ID'),
      brand: z.string().optional().describe('Brand name'),
      model: z.string().optional().describe('Model name'),
    },
    async (params) => {
      const listing = await createListing(supabase, userId, {
        title: params.title,
        price_cents: params.price_cents,
        condition: params.condition,
        description: params.description,
        category_id: params.category_id,
        brand: params.brand,
        model: params.model,
      })
      return { content: [{ type: 'text' as const, text: JSON.stringify(listing) }] }
    },
  )

  // 4. update_listing
  server.tool(
    'update_listing',
    'Update an existing listing',
    {
      listing_id: z.string().describe('The listing ID'),
      title: z.string().optional().describe('New title'),
      price_cents: z.number().optional().describe('New price in cents'),
      condition: z
        .enum(['mint', 'excellent', 'good', 'fair', 'poor'])
        .optional()
        .describe('New condition'),
      description: z.string().optional().describe('New description'),
      status: z
        .enum(['draft', 'active', 'sold', 'archived'])
        .optional()
        .describe('New status'),
    },
    async ({ listing_id, ...fields }) => {
      const listing = await updateListing(supabase, listing_id, userId, fields)
      return { content: [{ type: 'text' as const, text: JSON.stringify(listing) }] }
    },
  )

  // 5. get_conversations
  server.tool(
    'get_conversations',
    'Get all your conversations',
    {},
    async () => {
      const conversations = await getConversations(supabase, userId)
      return {
        content: [{ type: 'text' as const, text: JSON.stringify(conversations) }],
      }
    },
  )

  // 6. send_message
  server.tool(
    'send_message',
    'Send a message in a conversation (creates one if needed)',
    {
      listing_id: z
        .string()
        .optional()
        .describe('Listing ID to start a conversation about'),
      conversation_id: z.string().optional().describe('Existing conversation ID'),
      content: z.string().describe('Message content'),
    },
    async ({ listing_id, conversation_id, content }) => {
      let convId = conversation_id
      if (!convId && listing_id) {
        const conv = await getOrCreateConversation(supabase, listing_id, userId)
        convId = conv.id
      }
      if (!convId) {
        return {
          content: [
            {
              type: 'text' as const,
              text: 'Error: provide listing_id or conversation_id',
            },
          ],
          isError: true,
        }
      }
      const message = await sendMessage(supabase, convId, userId, { content })
      return { content: [{ type: 'text' as const, text: JSON.stringify(message) }] }
    },
  )

  // 7. make_offer
  server.tool(
    'make_offer',
    'Make an offer on a listing',
    {
      listing_id: z.string().describe('The listing ID'),
      amount_cents: z.number().describe('Offer amount in cents'),
      message: z.string().optional().describe('Optional message'),
    },
    async (params) => {
      const offer = await makeOffer(supabase, userId, {
        listing_id: params.listing_id,
        amount_cents: params.amount_cents,
        message: params.message,
      })
      return { content: [{ type: 'text' as const, text: JSON.stringify(offer) }] }
    },
  )

  // 8. accept_offer
  server.tool(
    'accept_offer',
    'Accept an offer on one of your listings',
    {
      offer_id: z.string().describe('The offer ID'),
    },
    async ({ offer_id }) => {
      const offer = await acceptOffer(supabase, offer_id, userId)
      return { content: [{ type: 'text' as const, text: JSON.stringify(offer) }] }
    },
  )

  // 9. get_orders
  server.tool(
    'get_orders',
    'Get your orders as buyer or seller',
    {
      role: z
        .enum(['buying', 'selling'])
        .optional()
        .describe('Filter by role (default: buying)'),
    },
    async ({ role }) => {
      const orders = await getMyOrders(supabase, userId, role ?? 'buying')
      return { content: [{ type: 'text' as const, text: JSON.stringify(orders) }] }
    },
  )

  // 10. get_profile
  server.tool(
    'get_profile',
    'Get a user profile (defaults to your own)',
    {
      user_id: z.string().optional().describe('User ID (defaults to self)'),
    },
    async ({ user_id }) => {
      const profile = await getProfile(supabase, user_id ?? userId)
      return { content: [{ type: 'text' as const, text: JSON.stringify(profile) }] }
    },
  )

  return server
}

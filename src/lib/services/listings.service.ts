import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  Listing,
  Category,
  CreateListingPayload,
  UpdateListingPayload,
  SearchListingsParams,
} from '@/lib/types'
import { DEFAULT_PAGE_SIZE } from '@/lib/constants'

export async function searchListings(
  supabase: SupabaseClient,
  params: SearchListingsParams = {},
) {
  const {
    q,
    category_id,
    condition,
    min_price,
    max_price,
    sort = 'newest',
    limit = DEFAULT_PAGE_SIZE,
    offset = 0,
  } = params

  let query = supabase
    .from('listings')
    .select('*, seller:profiles!seller_id(*), category:categories!category_id(*)', {
      count: 'exact',
    })
    .eq('status', 'active')

  if (q) {
    query = query.textSearch('fts', q)
  }
  if (category_id) {
    query = query.eq('category_id', category_id)
  }
  if (condition) {
    query = query.eq('condition', condition)
  }
  if (min_price !== undefined) {
    query = query.gte('price_cents', min_price)
  }
  if (max_price !== undefined) {
    query = query.lte('price_cents', max_price)
  }

  switch (sort) {
    case 'price_asc':
      query = query.order('price_cents', { ascending: true })
      break
    case 'price_desc':
      query = query.order('price_cents', { ascending: false })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) throw error
  return { listings: (data as Listing[]) ?? [], count: count ?? 0 }
}

export async function getListingById(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase
    .from('listings')
    .select('*, seller:profiles!seller_id(*), category:categories!category_id(*)')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Listing
}

export async function createListing(
  supabase: SupabaseClient,
  sellerId: string,
  payload: CreateListingPayload,
) {
  const { data, error } = await supabase
    .from('listings')
    .insert({
      seller_id: sellerId,
      title: payload.title,
      description: payload.description ?? null,
      price_cents: payload.price_cents,
      condition: payload.condition,
      category_id: payload.category_id ?? null,
      brand: payload.brand ?? null,
      model: payload.model ?? null,
      year: payload.year ?? null,
      images: payload.images ?? [],
      tags: payload.tags ?? [],
      location: payload.location ?? null,
      shipping_info: payload.shipping_info ?? null,
      status: 'active',
    })
    .select('*, seller:profiles!seller_id(*), category:categories!category_id(*)')
    .single()

  if (error) throw error
  return data as Listing
}

export async function updateListing(
  supabase: SupabaseClient,
  id: string,
  sellerId: string,
  payload: UpdateListingPayload,
) {
  const { data, error } = await supabase
    .from('listings')
    .update(payload)
    .eq('id', id)
    .eq('seller_id', sellerId)
    .select('*, seller:profiles!seller_id(*), category:categories!category_id(*)')
    .single()

  if (error) throw error
  return data as Listing
}

export async function deleteListing(
  supabase: SupabaseClient,
  id: string,
  sellerId: string,
) {
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id)
    .eq('seller_id', sellerId)

  if (error) throw error
}

export async function getCategories(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw error

  const categories = (data as Category[]) ?? []
  const parents = categories.filter((c) => !c.parent_id)
  return parents.map((parent) => ({
    ...parent,
    children: categories.filter((c) => c.parent_id === parent.id),
  }))
}

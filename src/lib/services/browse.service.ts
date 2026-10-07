import type { SupabaseClient } from '@supabase/supabase-js'
import type { SearchListingsParams } from '@/lib/types'
import { getCategories, searchListings } from './listings.service'

export async function loadBrowseCatalog(
  supabase: SupabaseClient,
  searchArgs: SearchListingsParams,
) {
  const [listingResult, categoryResult] = await Promise.allSettled([
    searchListings(supabase, searchArgs),
    getCategories(supabase),
  ])

  if (listingResult.status === 'rejected') {
    console.error('[suede-market] Browse listings are unavailable', listingResult.reason)
  }
  if (categoryResult.status === 'rejected') {
    console.error('[suede-market] Browse categories are unavailable', categoryResult.reason)
  }

  return {
    listings: listingResult.status === 'fulfilled' ? listingResult.value.listings : [],
    count: listingResult.status === 'fulfilled' ? listingResult.value.count : 0,
    categories: categoryResult.status === 'fulfilled' ? categoryResult.value : [],
    unavailable:
      listingResult.status === 'rejected' || categoryResult.status === 'rejected',
  }
}

import type { SupabaseClient } from '@supabase/supabase-js'
import { searchListings } from './listings.service'

export async function loadHomeListings(supabase: SupabaseClient) {
  try {
    const { listings } = await searchListings(supabase, {
      limit: 5,
      sort: 'newest',
    })

    return listings
  } catch (error) {
    console.error('[suede-market] Featured listings are unavailable', error)
    return []
  }
}

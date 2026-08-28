import type { SupabaseClient } from '@supabase/supabase-js'

import { searchListings } from '@/lib/services/listings.service'
import { createClient } from '@/lib/supabase/server'

type FeaturedListingsDependencies = {
  createClient: () => Promise<SupabaseClient>
  searchListings: typeof searchListings
}

const defaultDependencies: FeaturedListingsDependencies = {
  createClient,
  searchListings,
}

export async function loadFeaturedListings(
  dependencies: FeaturedListingsDependencies = defaultDependencies,
) {
  try {
    const supabase = await dependencies.createClient()
    const { listings } = await dependencies.searchListings(supabase, {
      limit: 5,
      sort: 'newest',
    })

    return listings
  } catch {
    return []
  }
}

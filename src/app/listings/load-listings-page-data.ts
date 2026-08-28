import type { SupabaseClient } from '@supabase/supabase-js'

import { getCategories, searchListings } from '@/lib/services/listings.service'
import { createClient } from '@/lib/supabase/server'
import type { SearchListingsParams } from '@/lib/types'

type ListingsPageDependencies = {
  createClient: () => Promise<SupabaseClient>
  searchListings: typeof searchListings
  getCategories: typeof getCategories
}

const defaultDependencies: ListingsPageDependencies = {
  createClient,
  searchListings,
  getCategories,
}

export async function loadListingsPageData(
  searchArgs: SearchListingsParams,
  dependencies: ListingsPageDependencies = defaultDependencies,
) {
  try {
    const supabase = await dependencies.createClient()
    const [{ listings, count }, categories] = await Promise.all([
      dependencies.searchListings(supabase, searchArgs),
      dependencies.getCategories(supabase),
    ])

    return { listings, count, categories }
  } catch {
    return { listings: [], count: 0, categories: [] }
  }
}

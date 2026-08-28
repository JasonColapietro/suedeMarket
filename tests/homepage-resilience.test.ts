import assert from 'node:assert/strict'
import test from 'node:test'

import type { SupabaseClient } from '@supabase/supabase-js'

import { loadFeaturedListings } from '../src/app/load-featured-listings'

test('the prelaunch homepage stays renderable when listing storage is unavailable', async () => {
  const unavailableStorage = {
    createClient: async () => ({}) as SupabaseClient,
    searchListings: async () => {
      throw new TypeError('fetch failed: getaddrinfo ENOTFOUND')
    },
  }

  const listings = await loadFeaturedListings(unavailableStorage)

  assert.deepEqual(listings, [])
})

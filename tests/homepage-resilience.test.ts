import assert from 'node:assert/strict'
import test from 'node:test'

import type { SupabaseClient } from '@supabase/supabase-js'

import { loadFeaturedListings } from '../src/app/load-featured-listings'
import { loadListingsPageData } from '../src/app/listings/load-listings-page-data'

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

test('the prelaunch catalog stays renderable when listing storage is unavailable', async () => {
  const unavailableStorage = {
    createClient: async () => ({}) as SupabaseClient,
    searchListings: async () => {
      throw new TypeError('fetch failed: getaddrinfo ENOTFOUND')
    },
    getCategories: async () => {
      throw new TypeError('fetch failed: getaddrinfo ENOTFOUND')
    },
  }

  const result = await loadListingsPageData({}, unavailableStorage)

  assert.deepEqual(result, { listings: [], count: 0, categories: [] })
})

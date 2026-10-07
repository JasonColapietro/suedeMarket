import assert from 'node:assert/strict'
import test from 'node:test'
import type { SupabaseClient } from '@supabase/supabase-js'
import { loadHomeListings } from '../src/lib/services/home.service'

function createFailingSupabaseClient() {
  const query = {
    select() {
      return query
    },
    eq() {
      return query
    },
    order() {
      return query
    },
    range() {
      return query
    },
    then<TResult1 = unknown, TResult2 = never>(
      onFulfilled?: ((value: unknown) => TResult1 | PromiseLike<TResult1>) | null,
      onRejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
    ) {
      return Promise.resolve({
        data: null,
        error: new Error('fetch failed'),
        count: null,
      }).then(onFulfilled, onRejected)
    },
  }

  return {
    from() {
      return query
    },
  } as unknown as SupabaseClient
}

test('homepage listings degrade to an empty state when Supabase is unavailable', async () => {
  const errors: unknown[][] = []
  const originalConsoleError = console.error
  console.error = (...args: unknown[]) => {
    errors.push(args)
  }

  try {
    const listings = await loadHomeListings(createFailingSupabaseClient())
    assert.deepEqual(listings, [])
    assert.equal(errors.length, 1)
  } finally {
    console.error = originalConsoleError
  }
})

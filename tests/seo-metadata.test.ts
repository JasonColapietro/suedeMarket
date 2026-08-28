import assert from 'node:assert/strict'
import test from 'node:test'

import { siteMetadata } from '../src/app/site-metadata'

test('prelaunch marketplace pages stay out of search while links remain crawlable', () => {
  assert.deepEqual(siteMetadata.robots, {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  })
})

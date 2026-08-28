import assert from 'node:assert/strict'
import test from 'node:test'

import robots from '../src/app/robots'

test('prelaunch crawlers can reach the page-level noindex directive', () => {
  assert.deepEqual(robots(), {
    rules: { userAgent: '*', allow: '/' },
  })
})

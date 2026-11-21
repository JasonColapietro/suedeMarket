import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { test } from 'node:test'

// The company is "Suede" (owner direction, 2026-11-21). "Suede AI" and
// "Suede Labs" survive only as schema alternateName entries and one
// "formerly known as" alias line per discovery file.
const OLD_NAME = /suede[ _]?ai\b(?![.\-/])|suede[ -]?labs\b(?![.\-/])/i
const ALIAS_SPOTS = [
  /["']?alternateName["']?\s*:\s*\[[^\]]*\]/g,
  /^.*formerly known as Suede AI.*$/gim,
]

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return files(path)
    return /\.(tsx?|mjs|js|html|txt|xml|json|md)$/.test(name) ? [path] : []
  })
}

test('public copy names the company Suede, not Suede AI or Suede Labs', () => {
  const hits = []
  for (const file of [...files('src'), ...files('public')]) {
    readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
      const stripped = ALIAS_SPOTS.reduce((text, pattern) => text.replace(pattern, ''), line)
      if (OLD_NAME.test(stripped)) hits.push(`${file}:${i + 1}: ${line.trim().slice(0, 120)}`)
    })
  }
  assert.deepEqual(hits, [])
})

import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import http from 'node:http'
import { test } from 'node:test'

// Exercise the actual Next routes, SSR pages and Supabase client against a
// local HTTP fixture. No production credentials or database are required.
test('public catalog distinguishes backend outages from an empty catalog', async (t) => {
  let mode = 'transport'
  const listing = {
    id: '00000000-0000-4000-8000-000000000001', title: 'Regression test guitar',
    price_cents: 10000, condition: 'good', status: 'active', images: [],
    created_at: '2026-10-12T00:00:00Z', seller: { display_name: 'Test seller' },
  }
  const backend = http.createServer((req, res) => {
    if (mode === 'transport') return req.socket.destroy()
    const categories = req.url.startsWith('/rest/v1/categories')
    if (mode === 'database' || (mode === 'categories-down' && categories)) {
      res.writeHead(503, { 'Content-Type': 'application/json' })
      return res.end(JSON.stringify({ code: 'PGRST002', message: 'Private backend detail', details: 'PRIVATE_TEST_TOKEN' }))
    }
    const data = categories ? [{ id: 'guitar-category', name: 'Guitars', slug: 'guitars', parent_id: null }] : mode === 'empty' ? [] : [listing]
    res.writeHead(200, { 'Content-Type': 'application/json', 'Content-Range': `0-${Math.max(0, data.length - 1)}/${data.length}` })
    res.end(JSON.stringify(data))
  })
  backend.listen(0, '127.0.0.1')
  await once(backend, 'listening')
  const portProbe = http.createServer()
  portProbe.listen(0, '127.0.0.1')
  await once(portProbe, 'listening')
  const port = portProbe.address().port
  await new Promise((resolve) => portProbe.close(resolve))
  let logs = ''
  const app = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '--webpack', '--hostname', '127.0.0.1', '--port', String(port)], {
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1', NEXT_PUBLIC_SUPABASE_URL: `http://127.0.0.1:${backend.address().port}`, NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-public-key' },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  app.stdout.on('data', (chunk) => { logs += chunk })
  app.stderr.on('data', (chunk) => { logs += chunk })
  t.after(async () => {
    app.kill('SIGTERM')
    await once(app, 'exit')
    await new Promise((resolve) => backend.close(resolve))
  })
  for (let attempt = 0; !logs.includes('Ready in'); attempt++) {
    assert.ok(attempt < 1200 && app.exitCode === null, logs)
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  const get = (path) => fetch(`http://127.0.0.1:${port}${path}`)

  for (const failure of ['transport', 'database']) {
    mode = failure
    await t.test(`${failure} errors return retryable JSON without leaking backend details`, async () => {
      for (const path of ['/api/listings', '/api/categories']) {
        const response = await get(path)
        assert.equal(response.status, 503)
        assert.equal(response.headers.get('cache-control'), 'no-store')
        const body = await response.json()
        assert.equal(body.code, 'CATALOG_UNAVAILABLE')
        assert.match(body.error, /temporarily unavailable/i)
        assert.doesNotMatch(JSON.stringify(body), /Private backend detail|PRIVATE_TEST_TOKEN/)
      }
    })
  }

  await t.test('browsing and marketing stay available with a truthful outage state', async () => {
    for (const path of ['/listings?q=guitar', '/']) {
      const response = await get(path)
      assert.equal(response.status, 200)
      const html = await response.text()
      assert.match(html, /Listings temporarily unavailable/)
      assert.match(html, /Try again/)
      assert.doesNotMatch(html, /No listings found|No listings yet/)
    }
  })

  mode = 'categories-down'
  await t.test('category failure preserves successful listing results', async () => {
    const html = await (await get('/listings')).text()
    assert.match(html, /Regression test guitar/)
    assert.match(html, /Category filters temporarily unavailable/)
    assert.doesNotMatch(html, /No listings found/)
  })

  mode = 'empty'
  await t.test('healthy empty results keep their success and empty state', async () => {
    const listings = await get('/api/listings')
    assert.equal(listings.status, 200)
    assert.deepEqual(await listings.json(), { listings: [], count: 0 })
    const categories = await get('/api/categories')
    assert.equal(categories.status, 200)
    assert.equal((await categories.json())[0].name, 'Guitars')
    assert.match(await (await get('/listings')).text(), /No listings found/)
    assert.match(await (await get('/')).text(), /No listings yet/)
  })

  mode = 'healthy'
  await t.test('recovery returns real listing data and removes the outage state', async () => {
    const response = await get('/api/listings?q=guitar&sort=price_asc&limit=5&offset=0')
    assert.equal(response.status, 200)
    assert.equal((await response.json()).listings[0].id, listing.id)
    const html = await (await get('/listings')).text()
    assert.match(html, /Regression test guitar/)
    assert.doesNotMatch(html, /Listings temporarily unavailable|Category filters temporarily unavailable/)
    assert.doesNotMatch(logs, /PRIVATE_TEST_TOKEN/)
  })
})

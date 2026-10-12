import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import http from 'node:http'
import { test } from 'node:test'

test('SEO retirement preserves reference content and removes marketplace functions', async (t) => {
  const probe = http.createServer()
  probe.listen(0, '127.0.0.1')
  await once(probe, 'listening')
  const port = probe.address().port
  await new Promise((resolve) => probe.close(resolve))
  const env = { ...process.env, NEXT_TELEMETRY_DISABLED: '1' }
  delete env.NEXT_PUBLIC_SUPABASE_URL
  delete env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  delete env.SUPABASE_SERVICE_ROLE_KEY
  let logs = ''
  const app = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '--webpack', '--hostname', '127.0.0.1', '--port', String(port)], { env, stdio: ['ignore', 'pipe', 'pipe'] })
  app.stdout.on('data', (chunk) => { logs += chunk })
  app.stderr.on('data', (chunk) => { logs += chunk })
  t.after(async () => {
    if (app.exitCode === null) {
      const stopped = once(app, 'exit')
      app.kill('SIGTERM')
      await stopped
    }
  })
  for (let attempt = 0; !logs.includes('Ready in'); attempt++) {
    assert.ok(attempt < 1200 && app.exitCode === null, logs)
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  const get = (path, options = {}) => fetch(`http://127.0.0.1:${port}${path}`, { redirect: 'manual', signal: AbortSignal.timeout(60000), ...options })

  await t.test('removed functions return 410 without a redirect or canonical', async () => {
    for (const path of ['/listings', '/listings?q=guitar', '/listings/old-item', '/listings/old-item.jpg', '/listings/new', '/listings/old-item/edit', '/login', '/register', '/callback?code=old', '/dashboard', '/messages/old', '/orders/old', '/profile/old/settings']) {
      const response = await get(path)
      assert.equal(response.status, 410, path)
      assert.equal(response.headers.get('location'), null, path)
      assert.equal(response.headers.get('x-robots-tag'), 'noindex', path)
      const html = await response.text()
      assert.ok(/retired/i.test(html), path)
      assert.ok(!/rel=["']canonical/.test(html), path)
    }
  })

  await t.test('retired API reads and writes stop before reaching a backend', async () => {
    for (const [path, method] of [['/api/listings', 'GET'], ['/api/categories', 'GET'], ['/api/listings/old-item', 'HEAD'], ['/api/listings', 'POST'], ['/api/orders/old', 'PATCH'], ['/api/mcp', 'POST'], ['/api/agent/keys', 'DELETE']]) {
      const response = await get(path, { method })
      assert.equal(response.status, 410, `${method} ${path}`)
      assert.equal(response.headers.get('location'), null)
      if (method !== 'HEAD') assert.equal((await response.json()).code, 'MARKET_RETIRED')
    }
  })

  await t.test('useful guides remain indexable without Supabase or active sales promises', async () => {
    for (const path of ['/', '/ai-instructions']) {
      const response = await get(path)
      assert.equal(response.status, 200, path)
      const html = await response.text()
      const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)
      assert.ok(canonical, path)
      assert.equal(new URL(canonical[1]).href, `https://market.suedeai.ai${path}`)
      assert.ok(/retired/i.test(html), path)
      assert.ok(!/href="\/(?:listings|register|login|dashboard|messages|orders|profile|api)(?:[/?"])/.test(html), path)
      assert.ok(!/SearchAction|Search instruments|Create an account|No listings yet/.test(html), path)
      assert.ok(!/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html), path)
    }
    const home = await (await get('/')).text()
    assert.ok(home.includes('id="selling-guide"') && home.includes('id="buying-guide"'))
    assert.ok(home.includes('pickup configuration') && home.includes('power supply'))
  })

  await t.test('discovery files list only retained URLs and permit retirement recrawling', async () => {
    const sitemap = await (await get('/sitemap.xml')).text()
    const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
    assert.deepEqual(locations, ['https://market.suedeai.ai/', 'https://market.suedeai.ai/ai-instructions'])
    const robots = await (await get('/robots.txt')).text()
    assert.ok(!/^Disallow:\s*\/(?:$|api|listings|callback|login|register)/m.test(robots))
    for (const path of ['/llms.txt', '/llms-full.txt']) {
      const response = await get(path)
      assert.equal(response.status, 200)
      const text = await response.text()
      assert.ok(/retired/i.test(text))
      assert.ok(!/market\.suedeai\.ai\/listings|current public listings|sellers can register/i.test(text))
    }
    assert.equal((await get('/og-image.jpg')).status, 200)
    assert.equal((await get('/4c265a375effa42521f5b88bb3c28501.txt')).status, 200)
  })

  await t.test('unrelated unknown URLs remain 404 instead of being redirected', async () => {
    for (const path of ['/unrelated-missing-page', '/listings-guide-missing']) {
      const response = await get(path)
      assert.equal(response.status, 404)
      assert.equal(response.headers.get('location'), null)
    }
  })
})

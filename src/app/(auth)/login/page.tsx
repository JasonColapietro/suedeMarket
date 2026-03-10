'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/listings')
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f0f14] px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <p className="text-[12px] font-medium tracking-[0.35em] uppercase text-white/30">
            Welcome back
          </p>
          <h1 className="mt-3 text-3xl font-normal text-white">
            Sign in to <span className="font-serif italic">suedeMarket</span>
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Buy and sell musical instruments
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-sm bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">{error}</div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/50 mb-1.5">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-sm bg-white/5 border border-white/15 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/50 mb-1.5">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-sm bg-white/5 border border-white/15 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-white px-4 py-2.5 text-sm font-medium text-[#0f0f14] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-white/50">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-white/80 hover:text-white transition-colors">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

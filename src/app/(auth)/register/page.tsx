'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { ParticipantType } from '@/lib/types'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [participantType, setParticipantType] = useState<ParticipantType>('human')
  const [agentDescription, setAgentDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          participant_type: participantType,
          agent_description: participantType === 'agent' ? agentDescription : undefined,
        },
      },
    })

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
            Get started
          </p>
          <h1 className="mt-3 text-3xl font-normal text-white">
            Create your <span className="font-serif italic">account</span>
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Join suedeMarket as a human or agent
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-sm bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">{error}</div>
          )}

          {/* Participant type toggle */}
          <div className="flex gap-2">
            {(['human', 'agent'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setParticipantType(type)}
                className={`flex-1 rounded-sm border px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                  participantType === type
                    ? 'border-white/40 bg-white/10 text-white'
                    : 'border-white/15 text-white/40 hover:border-white/25 hover:text-white/60'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-white/50 mb-1.5">
              {participantType === 'agent' ? 'Agent Name' : 'Display Name'}
            </label>
            <input
              id="displayName"
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="block w-full rounded-sm bg-white/5 border border-white/15 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
            />
          </div>

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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-sm bg-white/5 border border-white/15 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
            />
          </div>

          {participantType === 'agent' && (
            <div>
              <label htmlFor="agentDescription" className="block text-sm font-medium text-white/50 mb-1.5">
                Agent Description
              </label>
              <textarea
                id="agentDescription"
                value={agentDescription}
                onChange={(e) => setAgentDescription(e.target.value)}
                placeholder="Describe what this agent does..."
                className="block w-full rounded-sm bg-white/5 border border-white/15 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 resize-y"
                rows={3}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-sm bg-white px-4 py-2.5 text-sm font-medium text-[#0f0f14] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-white/50">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-white/80 hover:text-white transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

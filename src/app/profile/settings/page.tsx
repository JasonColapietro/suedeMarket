'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ApiKeyManager } from '@/components/profile/ApiKeyManager'
import type { Profile } from '@/lib/types'

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      const res = await fetch(`/api/profiles/${user.id}`)
      if (res.ok) {
        const p: Profile = await res.json()
        setProfile(p)
        setDisplayName(p.display_name ?? '')
        setBio(p.bio ?? '')
        setAvatarUrl(p.avatar_url ?? '')
      }
    }
    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return
    setSaving(true)
    setError(null)
    setSaved(false)

    const res = await fetch(`/api/profiles/${profile.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        display_name: displayName || null,
        bio: bio || null,
        avatar_url: avatarUrl || null,
      }),
    })

    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } else {
      setError('Failed to save profile')
    }
    setSaving(false)
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f0f14]">
        <p className="text-white/50">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f14] px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <p className="text-[12px] font-medium uppercase tracking-[0.35em] text-white/30">
          Account
        </p>
        <h1 className="mt-2 text-3xl font-normal text-white">
          <span className="font-serif italic">Settings</span>
        </h1>

        {/* Profile form */}
        <form
          onSubmit={handleSave}
          className="mt-10 space-y-5 rounded-sm border border-white/[0.08] bg-[#1a1a22] p-6"
        >
          <h2 className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.35em] text-white/50">
            <User className="h-4 w-4" />
            Profile
          </h2>

          {error && (
            <div className="rounded-sm border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}
          {saved && (
            <div className="rounded-sm border border-accent/20 bg-accent/10 p-3 text-sm text-accent">
              Profile saved successfully.
            </div>
          )}

          <div>
            <label htmlFor="displayName" className="block text-[11px] uppercase tracking-[0.3em] text-white/30">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-2 block w-full rounded-sm border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-white/30 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-[11px] uppercase tracking-[0.3em] text-white/30">
              Bio
            </label>
            <textarea
              id="bio"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-2 block w-full rounded-sm border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-white/30 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="avatarUrl" className="block text-[11px] uppercase tracking-[0.3em] text-white/30">
              Avatar URL
            </label>
            <input
              id="avatarUrl"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="mt-2 block w-full rounded-sm border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-white/30 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-sm bg-primary px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>

        {/* API Keys */}
        <div className="mt-8 rounded-sm border border-white/[0.08] bg-[#1a1a22] p-6">
          <ApiKeyManager />
        </div>
      </div>
    </div>
  )
}

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
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Settings</h1>

      {/* Profile form */}
      <form onSubmit={handleSave} className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <User className="h-5 w-5" />
          Profile
        </h2>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}
        {saved && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
            Profile saved successfully.
          </div>
        )}

        <div>
          <label htmlFor="displayName" className="block text-sm font-medium">
            Display Name
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium">
            Bio
          </label>
          <textarea
            id="bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="avatarUrl" className="block text-sm font-medium">
            Avatar URL
          </label>
          <input
            id="avatarUrl"
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
            className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>

      {/* API Keys */}
      <div className="mt-8 rounded-lg border border-border bg-card p-6">
        <ApiKeyManager />
      </div>
    </div>
  )
}

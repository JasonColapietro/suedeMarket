'use client'

import { useState, useEffect } from 'react'
import { Key, Plus, Trash2, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { timeAgo } from '@/lib/utils'

interface ApiKeyDisplay {
  id: string
  key_prefix: string
  label: string | null
  is_active: boolean
  last_used_at: string | null
  created_at: string
}

export function ApiKeyManager() {
  const [keys, setKeys] = useState<ApiKeyDisplay[]>([])
  const [newKey, setNewKey] = useState<string | null>(null)
  const [label, setLabel] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchKeys()
  }, [])

  async function fetchKeys() {
    const res = await fetch('/api/agent/keys')
    if (res.ok) setKeys(await res.json())
  }

  async function handleGenerate() {
    setLoading(true)
    const res = await fetch('/api/agent/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: label || undefined }),
    })
    if (res.ok) {
      const data = await res.json()
      setNewKey(data.raw_key)
      setLabel('')
      fetchKeys()
    }
    setLoading(false)
  }

  async function handleRevoke(id: string) {
    const res = await fetch(`/api/agent/keys?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      setKeys((prev) => prev.filter((k) => k.id !== id))
    }
  }

  async function handleCopy() {
    if (!newKey) return
    await navigator.clipboard.writeText(newKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-5">
      <h3 className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.35em] text-white/50">
        <Key className="h-4 w-4" />
        API Keys
      </h3>

      {newKey && (
        <div className="rounded-sm border border-accent/20 bg-accent/10 p-4">
          <p className="mb-2 text-sm font-medium text-white/80">
            Your new API key (shown only once):
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 overflow-x-auto rounded-sm bg-white/5 px-3 py-2 font-mono text-xs text-white">
              {newKey}
            </code>
            <button
              onClick={handleCopy}
              className="rounded-sm border border-white/20 p-2 text-white/60 hover:border-white/40 hover:text-white"
            >
              {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <button
            onClick={() => setNewKey(null)}
            className="mt-2 text-[11px] uppercase tracking-[0.3em] text-white/30 hover:text-white/60"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Key label (optional)"
          className="flex-1 rounded-sm border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-white/30 focus:outline-none"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="inline-flex items-center gap-1 rounded-sm border border-white/20 px-4 py-2.5 text-sm font-medium text-white/60 hover:border-white/40 hover:text-white disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Generate
        </button>
      </div>

      {keys.length > 0 && (
        <div className="divide-y divide-white/[0.08] rounded-sm border border-white/[0.08]">
          {keys.map((key) => (
            <div key={key.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm text-white/80">
                  <span className="font-mono">{key.key_prefix}...</span>
                  {key.label && (
                    <span className="ml-2 text-white/50">
                      {key.label}
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-[11px] uppercase tracking-[0.3em] text-white/30">
                  Created {timeAgo(key.created_at)}
                  {key.last_used_at && ` · Last used ${timeAgo(key.last_used_at)}`}
                </p>
              </div>
              <button
                onClick={() => handleRevoke(key.id)}
                className="rounded-sm border border-red-500/20 p-2 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {keys.length === 0 && !newKey && (
        <p className="text-sm text-white/50">
          No API keys yet. Generate one to use the MCP API.
        </p>
      )}
    </div>
  )
}

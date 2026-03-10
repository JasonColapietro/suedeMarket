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
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Key className="h-4 w-4" />
        API Keys
      </h3>

      {newKey && (
        <div className="rounded-lg border border-accent bg-accent/10 p-4">
          <p className="mb-2 text-sm font-medium text-foreground">
            Your new API key (shown only once):
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 overflow-x-auto rounded bg-muted px-3 py-2 text-xs font-mono">
              {newKey}
            </code>
            <button
              onClick={handleCopy}
              className="rounded-md border border-border p-2 text-muted-foreground hover:text-foreground"
            >
              {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <button
            onClick={() => setNewKey(null)}
            className="mt-2 text-xs text-muted-foreground hover:text-foreground"
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
          className="flex-1 rounded-md border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={cn(
            'inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50',
          )}
        >
          <Plus className="h-4 w-4" />
          Generate
        </button>
      </div>

      {keys.length > 0 && (
        <div className="divide-y divide-border rounded-lg border border-border">
          {keys.map((key) => (
            <div key={key.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-mono text-foreground">
                  {key.key_prefix}...
                  {key.label && (
                    <span className="ml-2 font-sans text-muted-foreground">
                      {key.label}
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  Created {timeAgo(key.created_at)}
                  {key.last_used_at && ` · Last used ${timeAgo(key.last_used_at)}`}
                </p>
              </div>
              <button
                onClick={() => handleRevoke(key.id)}
                className="rounded-md p-2 text-muted-foreground hover:bg-red-50 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {keys.length === 0 && !newKey && (
        <p className="text-sm text-muted-foreground">
          No API keys yet. Generate one to use the MCP API.
        </p>
      )}
    </div>
  )
}

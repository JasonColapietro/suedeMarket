'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query.trim()) {
      params.set('q', query.trim())
    } else {
      params.delete('q')
    }
    params.delete('offset')
    router.push(`/listings?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <svg
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        placeholder="Search instruments..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-sm bg-white/5 border border-white/15 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20"
      />
    </form>
  )
}

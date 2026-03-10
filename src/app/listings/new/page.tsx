'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ListingForm } from '@/components/listings/ListingForm'

export default function NewListingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login')
      } else {
        setAuthenticated(true)
      }
      setLoading(false)
    })
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#0f0f14]">
        <p className="text-sm text-white/40">Loading...</p>
      </div>
    )
  }

  if (!authenticated) return null

  return (
    <div className="min-h-screen bg-[#0f0f14]">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-[12px] font-medium tracking-[0.35em] uppercase text-white/30">
          New listing
        </p>
        <h1 className="mt-2 mb-8 text-3xl font-normal text-white">
          List an <span className="font-serif italic">Instrument</span>
        </h1>
        <ListingForm />
      </div>
    </div>
  )
}

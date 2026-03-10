'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ListingForm } from '@/components/listings/ListingForm'
import type { Listing } from '@/lib/types'

export default function EditListingPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(true)
  const [listing, setListing] = useState<Listing | null>(null)

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const res = await fetch(`/api/listings/${id}`)
      if (!res.ok) {
        router.push('/listings')
        return
      }

      const data = await res.json()
      if (data.seller_id !== user.id) {
        router.push(`/listings/${id}`)
        return
      }

      setListing(data)
      setLoading(false)
    }

    load()
  }, [id, router])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!listing) return null

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Edit Listing</h1>
      <ListingForm listing={listing} />
    </div>
  )
}

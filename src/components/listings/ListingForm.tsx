'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { CONDITION_LABELS } from '@/lib/constants'
import { ImageUpload } from './ImageUpload'
import type {
  Listing,
  ListingCondition,
  Category,
  CreateListingPayload,
} from '@/lib/types'

interface CategoryWithChildren extends Category {
  children: Category[]
}

export function ListingForm({ listing }: { listing?: Listing }) {
  const router = useRouter()
  const [categories, setCategories] = useState<CategoryWithChildren[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState(listing?.title ?? '')
  const [description, setDescription] = useState(listing?.description ?? '')
  const [priceDollars, setPriceDollars] = useState(
    listing ? (listing.price_cents / 100).toFixed(2) : '',
  )
  const [condition, setCondition] = useState<ListingCondition>(
    listing?.condition ?? 'good',
  )
  const [categoryId, setCategoryId] = useState(listing?.category_id ?? '')
  const [brand, setBrand] = useState(listing?.brand ?? '')
  const [model, setModel] = useState(listing?.model ?? '')
  const [year, setYear] = useState(listing?.year?.toString() ?? '')
  const [location, setLocation] = useState(listing?.location ?? '')
  const [shippingInfo, setShippingInfo] = useState(listing?.shipping_info ?? '')
  const [images, setImages] = useState<string[]>(listing?.images ?? [])

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const priceCents = Math.round(parseFloat(priceDollars) * 100)
    if (isNaN(priceCents) || priceCents <= 0) {
      setError('Please enter a valid price')
      setSubmitting(false)
      return
    }

    const payload: CreateListingPayload = {
      title: title.trim(),
      description: description.trim() || undefined,
      price_cents: priceCents,
      condition,
      category_id: categoryId || undefined,
      brand: brand.trim() || undefined,
      model: model.trim() || undefined,
      year: year ? parseInt(year) : undefined,
      location: location.trim() || undefined,
      shipping_info: shippingInfo.trim() || undefined,
      images,
    }

    const url = listing ? `/api/listings/${listing.id}` : '/api/listings'
    const method = listing ? 'PATCH' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Something went wrong')
      }

      const data = await res.json()
      router.push(`/listings/${data.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-sm bg-white/5 border border-white/15 px-3 py-2.5 text-sm text-white placeholder-white/30 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20'
  const labelClass = 'block text-sm font-medium text-white/50 mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-sm bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div>
        <label className={labelClass}>Title *</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. 1964 Fender Stratocaster"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your instrument..."
          className={cn(inputClass, 'resize-y')}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Price (USD) *</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/30">
              $
            </span>
            <input
              type="number"
              required
              step="0.01"
              min="0.01"
              value={priceDollars}
              onChange={(e) => setPriceDollars(e.target.value)}
              placeholder="0.00"
              className={cn(inputClass, 'pl-7')}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Condition *</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value as ListingCondition)}
            className={inputClass}
          >
            {Object.entries(CONDITION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={inputClass}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <optgroup key={cat.id} label={cat.name}>
              <option value={cat.id}>{cat.name}</option>
              {cat.children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Brand</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="e.g. Fender"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Model</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="e.g. Stratocaster"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Year</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="e.g. 1964"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Nashville, TN"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Shipping Info</label>
          <input
            type="text"
            value={shippingInfo}
            onChange={(e) => setShippingInfo(e.target.value)}
            placeholder="e.g. Free shipping, ships in 2 days"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Images</label>
        <ImageUpload images={images} onChange={setImages} />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className={cn(
            'rounded-sm bg-white px-6 py-2.5 text-sm font-medium text-[#0f0f14] transition-opacity hover:opacity-90',
            submitting && 'cursor-not-allowed opacity-50',
          )}
        >
          {submitting
            ? 'Saving...'
            : listing
              ? 'Update Listing'
              : 'Create Listing'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-sm border border-white/20 px-6 py-2.5 text-sm font-medium text-white/60 transition-colors hover:border-white/40 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

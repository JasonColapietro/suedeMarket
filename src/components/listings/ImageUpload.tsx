'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export function ImageUpload({
  images,
  onChange,
}: {
  images: string[]
  onChange: (images: string[]) => void
}) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const supabase = createClient()
    const newUrls: string[] = []

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const path = `${crypto.randomUUID()}.${ext}`

      const { error } = await supabase.storage
        .from('listing-images')
        .upload(path, file)

      if (!error) {
        const {
          data: { publicUrl },
        } = supabase.storage.from('listing-images').getPublicUrl(path)
        newUrls.push(publicUrl)
      }
    }

    onChange([...images, ...newUrls])
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {images.map((url, i) => (
          <div key={i} className="group relative h-24 w-24 overflow-hidden rounded-lg border border-border">
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            'flex h-24 w-24 flex-col items-center justify-center rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent',
            uploading && 'cursor-not-allowed opacity-50',
          )}
        >
          {uploading ? (
            <span className="text-xs">Uploading...</span>
          ) : (
            <>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="mt-1 text-xs">Add</span>
            </>
          )}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  )
}

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Category } from '@/lib/types'

interface CategoryWithChildren extends Category {
  children: Category[]
}

export function CategoryFilter({
  categories,
}: {
  categories: CategoryWithChildren[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategoryId = searchParams.get('category_id')

  function selectCategory(id: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (id) {
      params.set('category_id', id)
    } else {
      params.delete('category_id')
    }
    params.delete('offset')
    router.push(`/listings?${params.toString()}`)
  }

  return (
    <div className="space-y-1">
      <h3 className="mb-3 text-[12px] font-medium tracking-[0.15em] uppercase text-white/30">Categories</h3>
      <button
        onClick={() => selectCategory(null)}
        className={cn(
          'block w-full rounded-sm px-3 py-1.5 text-left text-sm transition-colors',
          !activeCategoryId
            ? 'bg-white/10 text-white'
            : 'text-white/40 hover:text-white/70',
        )}
      >
        All Categories
      </button>
      {categories.map((cat) => (
        <div key={cat.id}>
          <button
            onClick={() => selectCategory(cat.id)}
            className={cn(
              'block w-full rounded-sm px-3 py-1.5 text-left text-sm font-medium transition-colors',
              activeCategoryId === cat.id
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:text-white/80',
            )}
          >
            {cat.icon && <span className="mr-1.5">{cat.icon}</span>}
            {cat.name}
          </button>
          {cat.children.map((child) => (
            <button
              key={child.id}
              onClick={() => selectCategory(child.id)}
              className={cn(
                'block w-full rounded-sm py-1.5 pl-7 pr-3 text-left text-sm transition-colors',
                activeCategoryId === child.id
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white/70',
              )}
            >
              {child.name}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

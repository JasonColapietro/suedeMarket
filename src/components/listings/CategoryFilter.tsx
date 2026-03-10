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
      <h3 className="mb-2 text-sm font-semibold text-foreground">Categories</h3>
      <button
        onClick={() => selectCategory(null)}
        className={cn(
          'block w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors',
          !activeCategoryId
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )}
      >
        All Categories
      </button>
      {categories.map((cat) => (
        <div key={cat.id}>
          <button
            onClick={() => selectCategory(cat.id)}
            className={cn(
              'block w-full rounded-md px-3 py-1.5 text-left text-sm font-medium transition-colors',
              activeCategoryId === cat.id
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-muted',
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
                'block w-full rounded-md py-1.5 pl-7 pr-3 text-left text-sm transition-colors',
                activeCategoryId === child.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
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

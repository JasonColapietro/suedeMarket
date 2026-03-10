'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Music, User, Settings, LogOut, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

const NAV_LINKS = [
  { href: '/listings', label: 'Browse' },
  { href: '/messages', label: 'Messages' },
  { href: '/orders', label: 'Orders' },
  { href: '/dashboard', label: 'Dashboard' },
]

export function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const isHome = pathname === '/'
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user))
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    setDropdownOpen(false)
    router.push('/')
    router.refresh()
  }

  return (
    <nav
      className={cn(
        'fixed top-0 z-50 w-full transition-colors',
        isHome
          ? 'bg-transparent'
          : 'border-b border-white/10 bg-[#0f0f14]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0f0f14]/80',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10">
            <Music className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-[0.2em] text-white uppercase">
            SuedeMarket
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-[13px] font-medium tracking-[0.15em] text-white/60 uppercase transition-colors hover:text-white"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white/40"
              >
                <User className="h-4 w-4" />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-white/10 bg-[#1a1a24] py-1 shadow-xl">
                    <Link
                      href={`/profile/${user.id}`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <Link
                      href="/profile/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-4 md:flex">
              <Link
                href="/login"
                className="text-[13px] font-medium tracking-[0.15em] text-white/60 uppercase transition-colors hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-sm border border-white/30 px-5 py-2 text-[13px] font-medium tracking-[0.15em] text-white uppercase transition-colors hover:border-white hover:bg-white/5"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-md p-2 text-white/70 md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-[#0f0f14]/95 px-6 pb-4 pt-2 backdrop-blur md:hidden">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-md px-3 py-2.5 text-[13px] font-medium tracking-[0.15em] text-white/60 uppercase hover:text-white"
            >
              {label}
            </Link>
          ))}
          {!user && (
            <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 text-[13px] font-medium tracking-[0.15em] text-white/60 uppercase hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="rounded-sm border border-white/30 px-3 py-2 text-center text-[13px] font-medium tracking-[0.15em] text-white uppercase hover:border-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

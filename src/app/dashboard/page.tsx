import { redirect } from 'next/navigation'
import {
  Package,
  HandCoins,
  ShoppingCart,
  Star,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatCents, timeAgo } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch stats in parallel
  const [
    { count: listingCount },
    { count: offerCount },
    { count: orderCount },
    { data: profile },
    { data: recentOrders },
  ] = await Promise.all([
    supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', user.id)
      .eq('status', 'active'),
    supabase
      .from('offers')
      .select('*', { count: 'exact', head: true })
      .eq('seller_id', user.id)
      .eq('status', 'pending'),
    supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order('created_at', { ascending: false }),
    supabase
      .from('profiles')
      .select('reputation_score, total_reviews')
      .eq('id', user.id)
      .single(),
    supabase
      .from('orders')
      .select('id, amount_cents, status, created_at, listing:listings!listing_id(title)')
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const stats = [
    {
      label: 'Active Listings',
      value: listingCount ?? 0,
      icon: Package,
    },
    {
      label: 'Pending Offers',
      value: offerCount ?? 0,
      icon: HandCoins,
    },
    {
      label: 'Total Orders',
      value: orderCount ?? 0,
      icon: ShoppingCart,
    },
    {
      label: 'Avg Rating',
      value: profile?.reputation_score?.toFixed(1) ?? '0.0',
      icon: Star,
      sub: `${profile?.total_reviews ?? 0} reviews`,
    },
  ]

  return (
    <div className="min-h-screen bg-[#0f0f14] px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <p className="text-[12px] font-medium uppercase tracking-[0.35em] text-white/30">
          Seller
        </p>
        <h1 className="mt-2 text-3xl font-normal text-white">
          <span className="font-serif italic">Dashboard</span>
        </h1>

        {/* Stats grid */}
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-sm border border-white/[0.08] bg-[#1a1a22] p-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.3em] text-white/30">
                  {stat.label}
                </span>
                <stat.icon className="h-4 w-4 text-white/20" />
              </div>
              <p className="mt-3 text-[clamp(2rem,4vw,3rem)] font-light text-white">
                {stat.value}
              </p>
              {stat.sub && (
                <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-white/30">
                  {stat.sub}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Recent activity */}
        <section className="mt-12">
          <h2 className="text-lg font-normal text-white">
            Recent <span className="font-serif italic">Activity</span>
          </h2>
          <div className="mt-4">
            {recentOrders && recentOrders.length > 0 ? (
              <div className="divide-y divide-white/[0.08] rounded-sm border border-white/[0.08] bg-[#1a1a22]">
                {recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="text-sm font-medium text-white/80">
                        {order.listing?.title ?? 'Unknown listing'}
                      </p>
                      <p className="mt-0.5 text-[11px] uppercase tracking-[0.3em] text-white/30">
                        {order.status} &middot; {timeAgo(order.created_at)}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-white">
                      {formatCents(order.amount_cents)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/50">No recent activity.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

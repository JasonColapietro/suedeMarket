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
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Pending Offers',
      value: offerCount ?? 0,
      icon: HandCoins,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Total Orders',
      value: orderCount ?? 0,
      icon: ShoppingCart,
      color: 'text-green-600 bg-green-50',
    },
    {
      label: 'Avg Rating',
      value: profile?.reputation_score?.toFixed(1) ?? '0.0',
      icon: Star,
      color: 'text-purple-600 bg-purple-50',
      sub: `${profile?.total_reviews ?? 0} reviews`,
    },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Dashboard</h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <div className={`rounded-md p-2 ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
            {stat.sub && (
              <p className="text-xs text-muted-foreground">{stat.sub}</p>
            )}
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Activity</h2>
        {recentOrders && recentOrders.length > 0 ? (
          <div className="divide-y divide-border rounded-lg border border-border bg-card">
            {recentOrders.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {order.listing?.title ?? 'Unknown listing'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.status} · {timeAgo(order.created_at)}
                  </p>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {formatCents(order.amount_cents)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No recent activity.</p>
        )}
      </section>
    </div>
  )
}

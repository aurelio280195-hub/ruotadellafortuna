'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/language-context'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  ArrowLeftRight, 
  CircleDot, 
  Megaphone, 
  ArrowLeft,
  Loader2,
  Search,
  ExternalLink,
  Check,
  X,
  Edit,
  Trash2,
  DollarSign
} from 'lucide-react'

interface Stats {
  totalUsers: number
  pendingDeposits: number
  pendingWithdrawals: number
  totalBalance: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const { t } = useLanguage()
  const router = useRouter()

  useEffect(() => {
    const fetchStats = async () => {
      // Fetch total users
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Fetch pending deposits
      const { count: depositCount } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'deposit')
        .eq('status', 'pending')

      // Fetch pending withdrawals
      const { count: withdrawalCount } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'withdrawal')
        .eq('status', 'pending')

      // Fetch total balance
      const { data: balances } = await supabase
        .from('profiles')
        .select('balance')

      const totalBalance = balances?.reduce((sum, p) => sum + Number(p.balance), 0) || 0

      setStats({
        totalUsers: userCount || 0,
        pendingDeposits: depositCount || 0,
        pendingWithdrawals: withdrawalCount || 0,
        totalBalance,
      })
      setLoading(false)
    }

    fetchStats()
  }, [supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const menuItems = [
    { href: '/admin/users', icon: Users, label: t('users'), count: stats?.totalUsers },
    { href: '/admin/transactions', icon: ArrowLeftRight, label: t('transactions'), count: (stats?.pendingDeposits || 0) + (stats?.pendingWithdrawals || 0) },
    { href: '/admin/wheel', icon: CircleDot, label: t('wheelSettings') },
    { href: '/admin/banner', icon: Megaphone, label: t('bannerSettings') },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="flex items-center justify-between h-14 px-4 max-w-4xl mx-auto">
          <Link href="/dashboard" className="p-2 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-lg font-semibold text-glow-purple">{t('adminDashboard')}</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="px-4 py-6 max-w-4xl mx-auto space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="text-center">
            <Users className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats?.totalUsers}</p>
            <p className="text-xs text-muted-foreground">{t('users')}</p>
          </GlassCard>
          <GlassCard className="text-center">
            <DollarSign className="h-6 w-6 text-neon-gold mx-auto mb-2" />
            <p className="text-2xl font-bold">${stats?.totalBalance.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Total Balance</p>
          </GlassCard>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <GlassCard glow={stats?.pendingDeposits ? 'emerald' : 'none'} className="text-center">
            <p className="text-3xl font-bold text-neon-emerald">{stats?.pendingDeposits}</p>
            <p className="text-sm text-muted-foreground">Pending Deposits</p>
          </GlassCard>
          <GlassCard glow={stats?.pendingWithdrawals ? 'pink' : 'none'} className="text-center">
            <p className="text-3xl font-bold text-neon-pink">{stats?.pendingWithdrawals}</p>
            <p className="text-sm text-muted-foreground">Pending Withdrawals</p>
          </GlassCard>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <GlassCard className="flex items-center justify-between hover:glow-purple transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/20">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className="px-3 py-1 rounded-full bg-secondary text-sm">
                    {item.count}
                  </span>
                )}
              </GlassCard>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/language-context'
import { BottomNav, TopNav } from '@/components/navigation'
import { Banner } from '@/components/banner'
import { GlassCard } from '@/components/ui/glass-card'
import { LanguageSelector } from '@/components/language-selector'
import { Button } from '@/components/ui/button'
import { Wallet, Copy, Check, CircleDot, Clock, ArrowUpRight, ArrowDownLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Profile {
  id: string
  email: string
  display_name: string | null
  referral_code: string
  balance: number
}

interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal'
  amount: number
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

interface SpinHistory {
  created_at: string
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [lastSpin, setLastSpin] = useState<SpinHistory | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const { t } = useLanguage()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profileData) setProfile(profileData)

      // Fetch recent transactions
      const { data: txData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (txData) setTransactions(txData)

      // Fetch last spin
      const { data: spinData } = await supabase
        .from('spin_history')
        .select('created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (spinData) setLastSpin(spinData)

      setLoading(false)
    }

    fetchData()
  }, [supabase])

  const copyReferralCode = async () => {
    if (profile?.referral_code) {
      await navigator.clipboard.writeText(profile.referral_code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const canSpin = () => {
    if (!lastSpin) return true
    const lastSpinDate = new Date(lastSpin.created_at)
    const now = new Date()
    const hoursDiff = (now.getTime() - lastSpinDate.getTime()) / (1000 * 60 * 60)
    return hoursDiff >= 24
  }

  const getTimeUntilSpin = () => {
    if (!lastSpin) return null
    const lastSpinDate = new Date(lastSpin.created_at)
    const nextSpinDate = new Date(lastSpinDate.getTime() + 24 * 60 * 60 * 1000)
    const now = new Date()
    const diffMs = nextSpinDate.getTime() - now.getTime()
    
    if (diffMs <= 0) return null
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    return { hours, minutes }
  }

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(balance)
  }

  const statusColors = {
    pending: 'text-neon-gold bg-neon-gold/10',
    approved: 'text-neon-emerald bg-neon-emerald/10',
    rejected: 'text-destructive bg-destructive/10',
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">{t('loading')}</div>
      </div>
    )
  }

  const timeUntilSpin = getTimeUntilSpin()

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNav rightElement={<LanguageSelector />} />
      
      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        <Banner />

        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-2"
        >
          <p className="text-muted-foreground">{t('welcome')},</p>
          <h2 className="text-xl font-semibold">{profile?.display_name || profile?.email}</h2>
        </motion.div>

        {/* Balance Card */}
        <GlassCard glow="gold" className="text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <Wallet className="h-4 w-4" />
            <span className="text-sm">{t('yourBalance')}</span>
          </div>
          <p className="text-4xl font-bold text-glow-gold">
            ${formatBalance(profile?.balance || 0)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">USDT (TRC20)</p>
        </GlassCard>

        {/* Spin Status */}
        <GlassCard glow={canSpin() ? 'purple' : 'none'}>
          <Link href="/wheel" className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${canSpin() ? 'bg-primary/20' : 'bg-secondary'}`}>
                <CircleDot className={`h-6 w-6 ${canSpin() ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <p className="font-semibold">
                  {canSpin() ? t('spinAvailable') : t('spinCooldown')}
                </p>
                {!canSpin() && timeUntilSpin && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {timeUntilSpin.hours}h {timeUntilSpin.minutes}m
                  </p>
                )}
              </div>
            </div>
            {canSpin() && (
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            )}
          </Link>
        </GlassCard>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/deposit">
            <GlassCard className="text-center py-4 hover:glow-emerald transition-all cursor-pointer">
              <ArrowDownLeft className="h-6 w-6 text-neon-emerald mx-auto mb-2" />
              <p className="font-medium">{t('deposit')}</p>
            </GlassCard>
          </Link>
          <Link href="/withdraw">
            <GlassCard className="text-center py-4 hover:glow-pink transition-all cursor-pointer">
              <ArrowUpRight className="h-6 w-6 text-neon-pink mx-auto mb-2" />
              <p className="font-medium">{t('withdraw')}</p>
            </GlassCard>
          </Link>
        </div>

        {/* Referral Code */}
        <GlassCard>
          <p className="text-sm text-muted-foreground mb-2">{t('yourReferralCode')}</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-secondary/50 px-4 py-3 rounded-xl font-mono text-lg tracking-widest text-center">
              {profile?.referral_code}
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={copyReferralCode}
              className="h-12 w-12 shrink-0"
            >
              {copied ? <Check className="h-5 w-5 text-neon-emerald" /> : <Copy className="h-5 w-5" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">{t('shareReferral')}</p>
        </GlassCard>

        {/* Recent Transactions */}
        <GlassCard>
          <h3 className="font-semibold mb-4">{t('recentTransactions')}</h3>
          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">{t('noTransactions')}</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${tx.type === 'deposit' ? 'bg-neon-emerald/20' : 'bg-neon-pink/20'}`}>
                      {tx.type === 'deposit' ? (
                        <ArrowDownLeft className="h-4 w-4 text-neon-emerald" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-neon-pink" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium capitalize">{t(tx.type as 'deposit' | 'withdraw')}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${tx.type === 'deposit' ? 'text-neon-emerald' : 'text-neon-pink'}`}>
                      {tx.type === 'deposit' ? '+' : '-'}${formatBalance(tx.amount)}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[tx.status]}`}>
                      {t(tx.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </main>

      <BottomNav />
    </div>
  )
}

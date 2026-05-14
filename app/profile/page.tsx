'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/language-context'
import { BottomNav, TopNav } from '@/components/navigation'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { LanguageSelector } from '@/components/language-selector'
import { User, Users, Clock, Wallet, LogOut, ArrowDownLeft, ArrowUpRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface Profile {
  id: string
  email: string
  display_name: string | null
  phone: string | null
  referral_code: string
  balance: number
  created_at: string
}

interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal'
  amount: number
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

interface SpinRecord {
  id: string
  result: string
  percentage: number | null
  amount_won: number
  created_at: string
}

interface Referral {
  id: string
  display_name: string | null
  email: string
  created_at: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [spins, setSpins] = useState<SpinRecord[]>([])
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [activeTab, setActiveTab] = useState<'transactions' | 'spins' | 'referrals'>('transactions')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()
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

      // Fetch all transactions
      const { data: txData } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (txData) setTransactions(txData)

      // Fetch spin history
      const { data: spinData } = await supabase
        .from('spin_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (spinData) setSpins(spinData)

      // Fetch referrals (users who used this user's referral code)
      if (profileData?.referral_code) {
        const { data: referralData } = await supabase
          .from('profiles')
          .select('id, display_name, email, created_at')
          .eq('referred_by', profileData.referral_code)
          .order('created_at', { ascending: false })
        
        if (referralData) setReferrals(referralData)
      }

      setLoading(false)
    }

    fetchData()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
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

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNav 
        title={t('profileTitle')} 
        rightElement={<LanguageSelector />} 
      />
      
      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Profile Card */}
        <GlassCard glow="purple">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold truncate">
                {profile?.display_name || 'User'}
              </h2>
              <p className="text-sm text-muted-foreground truncate">{profile?.email}</p>
              {profile?.phone && (
                <p className="text-sm text-muted-foreground">{profile.phone}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-secondary/50 rounded-xl p-3 text-center">
              <Wallet className="h-4 w-4 text-neon-gold mx-auto mb-1" />
              <p className="text-lg font-bold text-glow-gold">${formatBalance(profile?.balance || 0)}</p>
              <p className="text-xs text-muted-foreground">{t('yourBalance')}</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-3 text-center">
              <Users className="h-4 w-4 text-neon-emerald mx-auto mb-1" />
              <p className="text-lg font-bold">{referrals.length}</p>
              <p className="text-xs text-muted-foreground">{t('totalReferrals')}</p>
            </div>
          </div>
        </GlassCard>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-secondary/30 rounded-xl">
          {(['transactions', 'spins', 'referrals'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'transactions' && t('transactionHistory')}
              {tab === 'spins' && t('spinHistory')}
              {tab === 'referrals' && t('referralStats')}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <GlassCard>
          {activeTab === 'transactions' && (
            <div className="space-y-3">
              {transactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">{t('noTransactions')}</p>
              ) : (
                transactions.map((tx) => (
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
                          {new Date(tx.created_at).toLocaleString()}
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
                ))
              )}
            </div>
          )}

          {activeTab === 'spins' && (
            <div className="space-y-3">
              {spins.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">{t('noTransactions')}</p>
              ) : (
                spins.map((spin) => (
                  <div key={spin.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <Sparkles className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{spin.result}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(spin.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {spin.amount_won > 0 && (
                        <p className="font-semibold text-neon-emerald">
                          +${formatBalance(spin.amount_won)}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'referrals' && (
            <div className="space-y-3">
              {referrals.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">{t('noTransactions')}</p>
              ) : (
                referrals.map((ref) => (
                  <div key={ref.id} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                    <div className="p-2 rounded-lg bg-neon-emerald/20">
                      <User className="h-4 w-4 text-neon-emerald" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{ref.display_name || 'User'}</p>
                      <p className="text-xs text-muted-foreground truncate">{ref.email}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(ref.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </GlassCard>

        {/* Logout Button */}
        <Button
          variant="outline"
          onClick={handleLogout}
          className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t('logout')}
        </Button>
      </main>

      <BottomNav />
    </div>
  )
}

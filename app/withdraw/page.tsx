'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/language-context'
import { BottomNav, TopNav } from '@/components/navigation'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Wallet, Loader2, AlertCircle, Check } from 'lucide-react'
import { motion } from 'framer-motion'

interface Profile {
  id: string
  balance: number
}

export default function WithdrawPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [amount, setAmount] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [minWithdraw, setMinWithdraw] = useState(10)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const supabase = createClient()
  const { t } = useLanguage()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, balance')
        .eq('id', user.id)
        .single()
      
      if (profileData) setProfile(profileData)

      // Fetch min withdrawal
      const { data: settings } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'min_withdrawal')
        .single()
      
      if (settings?.value?.amount) {
        setMinWithdraw(settings.value.amount)
      }
    }

    fetchData()
  }, [supabase])

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(balance)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    
    setLoading(true)
    setError('')
    setSuccess(false)

    const withdrawAmount = parseFloat(amount)

    // Validate amount
    if (withdrawAmount < minWithdraw) {
      setError(`${t('minWithdraw')} $${minWithdraw}`)
      setLoading(false)
      return
    }

    if (withdrawAmount > profile.balance) {
      setError(t('insufficientBalance'))
      setLoading(false)
      return
    }

    // Validate TRC20 address (starts with T and is 34 characters)
    if (!walletAddress.startsWith('T') || walletAddress.length !== 34) {
      setError('Invalid TRC20 address')
      setLoading(false)
      return
    }

    // Insert withdrawal request
    const { error: insertError } = await supabase
      .from('transactions')
      .insert({
        user_id: profile.id,
        type: 'withdrawal',
        amount: withdrawAmount,
        wallet_address: walletAddress,
        status: 'pending',
      })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setAmount('')
    setWalletAddress('')
    setLoading(false)
  }

  const setMaxAmount = () => {
    if (profile) {
      setAmount(profile.balance.toString())
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNav showBack title={t('withdrawTitle')} />
      
      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Balance Card */}
        <GlassCard glow="gold" className="text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <Wallet className="h-4 w-4" />
            <span className="text-sm">{t('yourBalance')}</span>
          </div>
          <p className="text-3xl font-bold text-glow-gold">
            ${formatBalance(profile?.balance || 0)}
          </p>
        </GlassCard>

        {/* Withdraw Form */}
        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="amount">{t('withdrawAmount')} (USDT)</Label>
                <button
                  type="button"
                  onClick={setMaxAmount}
                  className="text-xs text-primary hover:underline"
                >
                  MAX
                </button>
              </div>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min={minWithdraw}
                max={profile?.balance || 0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Min: $${minWithdraw}`}
                required
                className="bg-secondary/50 border-border text-lg"
              />
              <p className="text-xs text-muted-foreground">
                {t('minWithdraw')} ${minWithdraw} USDT
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wallet">{t('walletAddress')}</Label>
              <Input
                id="wallet"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder={t('walletPlaceholder')}
                required
                className="bg-secondary/50 border-border font-mono text-sm"
                maxLength={34}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-sm text-neon-emerald bg-neon-emerald/10 p-3 rounded-lg"
              >
                <Check className="h-4 w-4 shrink-0" />
                {t('withdrawPending')}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={loading || !amount || !walletAddress || (profile?.balance || 0) < minWithdraw}
              className="w-full btn-glow bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                t('withdrawSubmit')
              )}
            </Button>
          </form>
        </GlassCard>
      </main>

      <BottomNav />
    </div>
  )
}

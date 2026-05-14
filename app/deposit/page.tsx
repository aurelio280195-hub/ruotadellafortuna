'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/language-context'
import { BottomNav, TopNav } from '@/components/navigation'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, Check, ExternalLink, Loader2, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const DEPOSIT_ADDRESS = 'TRgfYFuT6seDfEJ2eqA83g6L9qfKTQ4ihA'

export default function DepositPage() {
  const [txid, setTxid] = useState('')
  const [amount, setAmount] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()
  const { t } = useLanguage()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    getUser()
  }, [supabase])

  const copyAddress = async () => {
    await navigator.clipboard.writeText(DEPOSIT_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    
    setLoading(true)
    setError('')
    setSuccess(false)

    // Check if TXID already exists
    const { data: existing } = await supabase
      .from('transactions')
      .select('id')
      .eq('txid', txid.trim())
      .single()

    if (existing) {
      setError(t('hashAlreadyUsed'))
      setLoading(false)
      return
    }

    // Insert deposit request
    const { error: insertError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'deposit',
        amount: parseFloat(amount),
        txid: txid.trim(),
        status: 'pending',
      })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setTxid('')
    setAmount('')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNav showBack title={t('depositTitle')} />
      
      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Deposit Address */}
        <GlassCard glow="emerald">
          <p className="text-sm text-muted-foreground mb-2">{t('depositAddress')}</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-secondary/50 px-3 py-3 rounded-xl font-mono text-xs break-all">
              {DEPOSIT_ADDRESS}
            </code>
            <Button
              variant="outline"
              size="icon"
              onClick={copyAddress}
              className="h-12 w-12 shrink-0"
            >
              {copied ? <Check className="h-5 w-5 text-neon-emerald" /> : <Copy className="h-5 w-5" />}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            {t('depositInstructions')}
          </p>
        </GlassCard>

        {/* Deposit Form */}
        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="txid">{t('transactionHash')}</Label>
              <Input
                id="txid"
                value={txid}
                onChange={(e) => setTxid(e.target.value)}
                placeholder={t('hashPlaceholder')}
                required
                className="bg-secondary/50 border-border font-mono text-sm"
              />
              {txid && (
                <a
                  href={`https://tronscan.org/#/transaction/${txid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  {t('viewOnTronScan')}
                </a>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">{t('amount')} (USDT)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t('amountPlaceholder')}
                required
                className="bg-secondary/50 border-border"
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
                {t('depositPending')}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={loading || !txid || !amount}
              className="w-full btn-glow bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                t('depositSubmit')
              )}
            </Button>
          </form>
        </GlassCard>
      </main>

      <BottomNav />
    </div>
  )
}

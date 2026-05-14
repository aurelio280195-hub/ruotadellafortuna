'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/language-context'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  ArrowLeft,
  Loader2,
  ExternalLink,
  Check,
  X,
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react'

interface Transaction {
  id: string
  user_id: string
  type: 'deposit' | 'withdrawal'
  amount: number
  txid: string | null
  wallet_address: string | null
  status: 'pending' | 'approved' | 'rejected'
  admin_note: string | null
  created_at: string
  profiles: {
    email: string
    display_name: string | null
  }
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'deposit' | 'withdrawal'>('pending')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const supabase = createClient()
  const { t } = useLanguage()

  const fetchTransactions = async () => {
    let query = supabase
      .from('transactions')
      .select(`
        *,
        profiles:user_id (email, display_name)
      `)
      .order('created_at', { ascending: false })

    if (filter === 'pending') {
      query = query.eq('status', 'pending')
    } else if (filter === 'deposit') {
      query = query.eq('type', 'deposit')
    } else if (filter === 'withdrawal') {
      query = query.eq('type', 'withdrawal')
    }

    const { data } = await query.limit(100)
    
    if (data) {
      setTransactions(data as unknown as Transaction[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchTransactions()
  }, [filter])

  const handleApprove = async (tx: Transaction) => {
    setProcessing(tx.id)

    // Update transaction status
    const { error: txError } = await supabase
      .from('transactions')
      .update({ status: 'approved' })
      .eq('id', tx.id)

    if (txError) {
      setProcessing(null)
      return
    }

    // If deposit, add to user's balance
    if (tx.type === 'deposit') {
      const { data: profile } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', tx.user_id)
        .single()

      if (profile) {
        await supabase
          .from('profiles')
          .update({ balance: Number(profile.balance) + tx.amount })
          .eq('id', tx.user_id)
      }
    }

    // If withdrawal, deduct from user's balance
    if (tx.type === 'withdrawal') {
      const { data: profile } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', tx.user_id)
        .single()

      if (profile) {
        await supabase
          .from('profiles')
          .update({ balance: Math.max(0, Number(profile.balance) - tx.amount) })
          .eq('id', tx.user_id)
      }
    }

    setTransactions(transactions.map(t => 
      t.id === tx.id ? { ...t, status: 'approved' } : t
    ))
    setProcessing(null)
  }

  const handleReject = async (tx: Transaction) => {
    setProcessing(tx.id)

    const { error } = await supabase
      .from('transactions')
      .update({ status: 'rejected' })
      .eq('id', tx.id)

    if (!error) {
      setTransactions(transactions.map(t => 
        t.id === tx.id ? { ...t, status: 'rejected' } : t
      ))
    }
    setProcessing(null)
  }

  const statusColors = {
    pending: 'text-neon-gold bg-neon-gold/10 border-neon-gold/30',
    approved: 'text-neon-emerald bg-neon-emerald/10 border-neon-emerald/30',
    rejected: 'text-destructive bg-destructive/10 border-destructive/30',
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="flex items-center justify-between h-14 px-4 max-w-4xl mx-auto">
          <Link href="/admin" className="p-2 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-lg font-semibold">{t('transactions')}</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="px-4 py-6 max-w-4xl mx-auto space-y-4">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(['pending', 'all', 'deposit', 'withdrawal'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
              className={filter === f ? 'bg-primary' : ''}
            >
              {f === 'pending' && 'Pending'}
              {f === 'all' && 'All'}
              {f === 'deposit' && 'Deposits'}
              {f === 'withdrawal' && 'Withdrawals'}
            </Button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          {transactions.map((tx) => (
            <GlassCard key={tx.id}>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${tx.type === 'deposit' ? 'bg-neon-emerald/20' : 'bg-neon-pink/20'}`}>
                      {tx.type === 'deposit' ? (
                        <ArrowDownLeft className="h-5 w-5 text-neon-emerald" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-neon-pink" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium capitalize">{tx.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {tx.profiles?.display_name || tx.profiles?.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${tx.type === 'deposit' ? 'text-neon-emerald' : 'text-neon-pink'}`}>
                      ${tx.amount.toFixed(2)}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[tx.status]}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>

                {/* TXID for deposits */}
                {tx.txid && (
                  <div className="bg-secondary/30 p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Transaction Hash:</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono truncate flex-1">{tx.txid}</code>
                      <a
                        href={`https://tronscan.org/#/transaction/${tx.txid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-primary hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Wallet address for withdrawals */}
                {tx.wallet_address && (
                  <div className="bg-secondary/30 p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Wallet Address:</p>
                    <code className="text-xs font-mono break-all">{tx.wallet_address}</code>
                  </div>
                )}

                {/* Actions for pending */}
                {tx.status === 'pending' && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleApprove(tx)}
                      disabled={processing === tx.id}
                      className="flex-1 bg-neon-emerald hover:bg-neon-emerald/80 text-white"
                    >
                      {processing === tx.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          {t('approve')}
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleReject(tx)}
                      disabled={processing === tx.id}
                      variant="outline"
                      className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                    >
                      <X className="h-4 w-4 mr-2" />
                      {t('reject')}
                    </Button>
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  {new Date(tx.created_at).toLocaleString()}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>

        {transactions.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Nessuna transazione trovata</p>
        )}
      </main>
    </div>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/language-context'
import { BottomNav, TopNav } from '@/components/navigation'
import { GlassCard } from '@/components/ui/glass-card'
import { FortuneWheel, CoinRain, WinModal } from '@/components/fortune-wheel'
import { Button } from '@/components/ui/button'
import { Loader2, Clock, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface WheelSegment {
  id: string
  segment_name: string
  segment_value: number | null
  probability: number
  color: string
  display_order: number
}

interface Profile {
  id: string
  balance: number
}

export default function WheelPage() {
  const [segments, setSegments] = useState<WheelSegment[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [canSpin, setCanSpin] = useState(false)
  const [timeUntilSpin, setTimeUntilSpin] = useState<{ hours: number; minutes: number } | null>(null)
  const [showCoinRain, setShowCoinRain] = useState(false)
  const [showWinModal, setShowWinModal] = useState(false)
  const [winResult, setWinResult] = useState({ result: '', amount: 0 })
  const [loading, setLoading] = useState(true)
  const [extraSpin, setExtraSpin] = useState(false)
  const supabase = createClient()
  const { t } = useLanguage()

  const checkSpinAvailability = useCallback(async (userId: string) => {
    const { data: lastSpin } = await supabase
      .from('spin_history')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!lastSpin) {
      setCanSpin(true)
      setTimeUntilSpin(null)
      return
    }

    const lastSpinDate = new Date(lastSpin.created_at)
    const now = new Date()
    const hoursDiff = (now.getTime() - lastSpinDate.getTime()) / (1000 * 60 * 60)

    if (hoursDiff >= 24) {
      setCanSpin(true)
      setTimeUntilSpin(null)
    } else {
      setCanSpin(false)
      const nextSpinDate = new Date(lastSpinDate.getTime() + 24 * 60 * 60 * 1000)
      const diffMs = nextSpinDate.getTime() - now.getTime()
      const hours = Math.floor(diffMs / (1000 * 60 * 60))
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
      setTimeUntilSpin({ hours, minutes })
    }
  }, [supabase])

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

      // Fetch wheel config
      const { data: configData } = await supabase
        .from('wheel_config')
        .select('*')
        .eq('is_active', true)
        .order('display_order')
      
      if (configData) setSegments(configData)

      // Check spin availability
      await checkSpinAvailability(user.id)

      setLoading(false)
    }

    fetchData()
  }, [supabase, checkSpinAvailability])

  // Countdown timer
  useEffect(() => {
    if (!timeUntilSpin || canSpin) return

    const interval = setInterval(() => {
      setTimeUntilSpin(prev => {
        if (!prev) return null
        
        let { hours, minutes } = prev
        minutes -= 1
        
        if (minutes < 0) {
          hours -= 1
          minutes = 59
        }
        
        if (hours < 0) {
          setCanSpin(true)
          return null
        }
        
        return { hours, minutes }
      })
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [timeUntilSpin, canSpin])

  const handleSpin = () => {
    if ((!canSpin && !extraSpin) || isSpinning) return
    ;(window as any).spinWheel?.()
  }

  const handleSpinEnd = async (segment: WheelSegment) => {
    if (!profile) return

    const balanceBefore = profile.balance
    let amountWon = 0
    let newBalance = balanceBefore

    // Calculate winnings
    if (segment.segment_value !== null) {
      amountWon = (balanceBefore * segment.segment_value) / 100
      newBalance = balanceBefore + amountWon
    }

    // Record spin in database
    const { error: spinError } = await supabase
      .from('spin_history')
      .insert({
        user_id: profile.id,
        result: segment.segment_name,
        percentage: segment.segment_value,
        amount_won: amountWon,
        balance_before: balanceBefore,
        balance_after: newBalance,
      })

    if (spinError) {
      console.error('Error recording spin:', spinError)
      return
    }

    // Update balance if won
    if (amountWon > 0) {
      await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', profile.id)

      setProfile({ ...profile, balance: newBalance })
      setShowCoinRain(true)
    }

    // Handle special results
    if (segment.segment_name.toLowerCase().includes('doppio')) {
      setExtraSpin(true)
      setWinResult({ result: t('doubleSpinWon'), amount: 0 })
    } else if (segment.segment_name.toLowerCase().includes('ritenta')) {
      setWinResult({ result: t('tryAgainTomorrow'), amount: 0 })
    } else {
      setWinResult({ result: segment.segment_name, amount: amountWon })
      if (!extraSpin) {
        setCanSpin(false)
        await checkSpinAvailability(profile.id)
      }
    }

    // If used extra spin, clear it
    if (extraSpin && !segment.segment_name.toLowerCase().includes('doppio')) {
      setExtraSpin(false)
    }

    setShowWinModal(true)
  }

  const handleCoinRainComplete = () => {
    setShowCoinRain(false)
  }

  const handleCloseModal = () => {
    setShowWinModal(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNav showBack title={t('wheelTitle')} />
      
      <main className="px-4 py-4 max-w-lg mx-auto space-y-6">
        {/* Balance Display */}
        <GlassCard className="text-center">
          <p className="text-sm text-muted-foreground">{t('yourBalance')}</p>
          <p className="text-2xl font-bold text-glow-gold">
            ${profile?.balance.toFixed(6) || '0.00'}
          </p>
        </GlassCard>

        {/* Fortune Wheel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <FortuneWheel
            segments={segments}
            onSpinEnd={handleSpinEnd}
            isSpinning={isSpinning}
            setIsSpinning={setIsSpinning}
          />
        </motion.div>

        {/* Spin Button */}
        <div className="text-center space-y-3">
          {extraSpin && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-neon-emerald font-semibold flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {t('doubleSpinWon')}
            </motion.p>
          )}

          <Button
            onClick={handleSpin}
            disabled={(!canSpin && !extraSpin) || isSpinning}
            className="w-full py-8 text-2xl font-bold btn-glow bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSpinning ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                {t('spinning')}
              </span>
            ) : canSpin || extraSpin ? (
              t('spinButton')
            ) : (
              <span className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {timeUntilSpin && `${timeUntilSpin.hours}h ${timeUntilSpin.minutes}m`}
              </span>
            )}
          </Button>

          {!canSpin && !extraSpin && (
            <p className="text-sm text-muted-foreground">
              {t('spinCooldown')}: {timeUntilSpin?.hours}h {timeUntilSpin?.minutes}m
            </p>
          )}
        </div>

        {/* Info Card */}
        <GlassCard className="text-sm text-muted-foreground">
          <h3 className="font-semibold text-foreground mb-2">Come funziona:</h3>
          <ul className="space-y-1 list-disc list-inside">
            <li>1 giro disponibile ogni 24 ore</li>
            <li>La percentuale viene calcolata sul tuo saldo attuale</li>
            <li>&quot;Doppio giro&quot; ti regala un giro extra immediato</li>
            <li>Le vincite vengono aggiunte istantaneamente al saldo</li>
          </ul>
        </GlassCard>
      </main>

      <BottomNav />

      {/* Coin Rain Effect */}
      <CoinRain show={showCoinRain} onComplete={handleCoinRainComplete} />

      {/* Win Modal */}
      <WinModal
        show={showWinModal}
        result={winResult.result}
        amount={winResult.amount}
        onClose={handleCloseModal}
      />
    </div>
  )
}

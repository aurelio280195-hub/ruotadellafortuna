'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Mail, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SignUpSuccessPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <GlassCard className="w-full max-w-sm text-center" glow="emerald">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neon-emerald/20 mb-6 glow-emerald"
        >
          <CheckCircle className="w-10 h-10 text-neon-emerald" />
        </motion.div>

        <h1 className="text-2xl font-bold mb-4">{t('success')}!</h1>
        
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
          <Mail className="h-5 w-5" />
          <p>{t('checkEmail')}</p>
        </div>

        <Link href="/auth/login">
          <Button className="w-full btn-glow bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6">
            {t('login')}
          </Button>
        </Link>
      </GlassCard>
    </div>
  )
}

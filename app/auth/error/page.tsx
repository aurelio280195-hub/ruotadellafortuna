'use client'

import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function AuthErrorPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <GlassCard className="w-full max-w-sm text-center" glow="pink">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/20 mb-6 glow-pink">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>

        <h1 className="text-2xl font-bold mb-4">{t('error')}</h1>
        
        <p className="text-muted-foreground mb-6">
          Si è verificato un errore durante l&apos;autenticazione. Riprova.
        </p>

        <Link href="/auth/login">
          <Button className="w-full btn-glow bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6">
            {t('login')}
          </Button>
        </Link>
      </GlassCard>
    </div>
  )
}

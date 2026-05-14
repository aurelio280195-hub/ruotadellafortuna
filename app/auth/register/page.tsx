'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/language-context'
import { Language } from '@/lib/translations'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LanguageSelect } from '@/components/language-selector'
import { Loader2, Mail, Lock, Phone, User, Gift, CircleDot } from 'lucide-react'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    displayName: '',
    referralCode: '',
    language: 'it' as Language,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()
  const { t, setLanguage } = useLanguage()

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const validateReferralCode = async (code: string): Promise<boolean> => {
    const { data } = await supabase
      .from('profiles')
      .select('referral_code')
      .eq('referral_code', code.toUpperCase())
      .single()
    return !!data
  }

  const handleNextStep = async () => {
    if (step === 1) {
      // Validate step 1
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError('Compila tutti i campi')
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Le password non coincidono')
        return
      }
      if (formData.password.length < 6) {
        setError('La password deve avere almeno 6 caratteri')
        return
      }
      setStep(2)
    } else if (step === 2) {
      // Validate step 2
      if (!formData.phone || !formData.displayName) {
        setError('Compila tutti i campi')
        return
      }
      setStep(3)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate referral code
    if (!formData.referralCode) {
      setError(t('referralCodeRequired'))
      setLoading(false)
      return
    }

    const isValidReferral = await validateReferralCode(formData.referralCode)
    if (!isValidReferral) {
      setError(t('invalidReferralCode'))
      setLoading(false)
      return
    }

    // Register user
    const { error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? 
          `${window.location.origin}/auth/callback`,
        data: {
          phone: formData.phone,
          display_name: formData.displayName,
          referred_by: formData.referralCode.toUpperCase(),
          language: formData.language,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Set language context
    setLanguage(formData.language)

    // Redirect to success page
    router.push('/auth/sign-up-success')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-3 glow-purple">
            <CircleDot className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-glow-purple">{t('appName')}</h1>
        </motion.div>

        <GlassCard className="w-full max-w-sm" glow="purple">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">{t('register')}</h2>
            <div className="flex gap-1">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-8 h-1 rounded-full transition-colors ${
                    s <= step ? 'bg-primary' : 'bg-border'
                  }`}
                />
              ))}
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">{t('email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="email@example.com"
                      required
                      className="pl-10 bg-secondary/50 border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t('password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder="••••••••"
                      required
                      className="pl-10 bg-secondary/50 border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      placeholder="••••••••"
                      required
                      className="pl-10 bg-secondary/50 border-border"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="displayName">{t('displayName')}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="displayName"
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => handleChange('displayName', e.target.value)}
                      placeholder="Mario Rossi"
                      required
                      className="pl-10 bg-secondary/50 border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t('phone')}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="+39 123 456 7890"
                      required
                      className="pl-10 bg-secondary/50 border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referralCode">{t('referralCode')} *</Label>
                  <div className="relative">
                    <Gift className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="referralCode"
                      type="text"
                      value={formData.referralCode}
                      onChange={(e) => handleChange('referralCode', e.target.value.toUpperCase())}
                      placeholder="ABCD1234"
                      required
                      className="pl-10 bg-secondary/50 border-border uppercase"
                      maxLength={8}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label>{t('selectLanguage')}</Label>
                  <LanguageSelect
                    value={formData.language}
                    onChange={(lang) => handleChange('language', lang)}
                  />
                </div>
              </motion.div>
            )}

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                >
                  {t('back')}
                </Button>
              )}
              
              {step < 3 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 btn-glow bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
                >
                  {t('confirm')}
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-glow bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    t('register')
                  )}
                </Button>
              )}
            </div>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t('alreadyHaveAccount')}{' '}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              {t('login')}
            </Link>
          </p>
        </GlassCard>
      </main>
    </div>
  )
}

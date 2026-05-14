'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/language-context'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import Link from 'next/link'
import { 
  ArrowLeft,
  Loader2,
  Save,
  Info,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

interface BannerSettings {
  enabled: boolean
  title: string
  message: string
  type: 'info' | 'warning' | 'success'
}

export default function AdminBannerPage() {
  const [settings, setSettings] = useState<BannerSettings>({
    enabled: true,
    title: '',
    message: '',
    type: 'info',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const { t } = useLanguage()

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'banner')
        .single()
      
      if (data?.value) {
        setSettings(data.value as BannerSettings)
      }
      setLoading(false)
    }

    fetchSettings()
  }, [supabase])

  const handleSave = async () => {
    setSaving(true)

    await supabase
      .from('app_settings')
      .update({ value: settings })
      .eq('key', 'banner')

    setSaving(false)
    alert('Banner salvato!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const typeIcons = {
    info: <Info className="h-5 w-5 text-neon-blue" />,
    warning: <AlertTriangle className="h-5 w-5 text-neon-gold" />,
    success: <CheckCircle className="h-5 w-5 text-neon-emerald" />,
  }

  const typeColors = {
    info: 'border-neon-blue/30 bg-neon-blue/10',
    warning: 'border-neon-gold/30 bg-neon-gold/10',
    success: 'border-neon-emerald/30 bg-neon-emerald/10',
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="flex items-center justify-between h-14 px-4 max-w-4xl mx-auto">
          <Link href="/admin" className="p-2 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-lg font-semibold">{t('bannerSettings')}</h1>
          <Button
            onClick={handleSave}
            disabled={saving}
            size="sm"
            className="bg-primary"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      <main className="px-4 py-6 max-w-4xl mx-auto space-y-4">
        {/* Preview */}
        {settings.enabled && (
          <div className={`p-4 rounded-xl border ${typeColors[settings.type]}`}>
            <div className="flex items-start gap-3">
              {typeIcons[settings.type]}
              <div className="flex-1">
                <h3 className="font-semibold">{settings.title || 'Titolo'}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {settings.message || 'Messaggio del banner...'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Form */}
        <GlassCard className="space-y-6">
          {/* Enabled Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="enabled" className="text-base font-medium">
              {t('bannerEnabled')}
            </Label>
            <Switch
              id="enabled"
              checked={settings.enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
            />
          </div>

          {/* Type Selection */}
          <div className="space-y-2">
            <Label>Tipo</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['info', 'warning', 'success'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSettings({ ...settings, type })}
                  className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1 ${
                    settings.type === type 
                      ? typeColors[type] + ' border-2' 
                      : 'border-border bg-secondary/30'
                  }`}
                >
                  {typeIcons[type]}
                  <span className="text-xs capitalize">{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">{t('bannerTitle')}</Label>
            <Input
              id="title"
              value={settings.title}
              onChange={(e) => setSettings({ ...settings, title: e.target.value })}
              placeholder="Es: Benvenuto!"
              className="bg-secondary/50"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">{t('bannerMessage')}</Label>
            <Textarea
              id="message"
              value={settings.message}
              onChange={(e) => setSettings({ ...settings, message: e.target.value })}
              placeholder="Es: Gira la ruota ogni giorno per vincere premi!"
              className="bg-secondary/50 min-h-[100px]"
            />
          </div>
        </GlassCard>
      </main>
    </div>
  )
}

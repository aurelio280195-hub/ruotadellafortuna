'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/language-context'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { 
  ArrowLeft,
  Loader2,
  Save,
  Palette
} from 'lucide-react'

interface WheelSegment {
  id: string
  segment_name: string
  segment_value: number | null
  probability: number
  color: string
  display_order: number
  is_active: boolean
}

export default function AdminWheelPage() {
  const [segments, setSegments] = useState<WheelSegment[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  const { t } = useLanguage()

  useEffect(() => {
    const fetchSegments = async () => {
      const { data } = await supabase
        .from('wheel_config')
        .select('*')
        .order('display_order')
      
      if (data) {
        setSegments(data)
      }
      setLoading(false)
    }

    fetchSegments()
  }, [supabase])

  const handleChange = (id: string, field: keyof WheelSegment, value: string | number | boolean) => {
    setSegments(segments.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ))
  }

  const handleSave = async () => {
    setSaving(true)

    // Validate total probability doesn't exceed 100
    const totalProb = segments.reduce((sum, s) => sum + s.probability, 0)
    if (totalProb !== 100) {
      alert(`La somma delle probabilità deve essere 100% (attualmente: ${totalProb}%)`)
      setSaving(false)
      return
    }

    for (const segment of segments) {
      await supabase
        .from('wheel_config')
        .update({
          segment_name: segment.segment_name,
          segment_value: segment.segment_value,
          probability: segment.probability,
          color: segment.color,
          is_active: segment.is_active,
        })
        .eq('id', segment.id)
    }

    setSaving(false)
    alert('Configurazione salvata!')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const totalProbability = segments.reduce((sum, s) => sum + s.probability, 0)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="flex items-center justify-between h-14 px-4 max-w-4xl mx-auto">
          <Link href="/admin" className="p-2 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-lg font-semibold">{t('wheelSettings')}</h1>
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
        {/* Probability Total */}
        <GlassCard className={totalProbability === 100 ? 'border-neon-emerald/30' : 'border-destructive/30'}>
          <div className="flex items-center justify-between">
            <span className="text-sm">Probabilità Totale:</span>
            <span className={`font-bold ${totalProbability === 100 ? 'text-neon-emerald' : 'text-destructive'}`}>
              {totalProbability}%
            </span>
          </div>
        </GlassCard>

        {/* Segments */}
        <div className="space-y-3">
          {segments.map((segment) => (
            <GlassCard key={segment.id}>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-8 h-8 rounded-lg shrink-0"
                  style={{ backgroundColor: segment.color }}
                />
                <Input
                  value={segment.segment_name}
                  onChange={(e) => handleChange(segment.id, 'segment_name', e.target.value)}
                  className="font-semibold bg-secondary/50"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs">Valore (%)</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={segment.segment_value ?? ''}
                    onChange={(e) => handleChange(segment.id, 'segment_value', e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="null"
                    className="bg-secondary/50"
                  />
                </div>
                <div>
                  <Label className="text-xs">{t('probability')} (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={segment.probability}
                    onChange={(e) => handleChange(segment.id, 'probability', parseInt(e.target.value) || 0)}
                    className="bg-secondary/50"
                  />
                </div>
                <div>
                  <Label className="text-xs">Colore</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={segment.color}
                      onChange={(e) => handleChange(segment.id, 'color', e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={segment.color}
                      onChange={(e) => handleChange(segment.id, 'color', e.target.value)}
                      className="flex-1 bg-secondary/50 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <input
                  type="checkbox"
                  id={`active-${segment.id}`}
                  checked={segment.is_active}
                  onChange={(e) => handleChange(segment.id, 'is_active', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor={`active-${segment.id}`} className="text-sm cursor-pointer">
                  Attivo
                </Label>
              </div>
            </GlassCard>
          ))}
        </div>
      </main>
    </div>
  )
}

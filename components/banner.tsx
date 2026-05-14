'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Info, AlertTriangle, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BannerData {
  enabled: boolean
  title: string
  message: string
  type: 'info' | 'warning' | 'success'
}

export function Banner() {
  const [banner, setBanner] = useState<BannerData | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchBanner = async () => {
      const { data } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'banner')
        .single()
      
      if (data?.value) {
        setBanner(data.value as BannerData)
      }
    }
    
    fetchBanner()
  }, [supabase])

  if (!banner?.enabled || dismissed) return null

  const icons = {
    info: <Info className="h-5 w-5 text-neon-blue" />,
    warning: <AlertTriangle className="h-5 w-5 text-neon-gold" />,
    success: <CheckCircle className="h-5 w-5 text-neon-emerald" />,
  }

  const bgColors = {
    info: 'border-neon-blue/30 bg-neon-blue/10',
    warning: 'border-neon-gold/30 bg-neon-gold/10',
    success: 'border-neon-emerald/30 bg-neon-emerald/10',
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={cn(
          'mx-4 mt-4 p-4 rounded-xl border',
          bgColors[banner.type]
        )}
      >
        <div className="flex items-start gap-3">
          {icons[banner.type]}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground">{banner.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{banner.message}</p>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

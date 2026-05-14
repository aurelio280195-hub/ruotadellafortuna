'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface GlassCardProps {
  children: ReactNode
  className?: string
  glow?: 'purple' | 'gold' | 'emerald' | 'pink' | 'none'
  animate?: boolean
}

export function GlassCard({ children, className, glow = 'none', animate = true }: GlassCardProps) {
  const glowClasses = {
    purple: 'glow-purple',
    gold: 'glow-gold',
    emerald: 'glow-emerald',
    pink: 'glow-pink',
    none: '',
  }

  const Wrapper = animate ? motion.div : 'div'
  const animationProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' }
  } : {}

  return (
    <Wrapper
      className={cn(
        'glass rounded-2xl p-6',
        glowClasses[glow],
        className
      )}
      {...animationProps}
    >
      {children}
    </Wrapper>
  )
}

'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface WheelSegment {
  id: string
  segment_name: string
  segment_value: number | null
  probability: number
  color: string
  display_order: number
}

interface FortuneWheelProps {
  segments: WheelSegment[]
  onSpinEnd: (segment: WheelSegment) => void
  isSpinning: boolean
  setIsSpinning: (spinning: boolean) => void
}

export function FortuneWheel({ segments, onSpinEnd, isSpinning, setIsSpinning }: FortuneWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState(0)
  const [targetRotation, setTargetRotation] = useState(0)
  const animationRef = useRef<number>()

  // Sort segments by display_order
  const sortedSegments = [...segments].sort((a, b) => a.display_order - b.display_order)
  const segmentAngle = (2 * Math.PI) / sortedSegments.length

  const drawWheel = useCallback((currentRotation: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw segments
    sortedSegments.forEach((segment, index) => {
      const startAngle = index * segmentAngle + currentRotation
      const endAngle = startAngle + segmentAngle

      // Draw segment
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = segment.color
      ctx.fill()

      // Draw border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw text
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(startAngle + segmentAngle / 2)
      ctx.textAlign = 'right'
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 14px Geist, sans-serif'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
      ctx.shadowBlur = 4
      ctx.fillText(segment.segment_name, radius - 20, 5)
      ctx.restore()
    })

    // Draw center circle
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 40)
    gradient.addColorStop(0, '#a855f7')
    gradient.addColorStop(1, '#7c3aed')
    ctx.beginPath()
    ctx.arc(centerX, centerY, 40, 0, 2 * Math.PI)
    ctx.fillStyle = gradient
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw outer glow ring
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius + 5, 0, 2 * Math.PI)
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)'
    ctx.lineWidth = 4
    ctx.stroke()
  }, [sortedSegments, segmentAngle])

  useEffect(() => {
    drawWheel(rotation)
  }, [rotation, drawWheel])

  const spin = useCallback(() => {
    if (isSpinning || sortedSegments.length === 0) return

    setIsSpinning(true)

    // Select winner based on probability
    const totalProbability = sortedSegments.reduce((sum, s) => sum + s.probability, 0)
    let random = Math.random() * totalProbability
    let winnerIndex = 0

    for (let i = 0; i < sortedSegments.length; i++) {
      random -= sortedSegments[i].probability
      if (random <= 0) {
        winnerIndex = i
        break
      }
    }

    // Calculate rotation to land on winner
    const baseSpins = 5 + Math.random() * 3 // 5-8 full rotations
    const winnerAngle = winnerIndex * segmentAngle + segmentAngle / 2
    // Pointer is at top (270 degrees or -PI/2), so we need to rotate to align winner with top
    const targetRot = baseSpins * 2 * Math.PI - winnerAngle - Math.PI / 2

    setTargetRotation(rotation + targetRot)

    // Animate
    const startRotation = rotation
    const totalRotation = targetRot
    const duration = 5000 // 5 seconds
    const startTime = Date.now()

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutCubic(progress)
      const currentRotation = startRotation + totalRotation * easedProgress

      setRotation(currentRotation)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setIsSpinning(false)
        onSpinEnd(sortedSegments[winnerIndex])
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [isSpinning, sortedSegments, segmentAngle, rotation, setIsSpinning, onSpinEnd])

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Expose spin function
  useEffect(() => {
    (window as any).spinWheel = spin
  }, [spin])

  return (
    <div className="relative">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
        <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-primary drop-shadow-lg" />
      </div>

      {/* Wheel */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={320}
          height={320}
          className="max-w-full"
        />
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full pointer-events-none glow-purple opacity-50" />
      </div>
    </div>
  )
}

// Coin Rain Animation Component
export function CoinRain({ show, onComplete }: { show: boolean; onComplete: () => void }) {
  const [coins, setCoins] = useState<{ id: number; x: number; delay: number }[]>([])

  useEffect(() => {
    if (show) {
      const newCoins = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 1,
      }))
      setCoins(newCoins)

      const timer = setTimeout(() => {
        onComplete()
      }, 4000)

      return () => clearTimeout(timer)
    } else {
      setCoins([])
    }
  }, [show, onComplete])

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {coins.map((coin) => (
            <motion.div
              key={coin.id}
              initial={{ y: -50, x: `${coin.x}vw`, rotate: 0, opacity: 1 }}
              animate={{ 
                y: '110vh', 
                rotate: 720,
                opacity: [1, 1, 0]
              }}
              transition={{ 
                duration: 3,
                delay: coin.delay,
                ease: 'easeIn'
              }}
              className="absolute text-4xl"
              style={{ left: `${coin.x}%` }}
            >
              <svg viewBox="0 0 24 24" width="32" height="32" className="drop-shadow-lg">
                <circle cx="12" cy="12" r="10" fill="#F59E0B" />
                <circle cx="12" cy="12" r="8" fill="#FBBF24" />
                <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#92400E">$</text>
              </svg>
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}

// Win Modal Component
interface WinModalProps {
  show: boolean
  result: string
  amount: number
  onClose: () => void
}

export function WinModal({ show, result, amount, onClose }: WinModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="glass p-8 rounded-3xl text-center max-w-sm w-full glow-gold"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="text-6xl mb-4"
            >
              <svg viewBox="0 0 24 24" width="64" height="64" className="mx-auto">
                <circle cx="12" cy="12" r="10" fill="#F59E0B" />
                <circle cx="12" cy="12" r="8" fill="#FBBF24" />
                <text x="12" y="16" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#92400E">$</text>
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold text-glow-gold mb-2">
              Congratulazioni!
            </h2>
            <p className="text-muted-foreground mb-4">
              Hai vinto {result}
            </p>
            {amount > 0 && (
              <p className="text-4xl font-bold text-neon-emerald mb-6">
                +${amount.toFixed(6)}
              </p>
            )}
            <button
              onClick={onClose}
              className="w-full py-3 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl btn-glow"
            >
              Continua
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

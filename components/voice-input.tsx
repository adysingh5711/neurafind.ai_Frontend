"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Mic } from "lucide-react"
import { useEffect, useRef } from "react"

interface VoiceInputProps {
  isActive: boolean
  onEnd: (text: string) => void
  onClick: () => void
}

export default function VoiceInput({ isActive, onEnd, onClick }: VoiceInputProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!canvasRef.current || !isActive) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!
    const centerY = canvas.height / 2
    const lineSpacing = 12
    const numLines = 5
    const totalWidth = (numLines - 1) * lineSpacing
    const startX = (canvas.width - totalWidth) / 2

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < numLines; i++) {
        const x = startX + (i * lineSpacing)
        const time = Date.now() / 1000
        const frequency = 2 + (i * 0.5)
        const amplitude = 8
        const offset = Math.sin(time * frequency) * amplitude

        ctx.beginPath()
        ctx.moveTo(x, centerY - offset)
        ctx.lineTo(x, centerY + offset)
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 2.5
        ctx.lineCap = 'round'
        ctx.stroke()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive])

  return (
    <motion.div
      initial={{ width: 40 }}
      animate={{ width: isActive ? 200 : 40 }}
      transition={{ duration: 0.3 }}
      className="relative h-10"
    >
      <motion.button
        onClick={onClick}
        className={`flex items-center justify-center w-full h-full bg-purple-600 hover:bg-purple-700 
          transition-colors rounded-full`}
        whileTap={{ scale: 0.95 }}
      >
        {isActive ? (
          <canvas
            ref={canvasRef}
            width={200}
            height={40}
            className="w-full h-full rounded-full"
          />
        ) : (
          <Mic className="w-5 h-5 text-white" />
        )}
      </motion.button>
    </motion.div>
  )
}

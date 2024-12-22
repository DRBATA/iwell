import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SparklingParticleLogoAnimationProps {
  onAnimationComplete?: () => void
}

const SparklingParticleLogoAnimation: React.FC<SparklingParticleLogoAnimationProps> = ({ 
  onAnimationComplete 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showLogo, setShowLogo] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: {
      x: number
      y: number
      radius: number
      color: string
      vx: number
      vy: number
      life: number
      maxLife: number
    }[] = []

    const createParticle = (x: number, y: number) => {
      const colors = ['#00CED1', '#40E0D0', '#FFD700']
      particles.push({
        x,
        y,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        life: 0,
        maxLife: 100 + Math.random() * 50
      })
    }

    // Create initial burst of particles
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    for (let i = 0; i < 100; i++) {
      createParticle(
        centerX + (Math.random() - 0.5) * 100,
        centerY + (Math.random() - 0.5) * 100
      )
    }

    let animationFrame: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++

        if (p.life >= p.maxLife) {
          particles.splice(i, 1)
          continue
        }

        const progress = p.life / p.maxLife
        const fadeInOut = progress < 0.5 
          ? progress * 2 
          : (1 - progress) * 2

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color + Math.floor(fadeInOut * 255).toString(16).padStart(2, '0')
        ctx.fill()

        p.x += p.vx
        p.y += p.vy

        // Add slight attraction to center
        const dx = centerX - p.x
        const dy = centerY - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        p.vx += dx / dist * 0.1
        p.vy += dy / dist * 0.1
      }

      if (particles.length > 0) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        // When particles are done, show the logo
        setShowLogo(true)
      }
    }

    animate()

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [])

  // When logo animation is done, call onAnimationComplete
  useEffect(() => {
    if (showLogo) {
      const timer = setTimeout(() => {
        if (onAnimationComplete) {
          onAnimationComplete()
        }
      }, 2000) // Adjust timing as needed

      return () => clearTimeout(timer)
    }
  }, [showLogo, onAnimationComplete])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#00CED1] via-[#40E0D0] to-[#FFD700]">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <AnimatePresence>
        {showLogo && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="relative z-10"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: 1, ease: "linear" }}
              >
                <div className="w-32 h-32 rounded-full bg-[#00CED1] flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-[#FFD700] flex items-center justify-center">
                    <div className="text-white text-6xl font-bold">+</div>
                  </div>
                </div>
              </motion.div>
              <div className="absolute top-full mt-4 text-center w-full">
                <span className="text-[#00CED1] font-bold text-4xl">Easy</span>
                <span className="text-[#FFD700] font-bold text-4xl">GP</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SparklingParticleLogoAnimation

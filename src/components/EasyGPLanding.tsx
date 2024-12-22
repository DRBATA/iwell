import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Alert, AlertDescription } from "./ui/alert"
import { Lock } from 'lucide-react'
import PaymentModal from './PaymentModal'
import AppSuite from './AppSuite'

const EasyGPLanding = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTimer, setLockTimer] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const savedAuth = localStorage.getItem('easyGP_auth')
    if (savedAuth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isLocked && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer(t => t - 1)
      }, 1000)
    } else if (lockTimer === 0) {
      setIsLocked(false)
    }
    return () => clearInterval(interval)
  }, [isLocked, lockTimer])

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
    }[] = []
    const particleCount = 100

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        color: Math.random() > 0.5 ? '#40E0D0' : '#FFD700',
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()

        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isLocked) return

    if (accessCode === 'DEMO2024') {
      setIsAuthenticated(true)
      localStorage.setItem('easyGP_auth', 'true')
      setError('')
      setAttempts(0)
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      setError('Invalid access code')
      
      if (newAttempts >= 3) {
        setIsLocked(true)
        setLockTimer(30)
      }
      
      setAccessCode('')
    }
  }

  const handlePaymentSuccess = (password: string) => {
    setShowPayment(false)
    // In a real app, this would save the password securely
    alert(`Your access code is: ${password}\nPlease save this for future access.`)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('easyGP_auth')
  }

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-[#00CED1] via-[#40E0D0] to-[#FFD700] flex items-center justify-center p-4">
        <canvas ref={canvasRef} className="absolute inset-0" />
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md bg-white/90 backdrop-blur">
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-6">
                <motion.div
                  className="relative"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-20 h-20 rounded-full bg-[#00CED1] flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#FFD700] flex items-center justify-center">
                      <div className="text-white text-4xl font-bold">+</div>
                    </div>
                  </div>
                </motion.div>
                <div className="absolute mt-20 text-center">
                  <span className="text-[#00CED1] font-bold text-2xl">Easy</span>
                  <span className="text-[#FFD700] font-bold text-2xl">GP</span>
                </div>
              </div>
              <CardTitle className="text-2xl text-[#00CED1] flex items-center gap-2 justify-center mt-8">
                <Lock className="h-6 w-6 text-[#FFD700]" />
                Access Required
              </CardTitle>
              <CardDescription className="text-center">
                Please enter your access code to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Enter access code"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="border-[#00CED1] focus:border-[#FFD700] focus:ring-[#FFD700]"
                    disabled={isLocked}
                  />
                  {error && (
                    <Alert variant="destructive" className="bg-red-50">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {isLocked && (
                    <Alert className="bg-[#FFD700]/10 border-[#FFD700] text-[#00CED1]">
                      <AlertDescription>
                        Too many attempts. Please wait {lockTimer} seconds before trying again.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-[#00CED1] hover:bg-[#00CED1]/90 text-white"
                  disabled={isLocked || !accessCode}
                >
                  Access Application
                </Button>
                <div className="mt-4 text-center">
                  <div className="text-sm text-[#00CED1]">
                    Demo Access Code: <span className="font-mono text-[#FFD700]">DEMO2024</span>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <AppSuite onLogout={handleLogout} onShowPayment={() => setShowPayment(true)} />
      <AnimatePresence>
        {showPayment && (
          <PaymentModal
            onSuccess={handlePaymentSuccess}
            onClose={() => setShowPayment(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default EasyGPLanding

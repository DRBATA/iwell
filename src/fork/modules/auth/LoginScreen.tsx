import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Alert, AlertDescription } from "../../../components/ui/alert"
import { Lock } from 'lucide-react'
import { Particles } from "../../../components/shared/Particles"

interface LoginScreenProps {
  onLogin: () => void
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (accessCode === 'DEMO2024') {
      onLogin()
    } else {
      setError('Invalid access code')
      setAccessCode('')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#00CED1]/20 to-[#FFD700]/20">
      <Particles />
      
      <div className="container mx-auto px-4 h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-[#00CED1] flex items-center gap-2">
                <Lock className="h-6 w-6 text-[#FFD700]" />
                Access Required
              </CardTitle>
              <CardDescription>
                Please enter your access code to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="password"
                  placeholder="Enter access code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                />
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full">
                  Access Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginScreen

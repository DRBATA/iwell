import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface PaymentModalProps {
  onSuccess: (password: string) => void
  onClose: () => void
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onSuccess, onClose }) => {
  const handleDummyPayment = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would process payment
    // For demo, just generate a random password
    const password = 'DEMO' + Math.floor(Math.random() * 10000)
    onSuccess(password)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md p-4"
      >
        <Card className="bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-[#00CED1]">Complete Purchase</CardTitle>
            <CardDescription>Enter payment details to access EasyGP Suite</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDummyPayment} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Card Number"
                  className="mb-2"
                  defaultValue="4242 4242 4242 4242"
                  disabled
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="text"
                    placeholder="MM/YY"
                    defaultValue="12/25"
                    disabled
                  />
                  <Input
                    type="text"
                    placeholder="CVC"
                    defaultValue="123"
                    disabled
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <Button
                  type="button"
                  onClick={onClose}
                  className="border border-[#00CED1] text-[#00CED1] bg-transparent hover:bg-[#00CED1]/10"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-[#00CED1] hover:bg-[#00CED1]/90 text-white"
                >
                  Complete Purchase
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default PaymentModal

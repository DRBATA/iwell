import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import SparklingParticleLogoAnimation from '../../../components/shared/SparklingParticleLogoAnimation'

interface AppSuiteProps {
  onLogout: () => void
  onShowPayment: () => void
}

const AppSuite: React.FC<AppSuiteProps> = ({ onLogout, onShowPayment }) => {
  const [showAnimation, setShowAnimation] = useState(true)

  if (showAnimation) {
    return <SparklingParticleLogoAnimation onAnimationComplete={() => setShowAnimation(false)} />
  }

  return (
    <div className="relative min-h-screen bg-[#F0F8FF]">
      {/* Navigation */}
      <nav className="relative bg-white/80 backdrop-blur-sm shadow-md z-10">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="text-[#00CED1] text-2xl font-bold">
                Easy<span className="text-[#FFD700]">GP</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={onLogout}
                className="bg-[#FFD700] text-[#00CED1] hover:bg-[#FFD700]/90"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Suite Section */}
      <motion.div 
        className="container mx-auto px-6 py-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Personal Health Journal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#00CED1] mb-4">Personal Health Journal</h3>
                <ul className="space-y-2 mb-4">
                  <li>• Blood Pressure Monitor</li>
                  <li>• Lab Results Tracker</li>
                  <li>• Mental Health Journal</li>
                  <li>• Personal Health Assistant</li>
                </ul>
                <Button 
                  className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#00CED1]"
                >
                  Access Now
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Health Data Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#00CED1] mb-4">Health Data Analysis</h3>
                <ul className="space-y-2 mb-4">
                  <li>• Trend Analysis</li>
                  <li>• Health Insights</li>
                  <li>• Progress Tracking</li>
                  <li>• Custom Reports</li>
                </ul>
                <Button 
                  onClick={onShowPayment}
                  className="w-full bg-[#00CED1] hover:bg-[#00CED1]/90 text-white"
                >
                  Get Access
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#00CED1] mb-4">Data Security</h3>
                <ul className="space-y-2 mb-4">
                  <li>• End-to-End Encryption</li>
                  <li>• Private Data Storage</li>
                  <li>• Access Controls</li>
                  <li>• Data Export</li>
                </ul>
                <Button 
                  onClick={onShowPayment}
                  className="w-full bg-[#00CED1] hover:bg-[#00CED1]/90 text-white"
                >
                  Get Access
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Health Records */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#00CED1] mb-4">Health Records</h3>
                <ul className="space-y-2 mb-4">
                  <li>• Medical History</li>
                  <li>• Test Results</li>
                  <li>• Medication Tracking</li>
                  <li>• Document Storage</li>
                </ul>
                <Button 
                  onClick={onShowPayment}
                  className="w-full bg-[#00CED1] hover:bg-[#00CED1]/90 text-white"
                >
                  Get Access
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Health Goals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#00CED1] mb-4">Health Goals</h3>
                <ul className="space-y-2 mb-4">
                  <li>• Goal Setting</li>
                  <li>• Progress Tracking</li>
                  <li>• Achievement History</li>
                  <li>• Personalized Plans</li>
                </ul>
                <Button 
                  onClick={onShowPayment}
                  className="w-full bg-[#00CED1] hover:bg-[#00CED1]/90 text-white"
                >
                  Get Access
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Sharing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-white/90 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-[#00CED1] mb-4">Data Sharing</h3>
                <ul className="space-y-2 mb-4">
                  <li>• Healthcare Provider Access</li>
                  <li>• Family Sharing Options</li>
                  <li>• Emergency Access</li>
                  <li>• Sharing Controls</li>
                </ul>
                <Button 
                  onClick={onShowPayment}
                  className="w-full bg-[#00CED1] hover:bg-[#00CED1]/90 text-white"
                >
                  Get Access
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm py-8 mt-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              © 2024 EasyGP. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AppSuite

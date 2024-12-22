import React from 'react'
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Particles } from "../components/shared/Particles"

interface HSJLandingPageProps {
  onStartApp: () => void
}

const HSJLandingPage: React.FC<HSJLandingPageProps> = ({ onStartApp }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#00CED1]/20 to-[#FFD700]/20">
      <Particles />
      
      <div className="container mx-auto px-4 h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <div className="p-6 text-center">
            <h1 className="text-4xl font-bold mb-4">
              <span className="text-[#00CED1]">Health</span>
              <span className="text-[#FFD700]">Journal</span>
            </h1>
            <p className="text-gray-600 mb-8">
              Your personal health dashboard
            </p>
            <Button onClick={onStartApp} className="w-full">
              Enter Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default HSJLandingPage

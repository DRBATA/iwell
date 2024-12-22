import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Shield, Stethoscope, Activity, Brain, LineChart } from 'lucide-react'
import { Card, CardContent } from "../../ui/card"

export interface FeaturesProps {}

const Features: React.FC<FeaturesProps> = () => {
  const mainFeatures = [
    {
      icon: Activity,
      title: "Monitoring Apps",
      description: "Track various health metrics including heart risk assessment, emotional well-being tracking, and fitness monitoring.",
      subFeatures: [
        "Heart risk assessment tools",
        "Emotional well-being trackers",
        "Fitness and activity monitoring"
      ]
    },
    {
      icon: Shield,
      title: "Secure Data Management",
      description: "Your health data is yours to control, with robust security measures to ensure privacy.",
      subFeatures: [
        "User-owned JSON files",
        "Protected by encryption",
        "PIN security system"
      ]
    },
    {
      icon: Stethoscope,
      title: "Comprehensive Tools",
      description: "Access tools that enable you to better understand and manage your health journey.",
      subFeatures: [
        "Evidence-based symptom checkers",
        "Vital sign trackers",
        "Cognitive journals",
        "Condition management guidance"
      ]
    }
  ]

  return (
    <div id="features" className="relative py-20 bg-[#F0F8FF]/80 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#00CED1] mb-4">
            Our Features
          </h2>
          <motion.p 
            className="text-gray-600 text-lg max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Evidence-based tools to help you navigate self-care safely and effectively
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mainFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-8">
                  <feature.icon className="w-16 h-16 text-[#00CED1] mb-4 mt-6" />
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.subFeatures.map((subFeature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <LineChart className="w-4 h-4 text-[#00CED1] mr-2" />
                        {subFeature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-semibold text-[#00CED1] mb-4">
            Evidence-Based Options
          </h3>
          <p className="text-gray-600 max-w-3xl mx-auto">
            EasyGP provides users with evidence-informed options to help navigate self-care safely and effectively. 
            By reflecting on symptoms and understanding triggers, users gain confidence in managing their conditions 
            and working with their healthcare teams.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Features

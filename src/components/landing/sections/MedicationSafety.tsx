import React from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertCircle, Heart, Brain, Users } from 'lucide-react'
import { Card, CardContent } from "../../ui/card"

interface MedicationSafetyProps {}

const MedicationSafety: React.FC<MedicationSafetyProps> = () => {
  const benefits = [
    {
      icon: AlertCircle,
      title: "Avoid Medication Errors",
      description: "With over 237 million medication errors occurring annually in England, avoiding errors during self-care is crucial. EasyGP helps users safely select over-the-counter treatments, including NSAIDs, reducing the risk of harm."
    },
    {
      icon: Shield,
      title: "Reduce the Need for Antibiotics",
      description: "By addressing symptoms early, we can prevent unnecessary antibiotic prescriptions, protecting your body and the broader community."
    },
    {
      icon: Brain,
      title: "Protect the Microbiome",
      description: "Antibiotics affect not only harmful bacteria but also the beneficial microbes in our bodies. Preserving this balance helps maintain overall health."
    },
    {
      icon: Users,
      title: "Prevent Resistance Spread",
      description: "Antibiotic resistance is a shared problem. Resistant bacteria can spread within families, workplaces, and communities, especially impacting frail individuals."
    },
    {
      icon: Heart,
      title: "Ensure Complete Recovery",
      description: "Properly dosed and appropriately lengthened treatments ensure eradication of conditions like strep throat, reducing risks of complications such as PANDAS."
    }
  ]

  return (
    <div id="medication-safety" className="relative py-20 bg-[#F0F8FF]/80 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#00CED1] mb-4">
            Medication Safety
          </h2>
          <motion.p 
            className="text-gray-600 text-lg max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Medication errors are a global challenge. In England alone, over 237 million errors are made annually, 
            costing the NHS over £98 million and contributing to over 1700 avoidable deaths every year.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <benefit.icon className="w-12 h-12 text-[#00CED1] mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-white/90 backdrop-blur-sm rounded-lg p-8 shadow-lg"
        >
          <h3 className="text-2xl font-semibold mb-4 text-[#00CED1]">How EasyGP Helps</h3>
          <ul className="space-y-4 text-gray-600">
            <li className="flex items-start">
              <Shield className="w-6 h-6 text-[#00CED1] mr-3 flex-shrink-0 mt-1" />
              <span>Recommending safe and effective over-the-counter treatments</span>
            </li>
            <li className="flex items-start">
              <Brain className="w-6 h-6 text-[#00CED1] mr-3 flex-shrink-0 mt-1" />
              <span>Providing tools to reflect on symptoms and triggers using cognitive journaling</span>
            </li>
            <li className="flex items-start">
              <Heart className="w-6 h-6 text-[#00CED1] mr-3 flex-shrink-0 mt-1" />
              <span>Offering guidance to ensure proper weight-dosed and well-timed treatments</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}

export default MedicationSafety

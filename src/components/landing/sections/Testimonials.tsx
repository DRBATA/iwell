import React from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

export interface TestimonialsProps {}

const Testimonials: React.FC<TestimonialsProps> = () => {
  return (
    <div id="testimonials" className="relative bg-[#F0F8FF]/80 backdrop-blur-sm py-24">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#00CED1] mb-16">
          Trusted by Clients Worldwide
        </h2>
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-white/90 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-lg">
            <div className="mb-6">
              <Quote className="w-12 h-12 text-[#00CED1]/20 mx-auto" />
            </div>
            <p className="text-xl md:text-2xl text-gray-700 italic mb-8">
              "The level of care and attention to detail is unmatched. A truly exceptional medical experience."
            </p>
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className="w-6 h-6 text-[#FFD700] fill-current" 
                  aria-label={`Star ${i + 1} of 5`}
                />
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-gray-800 font-semibold">Sarah Thompson</p>
              <p className="text-gray-600">EasyGP Member since 2022</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Testimonials

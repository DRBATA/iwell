import React from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  onStartClick: () => void;
}

export default function Hero({ onStartClick }: HeroProps) {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Hero Content */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-8"
            style={{
              background: 'linear-gradient(to right, #FFD700, #FFF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(255, 215, 0, 0.3)'
            }}
          >
            Empowering Your Health Journey
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white mb-12 text-shadow-lg"
          >
            Take control of your health with personalized tools designed to keep you safe and informed.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.button
              onClick={onStartClick}
              className="px-8 py-4 bg-[#FFD700] text-[#00CED1] text-xl font-bold rounded-full 
                       hover:bg-white transform hover:scale-105 transition-all duration-300
                       shadow-lg hover:shadow-xl relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated gradient border */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00CED1] via-[#40E0D0] to-[#FFD700] rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              
              {/* Button content */}
              <span className="relative flex items-center">
                Get Started
                <motion.span
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-1/4 -left-32 w-64 h-64 bg-[#FFD700] rounded-full mix-blend-multiply filter blur-3xl opacity-70"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-80 h-80 bg-[#00CED1] rounded-full mix-blend-multiply filter blur-3xl opacity-70"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    </section>
  );
}

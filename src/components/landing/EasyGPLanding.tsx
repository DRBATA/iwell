import React, { useState } from 'react';
import MainNav from '../navigation/MainNav';
import HSJAccessModal from '../auth/HSJAccessModal';
import { Particles } from '../shared/Particles';
import Hero from './sections/Hero';
import About from './sections/About';
import Features from './sections/Features';
import MedicationSafety from './sections/MedicationSafety';
import CTA from './sections/CTA';
import Testimonials from './sections/Testimonials';
import Footer from './sections/Footer';
import { motion } from 'framer-motion';

interface EasyGPLandingProps {
  onStartClick: () => void;
}

export default function EasyGPLanding({ onStartClick }: EasyGPLandingProps) {
  const [isFooterExpanded, setIsFooterExpanded] = useState(false);

  const easyVariants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#00CED1] via-[#40E0D0] to-[#FFD700] overflow-x-hidden">
      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <MainNav 
          onStartClick={onStartClick}
          isExpanded={isFooterExpanded}
          setIsExpanded={setIsFooterExpanded}
          easyVariants={easyVariants}
        />

        {/* Background Particles */}
        <Particles />

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Hero onStartClick={onStartClick} />
          <About />
          <Features />
          <MedicationSafety />
          <Testimonials />
          <CTA onStartClick={onStartClick} />
        </main>

        {/* Footer */}
        <Footer 
          easyVariants={easyVariants}
          isExpanded={isFooterExpanded}
          setIsExpanded={setIsFooterExpanded}
        />
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700] rounded-full filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 bg-[#00CED1] rounded-full filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    </div>
  );
}

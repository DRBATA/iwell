import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Heart, Brain, Calendar } from 'lucide-react';

// Profile is just a view into the JSON state, not a controller of it
export const Profile = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Handle natural interaction with data
  const handleInteraction = useCallback((e: React.MouseEvent) => {
    // Get interaction point relative to element
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    e.currentTarget.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => ripple.remove(), 1000);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-full"
      onClick={handleInteraction}
    >
      {/* Floating interaction points */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2"
        >
          <Heart className="w-6 h-6 text-wave" />
        </motion.div>

        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-1/4 right-1/4 transform translate-x-1/2 -translate-y-1/2"
        >
          <Activity className="w-6 h-6 text-wave" />
        </motion.div>

        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/4 left-1/4 transform -translate-x-1/2 translate-y-1/2"
        >
          <Brain className="w-6 h-6 text-wave" />
        </motion.div>

        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
          className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2"
        >
          <Calendar className="w-6 h-6 text-wave" />
        </motion.div>
      </div>

      {/* Content emerges through interaction */}
      <AnimatePresence>
        {activeSection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-0 bg-deep/30 backdrop-blur-sm rounded-lg p-8"
          >
            <div className="text-foam">
              {/* Content would be loaded based on activeSection */}
              <h2 className="text-xl mb-4">{activeSection}</h2>
              <p className="opacity-70">Information emerges through interaction...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Natural interaction hint */}
      {!activeSection && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-foam text-center pointer-events-none"
        >
          interact with the elements...
        </motion.p>
      )}
    </motion.div>
  );
};

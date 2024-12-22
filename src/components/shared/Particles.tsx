import React from 'react';
import { motion } from 'framer-motion';

export function Particles() {
  // Generate random positions for particles
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 20 + 10,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.3 + 0.1
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Bright gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00CED1]/30 via-[#40E0D0]/20 to-[#FFD700]/30" />

      {/* Animated particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: particle.id % 2 === 0 ? '#00CED1' : '#FFD700',
            opacity: particle.opacity,
            filter: 'blur(8px)'
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            scale: [1, Math.random() + 0.5, 1],
            opacity: [particle.opacity, particle.opacity * 2, particle.opacity]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear"
          }}
        />
      ))}

      {/* Large glowing orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-[#00CED1] filter blur-3xl opacity-20"
        style={{ left: '10%', top: '20%' }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
          x: [0, 50, 0],
          y: [0, 30, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-[#FFD700] filter blur-3xl opacity-20"
        style={{ right: '15%', bottom: '10%' }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -40, 0],
          y: [0, -20, 0]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "linear"
        }}
      />

      {/* Sparkles */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

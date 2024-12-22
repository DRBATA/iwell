import React from 'react';
import { motion } from 'framer-motion';

interface MainNavProps {
  onStartClick: () => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  easyVariants: {
    initial: { opacity: number; scale: number };
    animate: { opacity: number; scale: number };
    transition: { duration: number };
  };
}

export default function MainNav({ onStartClick, isExpanded, setIsExpanded, easyVariants }: MainNavProps) {
  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20"
      initial={easyVariants.initial}
      animate={easyVariants.animate}
      transition={easyVariants.transition}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#00CED1] to-[#FFD700] rounded-lg blur-sm"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              <div className="relative bg-[#FFD700] w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
                <span className="text-[#00CED1] font-bold text-2xl">+</span>
              </div>
            </div>
            <span className="ml-2 text-white font-mono font-bold text-2xl">
              Easy<span className="text-[#FFD700]">GP</span>
            </span>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="#about">About</NavLink>
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#testimonials">Testimonials</NavLink>
            <motion.button
              onClick={onStartClick}
              className="px-6 py-2 bg-[#FFD700] text-[#00CED1] font-bold rounded-full 
                       hover:bg-white transform hover:scale-105 transition-all duration-300
                       shadow-lg hover:shadow-xl relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated gradient border */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00CED1] via-[#40E0D0] to-[#FFD700] rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              
              {/* Button content */}
              <span className="relative">Get Started</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      className="text-white hover:text-[#FFD700] transition-colors relative group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
      <motion.div
        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FFD700] origin-left"
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.a>
  );
}

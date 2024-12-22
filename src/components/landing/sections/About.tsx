import React from 'react'
import { motion } from 'framer-motion'

interface AboutProps {}

const About: React.FC<AboutProps> = () => {
  return (
    <div id="about" className="relative h-[80vh] bg-white/80 backdrop-blur-sm flex items-center justify-center">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#00CED1] mb-4">
            About EasyGP
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <p className="text-gray-600 text-lg mb-6">
              EasyGP is a platform that helps users understand their conditions and work collaboratively with their health team. It is free to use online after a one-time download, providing accessible and secure tools for self-care and informed decision-making.
            </p>
            <p className="text-gray-600 text-lg">
              Whether you're managing ongoing health conditions or seeking to maintain wellness, our platform empowers you with the tools and knowledge needed for proactive healthcare management.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default About

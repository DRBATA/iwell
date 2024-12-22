import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope } from 'lucide-react';
import SafetyGuideModal from './SafetyGuideModal';
import PrivacyGDPRModal from './PrivacyGDPRModal';
import UserResponsibilityModal from './UserResponsibilityModal';
import TermsModal from './TermsModal';

interface FooterProps {
  easyVariants: any;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ easyVariants, isExpanded, setIsExpanded }) => {
  const [isSafetyGuideOpen, setIsSafetyGuideOpen] = useState(false);
  const [isPrivacyGDPROpen, setIsPrivacyGDPROpen] = useState(false);
  const [isUserResponsibilityOpen, setIsUserResponsibilityOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-[#F0F8FF]/80 backdrop-blur-sm z-50">
      <div className={`container mx-auto px-6 overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'py-8' : 'py-2'}`}>
        <div className={`transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 h-0'}`}>
          <div className="flex flex-wrap justify-between items-start">
            {/* Logo */}
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <motion.div
                variants={easyVariants}
                initial="initial"
                animate="animate"
                className="text-[#00CED1] text-2xl font-bold flex items-center mb-4"
              >
                <Stethoscope className="w-8 h-8 text-[#FFD700] mr-2" />
                Easy<span className="text-[#FFD700]">GP</span>
              </motion.div>
              <p className="text-sm text-gray-600 mb-4">
                Empowering your health journey.
              </p>
            </div>

            {/* Footer Links with Smooth Scrolling */}
            <div className="w-full md:w-3/4 flex flex-wrap">
              <div className="w-full md:w-1/2 mb-6 md:mb-0">
                <h4 className="text-lg font-semibold mb-4 text-[#00CED1]">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#home" className="text-gray-600 hover:text-[#00CED1]">Home</a>
                  </li>
                  <li>
                    <a href="#features" className="text-gray-600 hover:text-[#00CED1]">Features</a>
                  </li>
                  <li>
                    <a href="#testimonials" className="text-gray-600 hover:text-[#00CED1]">Testimonials</a>
                  </li>
                  <li>
                    <a href="#login" className="text-gray-600 hover:text-[#00CED1]">Ready?</a>
                  </li>
                  <li>
                    <button 
                      onClick={() => setIsSafetyGuideOpen(true)}
                      className="text-gray-600 hover:text-[#00CED1]"
                    >
                      Safety Guide
                    </button>
                  </li>
                </ul>
              </div>
              <div className="w-full md:w-1/2">
                <h4 className="text-lg font-semibold mb-4 text-[#00CED1]">Policies</h4>
                <ul className="space-y-2">
                  <li>
                    <button 
                      className="text-gray-600 hover:text-[#00CED1]" 
                      onClick={() => setIsPrivacyGDPROpen(true)}
                    >
                      Privacy & GDPR Policy
                    </button>
                  </li>
                  <li>
                    <button 
                      className="text-gray-600 hover:text-[#00CED1]" 
                      onClick={() => setIsUserResponsibilityOpen(true)}
                    >
                      User Responsibility Policy
                    </button>
                  </li>
                  <li>
                    <button 
                      className="text-gray-600 hover:text-[#00CED1]" 
                      onClick={() => setIsTermsOpen(true)}
                    >
                      Terms & Pricing
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              © 2024 EasyGP. All rights reserved.
            </p>
          </div>
        </div>

        {/* Collapsed View */}
        <div className={`text-center transition-all duration-300 ${isExpanded ? 'hidden' : 'block'}`}>
          <p className="text-sm text-gray-600">© 2024 EasyGP. All rights reserved.</p>
        </div>
      </div>

      {/* Modal Components */}
      <SafetyGuideModal 
        isOpen={isSafetyGuideOpen} 
        onClose={() => setIsSafetyGuideOpen(false)} 
      />
      <PrivacyGDPRModal 
        isOpen={isPrivacyGDPROpen} 
        onClose={() => setIsPrivacyGDPROpen(false)} 
      />
      <UserResponsibilityModal 
        isOpen={isUserResponsibilityOpen} 
        onClose={() => setIsUserResponsibilityOpen(false)} 
      />
      <TermsModal 
        isOpen={isTermsOpen} 
        onClose={() => setIsTermsOpen(false)} 
      />
    </footer>
  );
};

export default Footer;

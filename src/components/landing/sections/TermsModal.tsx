import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import BaseModal from "../../shared/BaseModal";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  const sections = [
    {
      id: "free",
      title: "Free Services",
      content: (
        <>
          <h4 className="font-semibold mb-2">EasyGP Free Services</h4>
          <p className="mb-2">EasyGP offers valuable free services to help you manage your health efficiently:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Health Synchronisation Journal (HSJ)</strong>: Create your own HSJ to securely organize and store your health data.</li>
            <li><strong>OTC Medication Checker</strong>: With an HSJ, verify if specific over-the-counter medications are safe based on your health profile.</li>
          </ul>
        </>
      )
    },
    {
      id: "plans",
      title: "Subscription Plans",
      content: (
        <>
          <h4 className="font-semibold mb-2">Affordable Subscription Plans</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>Individual: £7.99/month or £57.55/year (40% discount)</li>
            <li>Double: £11.99/month or £86.30/year (40% discount)</li>
            <li>Family (up to 6 HSJs): £17.99/month or £129.55/year (40% discount)</li>
            <li>Care Companies (up to 30 HSJs): £225/month or £1,620/year (40% discount)</li>
          </ul>
          <h4 className="font-semibold mt-4 mb-2">Included Benefits</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li>Unlimited Minor Illness Consultations</li>
            <li>Unlimited Triage</li>
            <li>Low-Cost Letters, Referrals, and Prescriptions</li>
          </ul>
        </>
      )
    },
    {
      id: "quality",
      title: "Service Quality",
      content: (
        <>
          <h4 className="font-semibold mb-2">Quality Service and User Control</h4>
          <p className="mb-4">EasyGP is a sole trader service dedicated to delivering high-quality, value-oriented health support, giving you complete control over your health data. By providing an accessible platform without centralized storage, we aim to keep costs low and ensure data privacy.</p>
          <p><strong>Your Responsibility</strong>: EasyGP is user-led, meaning you take an active role in your health journey.</p>
        </>
      )
    },
    {
      id: "pricing",
      title: "Pricing & Refunds",
      content: (
        <>
          <h4 className="font-semibold mb-2">Pricing Changes</h4>
          <p className="mb-4">EasyGP may adjust subscription prices at any time. Users will be notified of any pricing changes. To lock in the current rate and avoid future price increases, users may opt for an annual subscription at a 40% discount.</p>
          
          <h4 className="font-semibold mb-2">No Refunds or Returns</h4>
          <p>All transactions with EasyGP are final. Users may cancel their subscription at any time, but cancellation will not result in a refund for the current billing period.</p>
        </>
      )
    },
    {
      id: "terms",
      title: "Terms",
      content: (
        <>
          <h4 className="font-semibold mb-2">Subscription Cancellations</h4>
          <p className="mb-4">If you cancel before your next subscription renewal, you will continue to have access to EasyGP services until the end of the current billing cycle. No partial refunds will be provided.</p>
          
          <h4 className="font-semibold mb-2">Availability</h4>
          <p>EasyGP is currently available only in the United Kingdom.</p>
        </>
      )
    }
  ];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Terms of Service & Pricing"
    >
      <Tabs defaultValue="free" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-4">
          {sections.map((section) => (
            <TabsTrigger 
              key={section.id}
              value={section.id}
              className="text-[#00CED1] data-[state=active]:bg-[#00CED1] data-[state=active]:text-white"
            >
              {section.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map((section) => (
          <TabsContent 
            key={section.id} 
            value={section.id}
            className="mt-4 text-gray-700"
          >
            <div className="prose max-w-none">
              {section.content}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          By subscribing to EasyGP, you agree to these terms. EasyGP aims to provide accessible, high-quality health support.
        </p>
      </div>
    </BaseModal>
  );
};

export default TermsModal;

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import BaseModal from "../../../components/shared/BaseModal";

interface SafetyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SafetyGuideModal: React.FC<SafetyGuideModalProps> = ({ isOpen, onClose }) => {
  const sections = [
    {
      id: "purpose",
      title: "Purpose & Tools",
      content: (
        <>
          <h4 className="font-semibold mb-2">Purpose of EasyGP's Tools</h4>
          <p className="mb-4">EasyGP's tools are designed to support you as guides and aids, helping you manage your health efficiently and effectively.</p>
          
          <h4 className="font-semibold mb-2">Proactive Self-Management</h4>
          <p>Take charge of your health by tracking symptoms, understanding basic triage, and choosing safe over-the-counter medications. These tools complement professional medical advice.</p>
        </>
      )
    },
    {
      id: "seeking-help",
      title: "When to Seek Help",
      content: (
        <>
          <h4 className="font-semibold mb-2">Monitoring Changes</h4>
          <p className="mb-4">If your symptoms do not improve, worsen, or if new symptoms appear, seek additional support. Consult your GP when necessary.</p>
          
          <h4 className="font-semibold mb-2">Urgent Health Matters</h4>
          <p>For urgent health issues, call NHS 111 for immediate guidance or 999 in emergencies. EasyGP does not provide emergency assistance.</p>
        </>
      )
    },
    {
      id: "tracking",
      title: "Health Tracking",
      content: (
        <>
          <h4 className="font-semibold mb-2">Tracking Your Health</h4>
          <p className="mb-4">Use Monitoring Apps to track key health metrics such as heart health, emotional well-being, and fitness. Monitor changes over time for valuable insights.</p>
          
          <h4 className="font-semibold mb-2">Sharing Information</h4>
          <p>Share relevant health information from your Health Journal with healthcare providers to improve care quality and facilitate faster referrals.</p>
        </>
      )
    },
    {
      id: "support",
      title: "Support & Medication",
      content: (
        <>
          <h4 className="font-semibold mb-2">Pharmacist Support</h4>
          <p className="mb-4">For non-urgent issues, consult pharmacists who can provide valuable guidance and perform minor examinations.</p>
          
          <h4 className="font-semibold mb-2">Medication Guidance</h4>
          <p>Use OTC Medication Apps to verify medication compatibility and find suitable options. Always consult healthcare providers for additional guidance.</p>
        </>
      )
    },
    {
      id: "triage",
      title: "Triage & Assessment",
      content: (
        <>
          <h4 className="font-semibold mb-2">Basic Triage Support</h4>
          <p className="mb-4">Use the Triage Bot for UK-specific, basic guidance to understand possible next steps while seeking professional advice as needed.</p>
          
          <h4 className="font-semibold mb-2">Additional Resources</h4>
          <p>Access comprehensive tracking tools, diagnostic labs, and extensive health information with your subscription.</p>
        </>
      )
    },
    {
      id: "technology",
      title: "Technology & Safety",
      content: (
        <>
          <h4 className="font-semibold mb-2">Safe Technology Use</h4>
          <p className="mb-4">EasyGP uses algorithmic and deterministic methods for consistent and accurate insights, avoiding risks associated with AI hallucination.</p>
          
          <h4 className="font-semibold mb-2">Record-Keeping</h4>
          <p>Maintain your private and secure Health Journal, controlling access while facilitating professional consultations.</p>
        </>
      )
    }
  ];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Safety-Netting Guide"
      maxWidth="max-w-4xl"
    >
      <Tabs defaultValue="purpose" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-4">
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
    </BaseModal>
  );
};

export default SafetyGuideModal;

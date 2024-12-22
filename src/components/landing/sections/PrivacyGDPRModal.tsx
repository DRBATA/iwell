import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import BaseModal from "../../shared/BaseModal";

interface PrivacyGDPRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyGDPRModal: React.FC<PrivacyGDPRModalProps> = ({ isOpen, onClose }) => {
  const sections = [
    {
      id: "intro",
      title: "Introduction",
      content: (
        <>
          <p>EasyGP is committed to protecting the privacy of all users and ensuring that our data practices comply with GDPR standards. This policy outlines how we handle health data, user rights, and our technology practices to ensure security and transparency.</p>
        </>
      )
    },
    {
      id: "user-data",
      title: "User Data",
      content: (
        <>
          <h4 className="font-semibold mb-2">User-Controlled Data</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Health Journal Ownership</strong>: Users fully control their health data through their personal Health Journal.</li>
            <li><strong>No Data Sharing</strong>: EasyGP does not share personal health data with third parties.</li>
            <li><strong>Secure Access</strong>: Health Journal data is protected by a private PIN.</li>
          </ul>
        </>
      )
    },
    {
      id: "gdpr-rights",
      title: "GDPR Rights",
      content: (
        <>
          <h4 className="font-semibold mb-2">Data Subject Rights</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Right to Access</strong>: Request access to Health Journal data.</li>
            <li><strong>Right to Rectification</strong>: Update or correct inaccurate data.</li>
            <li><strong>Right to Erasure</strong>: Request data deletion where permissible.</li>
            <li><strong>Data Portability</strong>: Transfer data to another provider.</li>
          </ul>
        </>
      )
    },
    {
      id: "security",
      title: "Security",
      content: (
        <>
          <h4 className="font-semibold mb-2">Data Security and Minimization</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Encryption</strong>: All health data is encrypted in transit and at rest.</li>
            <li><strong>Data Minimization</strong>: We collect only essential health management data.</li>
            <li><strong>Local Storage</strong>: Users store and manage data locally in their Health Journal.</li>
          </ul>
        </>
      )
    },
    {
      id: "technology",
      title: "Technology",
      content: (
        <>
          <h4 className="font-semibold mb-2">Technology Use and Safety</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Algorithmic Approach</strong>: Small-scale machine learning and deterministic algorithms.</li>
            <li><strong>Non-Generative AI</strong>: We avoid generative AI for consistent results.</li>
            <li><strong>User Control</strong>: Independent health data management.</li>
          </ul>
        </>
      )
    }
  ];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Privacy and GDPR Policy"
    >
      <Tabs defaultValue="intro" className="w-full">
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
          Contact our Data Protection Officer at <strong>DPO@easygp.com</strong> for any questions.
        </p>
      </div>
    </BaseModal>
  );
};

export default PrivacyGDPRModal;

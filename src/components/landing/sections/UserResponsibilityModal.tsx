import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import BaseModal from "../../shared/BaseModal";

interface UserResponsibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserResponsibilityModal: React.FC<UserResponsibilityModalProps> = ({ isOpen, onClose }) => {
  const sections = [
    {
      id: "intro",
      title: "Introduction",
      content: (
        <>
          <p>EasyGP is committed to empowering users to manage their health proactively and safely. This guide outlines user responsibilities and our commitment to maintaining a secure, safe platform for health management.</p>
        </>
      )
    },
    {
      id: "responsibilities",
      title: "Responsibilities",
      content: (
        <>
          <h4 className="font-semibold mb-2">User Responsibilities</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Health Data Management</strong>: Keep your Health Journal secure and up-to-date.</li>
            <li><strong>Information Sharing</strong>: Share relevant health data with healthcare providers.</li>
            <li><strong>Tool Usage</strong>: Use EasyGP's tools as aids, not replacements for medical advice.</li>
          </ul>
        </>
      )
    },
    {
      id: "safety",
      title: "Safety",
      content: (
        <>
          <h4 className="font-semibold mb-2">Health and Safety Practices</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Secure Access</strong>: Safeguard your Health Journal with secure PIN access.</li>
            <li><strong>Regular Updates</strong>: Track health metrics and symptoms consistently.</li>
            <li><strong>Emergency Services</strong>: Contact NHS 111 or emergency services for urgent cases.</li>
          </ul>
        </>
      )
    },
    {
      id: "platform",
      title: "Platform Use",
      content: (
        <>
          <h4 className="font-semibold mb-2">Safe Platform Usage</h4>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Technology</strong>: We use algorithmic methods for consistent guidance.</li>
            <li><strong>Professional Care</strong>: Seek professional advice for significant concerns.</li>
            <li><strong>Supplementary Tools</strong>: Use our resources alongside healthcare consultations.</li>
          </ul>
        </>
      )
    }
  ];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="User Responsibility Policy"
    >
      <Tabs defaultValue="intro" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
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
          <strong>Important Notice:</strong> EasyGP provides tools and resources, but it is ultimately the user's responsibility to manage their health data and collaborate with healthcare providers.
        </p>
      </div>
    </BaseModal>
  );
};

export default UserResponsibilityModal;

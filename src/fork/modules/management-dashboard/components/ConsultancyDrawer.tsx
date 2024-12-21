import React from 'react';

interface ConsultancyService {
  id: string;
  name: string;
  description: string;
  barrierLevel: number;
  expertise: string[];
}

interface ConsultancyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServices: ConsultancyService[];
  onRemoveService: (id: string) => void;
  onSubmitRequest: () => void;
}

type ExpertiseHighlights = {
  [key in 'Palliative Care' | 'Emergency Medicine' | 'Mental Health' | 'Quality Improvement' | 'Clinical Leadership']: string;
};

const ConsultancyDrawer: React.FC<ConsultancyDrawerProps> = ({
  isOpen,
  onClose,
  selectedServices,
  onRemoveService,
  onSubmitRequest
}) => {
  if (!isOpen) return null;

  const expertiseHighlights: ExpertiseHighlights = {
    'Palliative Care': 'Led Palliative Care MDT, St Francis Hospice experience',
    'Emergency Medicine': 'A&E experience at multiple major centers',
    'Mental Health': 'Experience in Elderly Psychiatry and Crisis Teams',
    'Quality Improvement': 'Won East of England Audit Poster Competition',
    'Clinical Leadership': 'MDT Chair and peer review facilitation',
  };

  const getExpertiseHighlight = (expertise: string): string => {
    return (expertiseHighlights as Record<string, string>)[expertise] || expertise;
  };

  return (
    <div 
      className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform transition-transform duration-300"
      style={{
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        zIndex: 1000
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 id="drawer-title" className="text-2xl font-bold text-primary">Consultation Request</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close consultation drawer"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {selectedServices.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p>No services selected yet.</p>
              <p className="mt-2">Click on barrier badges to explore available services.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {selectedServices.map((service) => (
                <div 
                  key={service.id} 
                  className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                    <button
                      onClick={() => onRemoveService(service.id)}
                      className="text-gray-400 hover:text-red-500"
                      aria-label={`Remove ${service.name} from consultation request`}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{service.description}</p>
                  <div className="mt-3 space-y-2">
                    {service.expertise.map((exp, index) => (
                      <div key={index} className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                        {getExpertiseHighlight(exp)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedServices.length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={onSubmitRequest}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              Request Consultation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultancyDrawer;

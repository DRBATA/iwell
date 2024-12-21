import React from 'react';

interface BarrierTooltipProps {
  barrierLevel: number;
}

const BarrierTooltip: React.FC<BarrierTooltipProps> = ({ barrierLevel }) => {
  const getBarrierInfo = (level: number) => {
    switch (level) {
      case 1:
        return {
          services: [
            'Market Access Strategy',
            'Healthcare Professional Education',
            'Patient Engagement Programs'
          ],
          feeStructure: 'Lower fee-to-value ratio due to minimal barriers'
        };
      case 2:
        return {
          services: [
            'Regulatory Navigation',
            'Market Access Strategy',
            'Healthcare Professional Training'
          ],
          feeStructure: 'Standard fee-to-value ratio with milestone-based options'
        };
      case 3:
        return {
          services: [
            'Regulatory Navigation',
            'Clinical Trial Design',
            'Insurance Coverage Strategy',
            'Healthcare Professional Engagement'
          ],
          feeStructure: 'Moderate fee-to-value ratio with flexible payment plans'
        };
      case 4:
        return {
          services: [
            'Complex Regulatory Navigation',
            'Clinical Trial Oversight',
            'R&D Consultancy',
            'Comprehensive Market Access Strategy'
          ],
          feeStructure: 'Higher fee-to-value ratio reflecting complexity'
        };
      case 5:
        return {
          services: [
            'Full-spectrum Regulatory Support',
            'Advanced Clinical Trial Design & Oversight',
            'Specialized R&D Consultancy',
            'Custom Market Access Solutions',
            'Comprehensive Stakeholder Engagement'
          ],
          feeStructure: 'Premium fee-to-value ratio with tailored payment structures'
        };
      default:
        return {
          services: [],
          feeStructure: 'Contact for custom pricing'
        };
    }
  };

  const info = getBarrierInfo(barrierLevel);

  return (
    <div className="absolute z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 text-sm">
      <div className="font-semibold text-gray-900 mb-2">Available Consultancy Services:</div>
      <ul className="list-disc pl-4 mb-3 space-y-1">
        {info.services.map((service, index) => (
          <li key={index} className="text-gray-700">{service}</li>
        ))}
      </ul>
      <div className="font-semibold text-gray-900 mb-1">Fee Structure:</div>
      <p className="text-gray-700">{info.feeStructure}</p>
    </div>
  );
};

export default BarrierTooltip;

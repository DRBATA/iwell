// Archived tooltip component - moved into main card view
// Original implementation of barrier tooltips with hover details

import React from 'react';

interface BarrierTooltipProps {
  barrierLevel: number;
  marketName: string;
  onSaveInsight: (insight: {
    id: string;
    marketName: string;
    barrierLevel: number;
    barrierType: string;
    insights: string[];
    strategies: string[];
  }) => void;
}

const BarrierTooltip: React.FC<BarrierTooltipProps> = ({
  barrierLevel,
  marketName,
  onSaveInsight
}) => {
  const getBarrierInfo = (level: number) => {
    switch (level) {
      case 1:
        return {
          type: 'Low Entry Barriers',
          insights: [
            'Fast-track approval stages',
            'Market entry windows',
            'Resource scaling points'
          ],
          strategies: [
            'Approval stage mapping',
            'Entry window analysis',
            'Resource stage mapping'
          ]
        };
      case 2:
        return {
          type: 'Moderate-Low Barriers',
          insights: [
            'Growth acceleration zones',
            'Competition gaps',
            'Market timing windows'
          ],
          strategies: [
            'Growth zone mapping',
            'Gap analysis framework',
            'Window sequence mapping'
          ]
        };
      case 3:
        return {
          type: 'Moderate Barriers',
          insights: [
            'Regulatory staging gates',
            'Education program targets',
            'Competition white space'
          ],
          strategies: [
            'Gate sequence mapping',
            'Target group analysis',
            'White space mapping'
          ]
        };
      case 4:
        return {
          type: 'High Barriers',
          insights: [
            'Compliance staging gates',
            'Capital staging gates',
            'Partnership channels'
          ],
          strategies: [
            'Gate-by-gate compliance map',
            'Capital stage requirements',
            'Channel development sequence'
          ]
        };
      case 5:
        return {
          type: 'Very High Barriers',
          insights: [
            'Regulatory staging gates',
            'Education program targets',
            'Market access channels'
          ],
          strategies: [
            'Gate sequence framework',
            'Target group mapping',
            'Access channel analysis'
          ]
        };
      default:
        return {
          type: 'Unknown',
          insights: [],
          strategies: []
        };
    }
  };

  const info = getBarrierInfo(barrierLevel);

  const handleSaveInsight = () => {
    onSaveInsight({
      id: `${marketName}-${barrierLevel}-${Date.now()}`,
      marketName,
      barrierLevel,
      barrierType: info.type,
      insights: info.insights,
      strategies: info.strategies
    });
  };

  return (
    <div 
      className="absolute z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4"
      style={{
        top: '0',
        right: 'calc(100% + 1rem)',
      }}
    >
      <div className="flex flex-col gap-2 mb-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-900">{info.type}</h3>
          <button
            onClick={handleSaveInsight}
            className="text-sm bg-primary text-white px-3 py-1 rounded-full hover:bg-opacity-90 transition-colors"
            aria-label={`Save insights for ${marketName}`}
          >
            Save Insight
          </button>
        </div>
        <div className="text-sm text-indigo-600">
          Market barrier analysis
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Market Insights:</h4>
          <ul className="list-disc pl-4 space-y-1">
            {info.insights.map((insight, index) => (
              <li key={index} className="text-sm text-gray-600">{insight}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-indigo-600 mb-2">Entry Approach:</h4>
          <ul className="list-disc pl-4 space-y-1">
            {info.strategies.map((strategy, index) => (
              <li key={index} className="text-sm text-gray-600">{strategy}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BarrierTooltip;

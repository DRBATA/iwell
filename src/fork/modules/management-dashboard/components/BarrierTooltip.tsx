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

const BarrierTooltip: React.FC<BarrierTooltipProps> = ({ barrierLevel, marketName, onSaveInsight }) => {
  const getBarrierInfo = (level: number) => {
    switch (level) {
      case 1:
        return {
          type: 'Low Entry Barriers',
          insights: [
            'Established regulatory pathways exist',
            'Strong existing market data available',
            'Lower capital requirements'
          ],
          strategies: [
            'Quality-driven differentiation (from A&E experience)',
            'Evidence-based market positioning',
            'Streamlined stakeholder engagement'
          ]
        };
      case 2:
        return {
          type: 'Moderate-Low Barriers',
          insights: [
            'Some regulatory oversight needed',
            'Growing market with clear pathways',
            'Moderate competition levels'
          ],
          strategies: [
            'MDT-style collaborative approach',
            'Targeted compliance frameworks',
            'Focus on underserved segments'
          ]
        };
      case 3:
        return {
          type: 'Moderate Barriers',
          insights: [
            'Complex regulatory requirements',
            'Significant market education needed',
            'Established competitor presence'
          ],
          strategies: [
            'Peer review-based quality assurance',
            'Clinical audit methodology application',
            'Phased implementation approach'
          ]
        };
      case 4:
        return {
          type: 'High Barriers',
          insights: [
            'Stringent regulatory environment',
            'High capital requirements',
            'Complex stakeholder landscape'
          ],
          strategies: [
            'Crisis team coordination principles',
            'Evidence-based protocol development',
            'Multi-specialty integration methods'
          ]
        };
      case 5:
        return {
          type: 'Very High Barriers',
          insights: [
            'Intensive regulatory oversight',
            'Significant resource requirements',
            'Limited market access points'
          ],
          strategies: [
            'Palliative care coordination model',
            'Mental health service frameworks',
            'Research-driven market approach'
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
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900">{info.type}</h3>
        <button
          onClick={handleSaveInsight}
          className="text-sm bg-primary text-white px-3 py-1 rounded-full hover:bg-opacity-90 transition-colors"
          aria-label={`Save insights for ${marketName}`}
        >
          Save Insight
        </button>
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
          <h4 className="text-sm font-medium text-gray-700 mb-2">Proven Approaches:</h4>
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

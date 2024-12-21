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
            'Basic approval process to follow',
            'Clear market opportunity exists',
            'Manageable startup costs'
          ],
          strategies: [
            'Plan your approval path',
            'Check market readiness',
            'Set up efficiently'
          ]
        };
      case 2:
        return {
          type: 'Moderate-Low Barriers',
          insights: [
            'More oversight to navigate',
            'Room for market growth',
            'Competition to consider'
          ],
          strategies: [
            'Build your compliance',
            'Find your opportunities',
            'Position effectively'
          ]
        };
      case 3:
        return {
          type: 'Moderate Barriers',
          insights: [
            'Complex rules to handle',
            'Market needs education',
            'Strong competitors exist'
          ],
          strategies: [
            'Handle complex rules',
            'Build market acceptance',
            'Stand out clearly'
          ]
        };
      case 4:
        return {
          type: 'High Barriers',
          insights: [
            'Strict rules in place',
            'Major investment needed',
            'Many stakeholders involved'
          ],
          strategies: [
            'Meet strict standards',
            'Engage key players',
            'Plan your rollout'
          ]
        };
      case 5:
        return {
          type: 'Very High Barriers',
          insights: [
            'Toughest regulations exist',
            'Highest resource needs',
            'Most limited access'
          ],
          strategies: [
            'Break into markets',
            'Use resources well',
            'Clear the barriers'
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
          Understanding your market barriers
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
          <h4 className="text-sm font-medium text-indigo-600 mb-2">What We Bring:</h4>
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

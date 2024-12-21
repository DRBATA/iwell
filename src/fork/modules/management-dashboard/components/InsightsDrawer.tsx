import React from 'react';

interface MarketInsight {
  id: string;
  marketName: string;
  barrierLevel: number;
  barrierType: string;
  insights: string[];
  strategies: string[];
}

interface InsightsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedInsights: MarketInsight[];
  onRemoveInsight: (id: string) => void;
}

const InsightsDrawer: React.FC<InsightsDrawerProps> = ({
  isOpen,
  onClose,
  savedInsights,
  onRemoveInsight
}) => {
  if (!isOpen) return null;

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
            <h2 id="drawer-title" className="text-2xl font-bold text-primary">Saved Market Insights</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close insights drawer"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {savedInsights.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <p>No insights saved yet.</p>
              <p className="mt-2">Click on barrier badges to explore market entry strategies.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {savedInsights.map((insight) => (
                <div 
                  key={insight.id} 
                  className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{insight.marketName}</h3>
                      <span className="text-sm text-gray-500">
                        {insight.barrierType} - Level {insight.barrierLevel}
                      </span>
                    </div>
                    <button
                      onClick={() => onRemoveInsight(insight.id)}
                      className="text-gray-400 hover:text-red-500"
                      aria-label={`Remove ${insight.marketName} insights`}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Key Insights:</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {insight.insights.map((item, index) => (
                          <li key={index} className="text-sm text-gray-600">{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Entry Strategies:</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        {insight.strategies.map((strategy, index) => (
                          <li key={index} className="text-sm text-gray-600">{strategy}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            Save insights to help plan your market entry strategy
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsightsDrawer;

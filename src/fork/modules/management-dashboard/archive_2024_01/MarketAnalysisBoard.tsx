import React, { useState, useMemo } from 'react';
import Card from './components/Card';
import { cannabinoidMarketData } from './data';
import { MarketSegment } from './types';
import ComparisonChart from './charts/ComparisonChart';
import GrowthTrendChart from './charts/GrowthTrendChart';
import InsightsDrawer from './components/InsightsDrawer';
import { OpportunityCards } from './components/OpportunityCards';
import './styles.css';

interface MarketInsight {
  id: string;
  marketName: string;
  barrierLevel: number;
  barrierType: string;
  insights: string[];
  strategies: string[];
}

const MarketAnalysisBoard = () => {
  const [selectedSegments, setSelectedSegments] = useState<MarketSegment[]>([]);
  const [sortBy, setSortBy] = useState<'marketSize' | 'growthRate' | 'profitMargin'>('marketSize');
  const [filterBarriers, setFilterBarriers] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [savedInsights, setSavedInsights] = useState<MarketInsight[]>([]);

  // Get all segments with their barrier information
  const allSegments = useMemo(() => {
    const segments = cannabinoidMarketData.children || [];
    console.log('Loading segments:', segments.map(s => ({
      name: s.name,
      barrier: s.matrix?.rating?.barriers,
      matrix: s.matrix
    })));
    return segments;
  }, []);

  // Filter and sort segments
  const sortedSegments = useMemo(() => {
    // Start with all segments
    let segments = allSegments;
    
    // Apply barrier filter if selected
    if (filterBarriers !== null) {
      segments = segments.filter(segment => {
        const barrierLevel = segment.matrix?.rating?.barriers;
        console.log(`Filtering ${segment.name}: level=${barrierLevel}, target=${filterBarriers}`);
        return barrierLevel === filterBarriers;
      });
    }

    // Sort filtered segments
    return [...segments].sort((a, b) => {
      if (sortBy === 'marketSize') {
        return parseFloat(b.marketSize.replace(/[^0-9.]/g, '')) - 
               parseFloat(a.marketSize.replace(/[^0-9.]/g, ''));
      }
      if (sortBy === 'growthRate') {
        return parseFloat(b.growthRate) - parseFloat(a.growthRate);
      }
      return parseFloat(b.profitMargin) - parseFloat(a.profitMargin);
    });
  }, [sortBy, filterBarriers]);

  const toggleSegmentSelection = (segment: MarketSegment) => {
    if (selectedSegments.find(s => s.id === segment.id)) {
      setSelectedSegments(selectedSegments.filter(s => s.id !== segment.id));
    } else if (selectedSegments.length < 2) {
      setSelectedSegments([...selectedSegments, segment]);
    }
  };

  const handleSaveInsight = (insight: MarketInsight) => {
    setSavedInsights([...savedInsights, insight]);
    setIsDrawerOpen(true);
  };

  const handleRemoveInsight = (id: string) => {
    setSavedInsights(savedInsights.filter(insight => insight.id !== id));
  };

  const getMetricColor = (value: string) => {
    const numValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (numValue > 10) return 'metric-high';
    if (numValue > 5) return 'metric-medium';
    return 'metric-low';
  };

  const getBarrierLabel = (segment: MarketSegment) => {
    const value = segment.matrix?.rating?.barriers;
    if (!value) return 'Unknown';
    const labels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];
    return labels[value - 1];
  };

  const getBarrierBadgeClass = (value: number) => {
    return `barrier-badge barrier-badge-${value}`;
  };

  const getNaturalAnalysis = (segments: MarketSegment[]) => {
    const totalMarketSize = segments.reduce((sum, segment) => 
      sum + parseFloat(segment.marketSize.replace(/[^0-9.]/g, '')), 0
    );

    const avgGrowthRate = segments.reduce((sum, segment) =>
      sum + parseFloat(segment.growthRate), 0
    ) / segments.length;

    const barrierDistribution = segments.reduce((acc, segment) => {
      const level = segment.matrix?.rating?.barriers || 0;
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return {
      totalMarketSize,
      avgGrowthRate,
      barrierDistribution,
      highGrowthSegments: segments.filter(s => parseFloat(s.growthRate) > 10).length,
      lowBarrierSegments: segments.filter(s => (s.matrix?.rating?.barriers || 0) <= 2).length
    };
  };

  const analysis = getNaturalAnalysis(sortedSegments);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Controls */}
      <div className="control-section mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Market Analysis Controls</h2>
        <div className="control-group">
          <div className="select-container control-select">
            <label htmlFor="sortBy" className="control-label">
              Sort Segments By
            </label>
            <select
              id="sortBy"
              name="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort segments by metric"
            >
              <option value="marketSize">Market Size</option>
              <option value="growthRate">Growth Rate</option>
              <option value="profitMargin">Profit Margin</option>
            </select>
          </div>
          <div className="select-container control-select">
            <label htmlFor="barriers" className="control-label">
              Filter by Entry Barriers
            </label>
            <select
              id="barriers"
              name="barriers"
              value={filterBarriers || ''}
              onChange={(e) => {
                const value = e.target.value;
                const numValue = value === '' ? null : parseInt(value, 10);
                console.log('Setting barrier filter:', { raw: value, parsed: numValue });
                setFilterBarriers(numValue);
              }}
              aria-label="Filter by barrier level"
            >
              <option value="">All Barrier Levels</option>
              {[1, 2, 3, 4, 5].map(value => (
                <option key={value} value={value.toString()}>
                  {['Very Low', 'Low', 'Moderate', 'High', 'Very High'][value - 1]} 
                  ({value})
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            View Saved Insights ({savedInsights.length})
          </button>
        </div>
      </div>

      {/* Market Segments Grid */}
      {/* Market Segments Grid - Show total count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {sortedSegments.length} market segments
        {filterBarriers !== null && ` with ${['Very Low', 'Low', 'Moderate', 'High', 'Very High'][filterBarriers - 1]} barriers`}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedSegments.map((segment) => (
          <Card
            key={segment.id}
            className={`segment-card ${
              selectedSegments.find(s => s.id === segment.id)
                ? 'segment-card-selected'
                : 'segment-card-default'
            }`}
            onClick={() => toggleSegmentSelection(segment)}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">{segment.name}</h3>
              <span className={`metric-value ${getMetricColor(segment.growthRate)}`}>
                {segment.growthRate}
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="metric-card">
                  <div className="text-sm font-medium text-gray-600">Market Size</div>
                  <div className="text-lg font-bold text-gray-900">{segment.marketSize}</div>
                </div>
                <div className="metric-card">
                  <div className="text-sm font-medium text-gray-600">Profit Margin</div>
                  <div className="text-lg font-bold text-gray-900">{segment.profitMargin}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Entry Barriers */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Entry Barriers</span>
                    <span className={getBarrierBadgeClass(segment.matrix?.rating?.barriers || 0)}>
                      {getBarrierLabel(segment)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    Level {segment.matrix?.rating?.barriers} of 5
                  </div>
                  <div className="mt-2 space-y-2">
                    {(() => {
                      const barriers = segment.matrix?.rating?.barriers || 0;
                      switch(barriers) {
                        case 1:
                          return (
                            <>
                              <div className="text-sm">Simple approval process</div>
                              <div className="text-sm">Ready for new entrants</div>
                              <div className="text-sm">Low startup costs</div>
                            </>
                          );
                        case 2:
                          return (
                            <>
                              <div className="text-sm">Fast-growing market areas</div>
                              <div className="text-sm">Few existing competitors</div>
                              <div className="text-sm">Good time to enter market</div>
                            </>
                          );
                        case 3:
                          return (
                            <>
                              <div className="text-sm">Standard regulations to follow</div>
                              <div className="text-sm">Market needs education</div>
                              <div className="text-sm">Room for new solutions</div>
                            </>
                          );
                        case 4:
                          return (
                            <>
                              <div className="text-sm">Complex regulations</div>
                              <div className="text-sm">High investment needed</div>
                              <div className="text-sm">Partner support required</div>
                            </>
                          );
                        case 5:
                          return (
                            <>
                              <div className="text-sm">Strict regulations</div>
                              <div className="text-sm">Extensive market education needed</div>
                              <div className="text-sm">Limited market access</div>
                            </>
                          );
                        default:
                          return null;
                      }
                    })()}
                  </div>
                </div>

                {/* Market Analysis */}
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-2">Market Analysis</div>
                  <div className="space-y-1">
                    {(() => {
                      switch(segment.id) {
                        case "ptsd":
                          return (
                            <>
                                  <div className="mb-2">
                                    <div className="text-sm font-medium text-gray-700 mb-1">Market Opportunity</div>
                                    <div className="text-sm text-gray-600">Trauma-focused therapy integration</div>
                                    <div className="text-sm text-gray-600">Mental health service alignment</div>
                                    <div className="text-sm text-gray-600">Treatment resistance focus</div>
                                  </div>
                                  <div className="mb-2">
                                    <div className="text-sm font-medium text-gray-700 mb-1">Key Stakeholders</div>
                                    <div className="text-sm text-gray-600">Mental Health Teams</div>
                                    <div className="text-sm text-gray-600">Psychologists & Social Workers</div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-700 mb-1">Integration Support</div>
                                    <div className="text-sm text-gray-600">Expert in harm risk assessment</div>
                                    <div className="text-sm text-gray-600">Complex medication management</div>
                                    <div className="text-sm text-gray-600">Cannabis-aware treatment protocols</div>
                                  </div>
                                </>
                              );
                            case "sleep-disorders":
                              return (
                                <>
                                  <div className="mb-2">
                                    <div className="text-sm font-medium text-gray-700 mb-1">Market Opportunity</div>
                                    <div className="text-sm text-gray-600">Sleep clinic integration points</div>
                                    <div className="text-sm text-gray-600">Non-habit forming alternative</div>
                                    <div className="text-sm text-gray-600">Sleep quality improvement focus</div>
                                  </div>
                                  <div className="mb-2">
                                    <div className="text-sm font-medium text-gray-700 mb-1">Key Stakeholders</div>
                                    <div className="text-sm text-gray-600">Sleep Clinics & Mental Health</div>
                                    <div className="text-sm text-gray-600">Emergency Departments</div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-700 mb-1">Integration Support</div>
                                    <div className="text-sm text-gray-600">Long-term medication impact expertise</div>
                                    <div className="text-sm text-gray-600">Sleep hygiene and root causes</div>
                                    <div className="text-sm text-gray-600">Evidence-based risk assessment</div>
                                  </div>
                                </>
                              );
                            case "fibromyalgia":
                              return (
                                <>
                                  <div className="mb-2">
                                    <div className="text-sm font-medium text-gray-700 mb-1">Market Opportunity</div>
                                    <div className="text-sm text-gray-600">Chronic condition management</div>
                                    <div className="text-sm text-gray-600">Polypharmacy reduction potential</div>
                                    <div className="text-sm text-gray-600">Quality of life focus</div>
                                  </div>
                                  <div className="mb-2">
                                    <div className="text-sm font-medium text-gray-700 mb-1">Key Stakeholders</div>
                                    <div className="text-sm text-gray-600">Pain Management Teams</div>
                                    <div className="text-sm text-gray-600">Primary Care Networks</div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-700 mb-1">Integration Support</div>
                                    <div className="text-sm text-gray-600">NSAID cardiac/renal risk expertise</div>
                                    <div className="text-sm text-gray-600">Pain medication safety focus</div>
                                    <div className="text-sm text-gray-600">Alternative treatment pathways</div>
                                  </div>
                                </>
                              );
                            case "neuropathic-pain":
                              return (
                                <>
                                  <div className="mb-2">
                                    <div className="text-sm font-medium text-gray-700 mb-1">Market Opportunity</div>
                                    <div className="text-sm text-gray-600">Alternative to anticonvulsants</div>
                                    <div className="text-sm text-gray-600">Specialized pain management</div>
                                    <div className="text-sm text-gray-600">Neurological pathway integration</div>
                                  </div>
                                  <div className="mb-2">
                                    <div className="text-sm font-medium text-gray-700 mb-1">Key Stakeholders</div>
                                    <div className="text-sm text-gray-600">Neurology & Pain Teams</div>
                                    <div className="text-sm text-gray-600">Primary Care Networks</div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-700 mb-1">Your Expertise Fit</div>
                                    <div className="text-sm text-gray-600">Broad Clinical Experience</div>
                                    <div className="text-sm text-gray-600">Cost Analysis vs Standards</div>
                                    <div className="text-sm text-gray-600">Multi-Specialty Alignment</div>
                                  </div>
                                </>
                              );
                            case "autism":
                              return (
                                <>
                                  <div className="mb-2">
                                    <div className="text-sm font-medium text-gray-700 mb-1">Market Opportunity</div>
                                    <div className="text-sm text-gray-600">Behavioral intervention support</div>
                                    <div className="text-sm text-gray-600">Specialist pathway development</div>
                                    <div className="text-sm text-gray-600">Family support integration</div>
                                  </div>
                                  <div className="mb-2">
                                    <div className="text-sm font-medium text-gray-700 mb-1">Key Stakeholders</div>
                                    <div className="text-sm text-gray-600">Community Psychiatry Teams</div>
                                    <div className="text-sm text-gray-600">Safeguarding & Family Services</div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-700 mb-1">Your Expertise Fit</div>
                                    <div className="text-sm text-gray-600">Multi-Service Collaboration</div>
                                    <div className="text-sm text-gray-600">QI in Behavioral Interventions</div>
                                    <div className="text-sm text-gray-600">Cost-Effective Support Options</div>
                                  </div>
                                </>
                              );
                            default:
                              return null;
                      }
                    })()}
                  </div>
                </div>

                {/* Market Impact */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="space-y-4">
                    {/* Market Impact */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-600 mb-1">Market Share Potential</div>
                      <div className="font-medium text-lg text-indigo-700">
                        {(() => {
                          if (segment.keyMetric.includes('%')) {
                            return `${segment.keyMetric.split(' ')[0]} Market Share`;
                          }
                          if (segment.keyMetric.includes('£')) {
                            return 'Specialist Healthcare Segment';
                          }
                          return 'Growing Treatment Market';
                        })()}
                      </div>
                    </div>

                    {/* Healthcare Value */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-600 mb-1">Healthcare Value</div>
                      <div className="font-medium text-lg text-indigo-700">
                        {(() => {
                          if (segment.keyMetric.includes('£')) {
                            return `${segment.keyMetric.split(' ')[0]} Per Patient Savings`;
                          }
                          return `${segment.keyMetric.split(' ')[0]} Treatment Cost Reduction`;
                        })()}
                      </div>
                    </div>

                    {/* Market Analysis */}
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-2">Market Analysis</div>
                      <div className="space-y-1">
                        {(() => {
                          switch(segment.id) {
                            case "chronic-pain":
                              return (
                                <>
                                  <div className="mb-2">
                                    <div className="text-sm font-medium text-gray-700 mb-1">Market Opportunity</div>
                                    <div className="text-sm text-gray-600">Non-addictive alternative to opioids</div>
                                    <div className="text-sm text-gray-600">GP pathway integration potential</div>
                                    <div className="text-sm text-gray-600">Pain clinic protocol alignment</div>
                                  </div>
                                  <div className="mb-2">
                                    <div className="text-sm font-medium text-gray-700 mb-1">Key Stakeholders</div>
                                    <div className="text-sm text-gray-600">GPs and Pain Clinics</div>
                                    <div className="text-sm text-gray-600">Insurers and Regulators</div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-700 mb-1">Your Expertise Fit</div>
                                    <div className="text-sm text-gray-600">Palliative & Substance Use Experience</div>
                                    <div className="text-sm text-gray-600">A&E Background in Pain Management</div>
                                    <div className="text-sm text-gray-600">QI Skills for Cost Analysis</div>
                                  </div>
                                </>
                              );
                            case "cancer-treatment":
                              return (
                                <>
                                  <div className="mb-2">
                                    <div className="text-sm font-medium text-gray-700 mb-1">Market Opportunity</div>
                                    <div className="text-sm text-gray-600">Side-effect management focus</div>
                                    <div className="text-sm text-gray-600">Oncology integration pathways</div>
                                    <div className="text-sm text-gray-600">Quality of life improvement</div>
                                  </div>
                                  <div className="mb-2">
                                    <div className="text-sm font-medium text-gray-700 mb-1">Key Stakeholders</div>
                                    <div className="text-sm text-gray-600">Oncology Teams</div>
                                    <div className="text-sm text-gray-600">Palliative Care Units</div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-700 mb-1">Integration Support</div>
                                    <div className="text-sm text-gray-600">Established oncology protocols</div>
                                    <div className="text-sm text-gray-600">Symptom management expertise</div>
                                    <div className="text-sm text-gray-600">Quality metrics implementation</div>
                                  </div>
                                </>
                              );
                            case "anxiety-disorders":
                              return (
                                <>
                                  <div className="mb-2">
                                    <div className="text-sm font-medium text-gray-700 mb-1">Market Opportunity</div>
                                    <div className="text-sm text-gray-600">Primary care integration</div>
                                    <div className="text-sm text-gray-600">Reduced benzo dependency</div>
                                    <div className="text-sm text-gray-600">Mental health pathway alignment</div>
                                  </div>
                                  <div className="mb-2">
                                    <div className="text-sm font-medium text-gray-700 mb-1">Key Stakeholders</div>
                                    <div className="text-sm text-gray-600">GPs & Mental Health Teams</div>
                                    <div className="text-sm text-gray-600">Healthcare Payers</div>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium text-gray-700 mb-1">Integration Support</div>
                                    <div className="text-sm text-gray-600">Primary care pathway design</div>
                                    <div className="text-sm text-gray-600">Treatment monitoring systems</div>
                                    <div className="text-sm text-gray-600">Clinical guideline development</div>
                                  </div>
                                </>
                              );
                            default:
                              return null;
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Comparison Section */}
      {selectedSegments.length > 0 && (
        <div className="comparison-section">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Detailed Comparison</h2>
          
          {/* Visual Comparisons */}
          <div className="space-y-8 mb-8">
            <div className="chart-container">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Metric Comparison</h3>
              <ComparisonChart segments={selectedSegments} />
            </div>
            <div className="chart-container">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Growth Trajectory</h3>
              <GrowthTrendChart segments={selectedSegments} />
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {selectedSegments.map((segment) => (
              <div key={segment.id} className="space-y-6 p-6 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-indigo-700 pb-4 border-b border-gray-200">
                  {segment.name}
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="metric-card">
                    <div className="text-sm font-medium text-gray-600 mb-1">Market Size</div>
                    <div className="text-xl font-bold text-gray-900">{segment.marketSize}</div>
                  </div>
                  <div className="metric-card">
                    <div className="text-sm font-medium text-gray-600 mb-1">Growth Rate</div>
                    <div className="text-xl font-bold text-gray-900">{segment.growthRate}</div>
                  </div>
                  <div className="metric-card">
                    <div className="text-sm font-medium text-gray-600 mb-1">CAC</div>
                    <div className="text-xl font-bold text-gray-900">{segment.customerAcquisitionCost}</div>
                  </div>
                  <div className="metric-card">
                    <div className="text-sm font-medium text-gray-600 mb-1">LTV</div>
                    <div className="text-xl font-bold text-gray-900">{segment.lifetimeValue}</div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-sm font-medium text-gray-600 mb-3">5-Year Growth Projection</div>
                  <div className="flex items-center space-x-3 overflow-x-auto p-4 bg-white rounded-lg">
                    {segment.projectedGrowth.map((value, index) => (
                      <div key={index} className="flex items-center">
                        {index > 0 && (
                          <svg className="w-4 h-4 text-gray-400 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                          <span className={`metric-value ${getMetricColor(value.toString())}`}>
                          £{value}B
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Healthcare Investment Opportunities */}
      <div className="mt-12 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Healthcare Investment Opportunities</h2>
        <p className="text-gray-600 mb-8">
          Beyond the cannabis market's focus on medication reduction, these healthcare 
          opportunities represent distinct investment paths with their own ROI metrics 
          and implementation strategies. Each addresses specific healthcare system 
          inefficiencies through diagnostic improvements and care optimization.
        </p>
        <OpportunityCards />
      </div>

      <InsightsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        savedInsights={savedInsights}
        onRemoveInsight={handleRemoveInsight}
      />
    </div>
  );
};

export default MarketAnalysisBoard;

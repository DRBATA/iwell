import React, { useState, useMemo } from 'react';
import Card from './components/Card';
import { cannabinoidMarketData } from './data';
import { MarketSegment } from './types';
import ComparisonChart from './charts/ComparisonChart';
import GrowthTrendChart from './charts/GrowthTrendChart';
import BarrierTooltip from './components/BarrierTooltip';
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
  const [tooltipVisible, setTooltipVisible] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [savedInsights, setSavedInsights] = useState<MarketInsight[]>([]);

  const sortedSegments = useMemo(() => {
    let segments = [...(cannabinoidMarketData.children || [])];
    
    if (filterBarriers !== null) {
      segments = segments.filter(segment => 
        segment.matrix?.rating?.barriers === filterBarriers
      );
    }

    return segments.sort((a, b) => {
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

  const getBarrierLabel = (value: number) => {
    const labels = ['Very Low', 'Low', 'Moderate', 'High', 'Very High'];
    return labels[value - 1] || 'Unknown';
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
              onChange={(e) => setFilterBarriers(e.target.value ? Number(e.target.value) : null)}
              aria-label="Filter by barrier level"
            >
              <option value="">All Barrier Levels</option>
              {[1, 2, 3, 4, 5].map(value => (
                <option key={value} value={value}>{getBarrierLabel(value)}</option>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Entry Barriers</span>
                <div className="relative">
                  <span 
                    className={`${getBarrierBadgeClass(segment.matrix?.rating?.barriers || 0)} cursor-help`}
                    onMouseEnter={() => setTooltipVisible(segment.id)}
                    onMouseLeave={() => setTooltipVisible(null)}
                  >
                    {getBarrierLabel(segment.matrix?.rating?.barriers || 0)}
                  </span>
                  {tooltipVisible === segment.id && (
                    <BarrierTooltip 
                      barrierLevel={segment.matrix?.rating?.barriers || 0}
                      marketName={segment.name}
                      onSaveInsight={handleSaveInsight}
                    />
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm font-medium text-gray-600 mb-2">Key Performance Indicator</div>
                <div className="font-medium text-indigo-700">{segment.keyMetric}</div>
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

      {/* Natural Analysis Section */}
      <div className="natural-analysis">
        <h2>Natural Market Analysis</h2>
        <div className="analysis-grid">
          <div className="analysis-card">
            <h3>Market Overview</h3>
            <p>
              {selectedSegments.length > 0 ? (
                `The £${analysis.totalMarketSize.toFixed(1)}B cannabis market shows significant healthcare impact through: 
                ${selectedSegments.some(s => s.id === "chronic-pain") ? "30% reduction in opioid prescriptions, " : ""}
                ${selectedSegments.some(s => s.id === "anxiety-disorders") ? "£720 savings on benzodiazepines per patient, " : ""}
                ${selectedSegments.some(s => s.id === "ptsd") ? "20% reduction in psychiatric medication use, " : ""}
                ${selectedSegments.some(s => s.id === "sleep-disorders") ? "15% reduction in sleep aid usage, " : ""}
                demonstrating substantial medication reduction potential.`
              ) : (
                "Select market segments to see their impact on medication reduction and healthcare costs."
              )}
            </p>
            <div className="analysis-metric">
              <span>£{analysis.totalMarketSize.toFixed(1)}B</span>
              <small>Total Market Size</small>
            </div>
            <div className="analysis-metric">
              <span>£1-2B</span>
              <small>System-wide Impact</small>
            </div>
          </div>

          <div className="analysis-card">
            <h3>Growth Dynamics</h3>
            <p>
              Early cannabis intervention in treatment-resistant conditions shows 
              significant cost savings through reduced traditional medication 
              dependence and improved patient outcomes.
            </p>
            <div className="analysis-metric">
              <span>{analysis.avgGrowthRate.toFixed(1)}%</span>
              <small>Growth Rate</small>
            </div>
            <div className="analysis-metric">
              <span>£90K</span>
              <small>Per-Patient Impact</small>
            </div>
          </div>

          <div className="analysis-card">
            <h3>Entry Opportunity</h3>
            <p>
              Cannabis therapies show particular promise in conditions with limited 
              traditional treatment options, offering new pathways for patient care 
              and cost reduction.
            </p>
            <div className="analysis-metric">
              <span>{analysis.lowBarrierSegments}</span>
              <small>Accessible Segments</small>
            </div>
            <div className="analysis-metric">
              <span>5-10%</span>
              <small>Premium Impact</small>
            </div>
          </div>

          <div className="analysis-card">
            <h3>Market Dynamics</h3>
            <p>
              Strategic integration of cannabis therapies into existing treatment 
              protocols shows potential for £50-100M annual savings through reduced 
              traditional medication costs.
            </p>
            <div className="analysis-metric">
              <span>{analysis.highGrowthSegments}</span>
              <small>High Impact Segments</small>
            </div>
            <div className="analysis-metric">
              <span>£50-100M</span>
              <small>Annual Treatment Savings</small>
            </div>
          </div>

          <div className="analysis-card">
            <h3>Barrier Distribution</h3>
            <p>
              Current challenges include regulatory compliance requirements, varying regional 
              acceptance levels, and integration with existing healthcare protocols.
            </p>
            <div className="analysis-metric">
              <span>{Object.keys(analysis.barrierDistribution).length}</span>
              <small>Key Challenge Areas</small>
            </div>
            <div className="analysis-metric">
              <span>25%</span>
              <small>Avg Med Reduction</small>
            </div>
          </div>

          <div className="analysis-card">
            <h3>Strategic Approach</h3>
            <p>
              Success requires building clinical evidence bases, establishing dosing 
              standards, and developing partnerships with healthcare providers for 
              optimal patient outcomes.
            </p>
            <div className="analysis-metric">
              <span>{sortedSegments.length}</span>
              <small>Integrated Solutions</small>
            </div>
            <div className="analysis-metric">
              <span>£1.2B</span>
              <small>Medication Savings</small>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Healthcare Investment Opportunities */}
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

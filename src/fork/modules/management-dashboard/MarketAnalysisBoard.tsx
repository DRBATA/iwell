import React, { useState, useMemo } from 'react';
import Card from './components/Card';
import { cannabinoidMarketData } from './data';
import { MarketSegment } from './types';
import ComparisonChart from './charts/ComparisonChart';
import GrowthTrendChart from './charts/GrowthTrendChart';
import './styles.css';

const MarketAnalysisBoard = () => {
  const [selectedSegments, setSelectedSegments] = useState<MarketSegment[]>([]);
  const [sortBy, setSortBy] = useState<'marketSize' | 'growthRate' | 'profitMargin'>('marketSize');
  const [filterBarriers, setFilterBarriers] = useState<number | null>(null);

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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Controls */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-lg border-2 border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Market Analysis Controls</h2>
        <div className="flex flex-wrap gap-6 items-center">
          <div className="min-w-[200px]">
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
              Sort Segments By
            </label>
            <select
              id="sortBy"
              name="sortBy"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              aria-label="Sort segments by metric"
            >
              <option value="marketSize">Market Size</option>
              <option value="growthRate">Growth Rate</option>
              <option value="profitMargin">Profit Margin</option>
            </select>
          </div>
          <div className="min-w-[200px]">
            <label htmlFor="barriers" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Entry Barriers
            </label>
            <select
              id="barriers"
              name="barriers"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
          {selectedSegments.length > 0 && (
            <div className="text-sm font-medium text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full">
              {selectedSegments.length === 2 ? 
                'Click on segments to update comparison' :
                'Select another segment to compare (max 2)'}
            </div>
          )}
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
              
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-700">Entry Barriers</span>
                <span className={`barrier-badge barrier-badge-${segment.matrix?.rating?.barriers || 0}`}>
                  {getBarrierLabel(segment.matrix?.rating?.barriers || 0)}
                </span>
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
              <div key={segment.id} className="space-y-6 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
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
                  <div className="flex items-center space-x-3 overflow-x-auto p-4 bg-white rounded-lg border border-gray-200">
                    {segment.projectedGrowth.map((value, index) => (
                      <div key={index} className="flex items-center">
                        {index > 0 && (
                          <svg className="w-4 h-4 text-gray-400 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                        <span className={`metric-value ${getMetricColor(value.toString())}`}>
                          ${value}B
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
    </div>
  );
};

export default MarketAnalysisBoard;

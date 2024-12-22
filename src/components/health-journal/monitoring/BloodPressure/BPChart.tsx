import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HSJHealthData } from '../../../../lib/manifest/types';

// Extract the non-null reading type
type Reading = NonNullable<HSJHealthData['bloodPressure']>['readings'][0];

interface BPChartProps {
  readings: Reading[];
  onReadingClick: (reading: Reading) => void;
  validationLimits: {
    systolic: { min: number; max: number };
    diastolic: { min: number; max: number };
  };
}

export default function BPChart({ readings, onReadingClick, validationLimits }: BPChartProps) {
  const [viewType, setViewType] = useState<'week' | 'day'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter readings based on view type
  const filteredReadings = readings.filter(reading => {
    const readingDate = new Date(reading.timestamp);
    if (viewType === 'day') {
      return readingDate.toDateString() === currentDate.toDateString();
    } else {
      const weekAgo = new Date(currentDate);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return readingDate >= weekAgo && readingDate <= currentDate;
    }
  });

  // Sort readings by timestamp
  const sortedReadings = [...filteredReadings].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Calculate chart dimensions
  const chartHeight = 300;
  const chartWidth = containerRef.current?.clientWidth ?? 600;
  const padding = 40;

  // Calculate scales
  const xScale = (chartWidth - padding * 2) / (sortedReadings.length - 1 || 1);
  const yScale = (chartHeight - padding * 2) / 
    (validationLimits.systolic.max - validationLimits.systolic.min);

  // Generate paths
  const systolicPath = sortedReadings.map((reading, i) => 
    `${i === 0 ? 'M' : 'L'} ${padding + i * xScale} ${
      chartHeight - padding - (reading.systolic - validationLimits.systolic.min) * yScale
    }`
  ).join(' ');

  const diastolicPath = sortedReadings.map((reading, i) =>
    `${i === 0 ? 'M' : 'L'} ${padding + i * xScale} ${
      chartHeight - padding - (reading.diastolic - validationLimits.systolic.min) * yScale
    }`
  ).join(' ');

  return (
    <div ref={containerRef} className="w-full">
      {/* View Type Toggle */}
      <div className="flex justify-end mb-4 space-x-2">
        <button
          onClick={() => setViewType('day')}
          className={`px-3 py-1 rounded ${
            viewType === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
        >
          Day
        </button>
        <button
          onClick={() => setViewType('week')}
          className={`px-3 py-1 rounded ${
            viewType === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-100'
          }`}
        >
          Week
        </button>
      </div>

      {/* Chart */}
      <div className="relative" style={{ height: chartHeight }}>
        <svg width="100%" height={chartHeight}>
          {/* Grid lines */}
          {Array.from({ length: 6 }).map((_, i) => (
            <React.Fragment key={i}>
              <line
                x1={padding}
                y1={padding + i * (chartHeight - padding * 2) / 5}
                x2={chartWidth - padding}
                y2={padding + i * (chartHeight - padding * 2) / 5}
                stroke="#e5e7eb"
                strokeDasharray="4 4"
              />
              <text
                x={padding - 10}
                y={padding + i * (chartHeight - padding * 2) / 5}
                textAnchor="end"
                alignmentBaseline="middle"
                className="text-xs text-gray-500"
              >
                {Math.round(validationLimits.systolic.max - 
                  (i * (validationLimits.systolic.max - validationLimits.systolic.min) / 5))}
              </text>
            </React.Fragment>
          ))}

          {/* Paths */}
          <path
            d={systolicPath}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
          />
          <path
            d={diastolicPath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />

          {/* Data points */}
          {sortedReadings.map((reading, i) => (
            <g key={reading.id}>
              <circle
                cx={padding + i * xScale}
                cy={chartHeight - padding - 
                  (reading.systolic - validationLimits.systolic.min) * yScale}
                r="4"
                fill="#ef4444"
                className="cursor-pointer"
                onClick={() => onReadingClick(reading)}
              />
              <circle
                cx={padding + i * xScale}
                cy={chartHeight - padding - 
                  (reading.diastolic - validationLimits.systolic.min) * yScale}
                r="4"
                fill="#3b82f6"
                className="cursor-pointer"
                onClick={() => onReadingClick(reading)}
              />
            </g>
          ))}
        </svg>

        {/* Legend */}
        <div className="absolute top-0 right-0 flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2" />
            <span className="text-sm">Systolic</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
            <span className="text-sm">Diastolic</span>
          </div>
        </div>
      </div>
    </div>
  );
}

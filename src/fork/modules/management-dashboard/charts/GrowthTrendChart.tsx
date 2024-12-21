import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MarketSegment } from '../types';

interface GrowthTrendChartProps {
  segments: MarketSegment[];
}

const GrowthTrendChart = ({ segments }: GrowthTrendChartProps) => {
  const prepareData = () => {
    const years = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
    return years.map((year, index) => ({
      year,
      ...segments.reduce((acc, segment) => ({
        ...acc,
        [segment.name]: segment.projectedGrowth[index]
      }), {})
    }));
  };

  const colors = ['#4f46e5', '#06b6d4'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={prepareData()}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis 
          label={{ value: 'Market Size ($B)', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          formatter={(value: number) => `$${value}B`}
        />
        <Legend />
        {segments.map((segment, index) => (
          <Line
            key={segment.id}
            type="monotone"
            dataKey={segment.name}
            stroke={colors[index]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default GrowthTrendChart;

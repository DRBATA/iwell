import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MarketSegment } from '../types';

interface ComparisonChartProps {
  segments: MarketSegment[];
}

const ComparisonChart = ({ segments }: ComparisonChartProps) => {
  const parsePercentage = (value: string) => {
    return parseFloat(value.replace(/[^0-9.]/g, ''));
  };

  const prepareData = () => {
    const metrics = [
      { 
        key: 'marketSize', 
        label: 'Market Size ($B)', 
        getValue: (s: MarketSegment) => parseFloat(s.marketSize.replace(/[^0-9.]/g, '')),
        format: (value: number) => `$${value}B`
      },
      { 
        key: 'growthRate', 
        label: 'Growth Rate (%)', 
        getValue: (s: MarketSegment) => parsePercentage(s.growthRate),
        format: (value: number) => `${value}%`
      },
      { 
        key: 'profitMargin', 
        label: 'Profit Margin (%)', 
        getValue: (s: MarketSegment) => parsePercentage(s.profitMargin),
        format: (value: number) => `${value}%`
      },
      { 
        key: 'barriers', 
        label: 'Entry Barriers (1-5)', 
        getValue: (s: MarketSegment) => s.matrix?.rating?.barriers || 0,
        format: (value: number) => value.toString()
      },
    ];

    return metrics.map(metric => ({
      name: metric.label,
      format: metric.format,
      ...segments.reduce((acc, segment) => ({
        ...acc,
        [segment.name]: metric.getValue(segment)
      }), {})
    }));
  };

  const colors = ['#4f46e5', '#06b6d4'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={prepareData()}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={100} />
        <Tooltip 
          formatter={(value: number, name: string, props: any) => {
            return [props.payload.format(value), name];
          }}
        />
        <Legend />
        {segments.map((segment, index) => (
          <Bar
            key={segment.id}
            dataKey={segment.name}
            fill={colors[index]}
            name={segment.name}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ComparisonChart;

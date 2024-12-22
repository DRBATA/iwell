import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', consulting: 65000, training: 28000, implementation: 32000 },
  { month: 'Feb', consulting: 59000, training: 32000, implementation: 28000 },
  { month: 'Mar', consulting: 80000, training: 25000, implementation: 35000 },
  { month: 'Apr', consulting: 81000, training: 30000, implementation: 29000 },
  { month: 'May', consulting: 56000, training: 28000, implementation: 45000 },
  { month: 'Jun', consulting: 55000, training: 35000, implementation: 40000 },
];

const RevenueChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip 
          formatter={(value) => `$${value.toLocaleString()}`}
        />
        <Legend />
        <Bar dataKey="consulting" name="Consulting" fill="#4f46e5" />
        <Bar dataKey="training" name="Training" fill="#06b6d4" />
        <Bar dataKey="implementation" name="Implementation" fill="#8b5cf6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;

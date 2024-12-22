import React from 'react';
import { 
  ComposedChart, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  Bar, 
  Cell,
  ResponsiveContainer 
} from 'recharts';

const data = [
  {
    project: 'Digital Transformation',
    completion: 85,
    status: 'active',
    duration: 120
  },
  {
    project: 'Process Optimization',
    completion: 100,
    status: 'completed',
    duration: 90
  },
  {
    project: 'Market Analysis',
    completion: 60,
    status: 'active',
    duration: 60
  },
  {
    project: 'Strategy Planning',
    completion: 30,
    status: 'active',
    duration: 45
  },
  {
    project: 'Team Training',
    completion: 100,
    status: 'completed',
    duration: 30
  }
];

const ProjectTimeline = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        layout="vertical"
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 100,
          bottom: 5,
        }}
      >
        <XAxis type="number" domain={[0, 100]} />
        <YAxis dataKey="project" type="category" scale="band" />
        <Tooltip 
          formatter={(value, name) => {
            if (name === 'completion') return `${value}% Complete`;
            return `${value} days`;
          }}
        />
        <Legend />
        <Bar dataKey="completion" name="Completion %" barSize={20}>
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`}
              fill={entry.status === 'completed' ? '#10b981' : '#6366f1'}
            />
          ))}
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default ProjectTimeline;

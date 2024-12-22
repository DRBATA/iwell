import React from 'react';
import { Card } from '../ui/card';
import RevenueChart from './charts/RevenueChart';
import ProjectTimeline from './charts/ProjectTimeline';

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Management Consultancy Dashboard</h1>
        <p className="text-gray-600">Business Intelligence Overview</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Revenue Metrics */}
        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-2">Revenue Overview</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Monthly Revenue</span>
              <span className="font-medium">$120,000</span>
            </div>
            <div className="flex justify-between">
              <span>YTD Revenue</span>
              <span className="font-medium">$1,450,000</span>
            </div>
          </div>
        </Card>

        {/* Project Metrics */}
        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-2">Project Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Active Projects</span>
              <span className="font-medium">8</span>
            </div>
            <div className="flex justify-between">
              <span>Completed This Month</span>
              <span className="font-medium">3</span>
            </div>
          </div>
        </Card>

        {/* Client Metrics */}
        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-2">Client Overview</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Clients</span>
              <span className="font-medium">24</span>
            </div>
            <div className="flex justify-between">
              <span>New This Quarter</span>
              <span className="font-medium">5</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Analytics Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-4">Revenue Distribution</h3>
          <div className="h-64">
            <RevenueChart />
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-4">Project Timeline</h3>
          <div className="h-64">
            <ProjectTimeline />
          </div>
        </Card>
      </div>

      {/* KPI Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-2">Utilization Rate</h3>
          <div className="text-3xl font-bold text-indigo-600">87%</div>
          <p className="text-sm text-gray-600 mt-1">Team Efficiency</p>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-2">Average Project Value</h3>
          <div className="text-3xl font-bold text-cyan-600">$85,000</div>
          <p className="text-sm text-gray-600 mt-1">Per Engagement</p>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-2">Client Satisfaction</h3>
          <div className="text-3xl font-bold text-purple-600">4.8/5.0</div>
          <p className="text-sm text-gray-600 mt-1">Average Rating</p>
        </Card>

        <Card className="p-4">
          <h3 className="font-semibold text-lg mb-2">Pipeline Value</h3>
          <div className="text-3xl font-bold text-emerald-600">$2.4M</div>
          <p className="text-sm text-gray-600 mt-1">Potential Revenue</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

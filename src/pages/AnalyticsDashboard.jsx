// AnalyticsDashboard.jsx
import React from 'react';
import BarChart from "./BarChart"
import LineChart from './LineChart';
import RadarChart from './RadarChart';
import ScatterChart from './ScatterChart';

const AnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Analytics Dashboard</h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-900 mb-4">Emotional Impact by Event Type</h3>
              <div className="h-64">
                <RadarChart />
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-900 mb-4">Weather-Mood Correlation</h3>
              <div className="h-64">
                <ScatterChart />
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-900 mb-4">Client Satisfaction Trends</h3>
              <div className="h-64">
                <LineChart />
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-medium text-gray-900 mb-4">Revenue by Event Category</h3>
              <div className="h-64">
                <BarChart />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Key Performance Indicators</h2>
          <div>
            <select className="border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <option>Last 12 Months</option>
              <option>Last 6 Months</option>
              <option>Last 3 Months</option>
              <option>This Month</option>
            </select>
          </div>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: 'Average Satisfaction', value: '94%', trend: '+2.1%', status: 'increase' },
              { name: 'Client Retention', value: '87%', trend: '+5.8%', status: 'increase' },
              { name: 'Cost Per Attendee', value: '$142', trend: '-3.2%', status: 'decrease' },
              { name: 'Emotional Impact Score', value: '4.7/5', trend: '+0.2', status: 'increase' },
              { name: 'Weather Adaptation Success', value: '92%', trend: '+4.7%', status: 'increase' },
              { name: 'ROI Average', value: '385%', trend: '+12.4%', status: 'increase' },
              { name: 'Attendee Engagement', value: '78%', trend: '+8.3%', status: 'increase' },
              { name: 'New Client Acquisition', value: '36', trend: '+22%', status: 'increase' }
            ].map((kpi, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <dt className="text-sm font-medium text-gray-500">{kpi.name}</dt>
                <dd className="mt-1 flex items-baseline justify-between md:block lg:flex">
                  <div className="flex items-baseline text-2xl font-semibold text-gray-900">
                    {kpi.value}
                  </div>
                  <div className={`${
                    kpi.status === 'increase' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  } inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium md:mt-2 lg:mt-0`}>
                    {kpi.status === 'increase' ? '↑' : '↓'} {kpi.trend}
                  </div>
                </dd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

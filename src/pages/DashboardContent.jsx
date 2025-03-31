import React from 'react';
import { 
  Calendar, 
  Users, 
  TrendingUp,
  DollarSign, 
  Cloud 
} from 'lucide-react';

// Import chart components
import BarChart from './BarChart';
import LineChart from './LineChart';
import RadarChart from './RadarChart';
import ScatterChart from './ScatterChart';

const DashboardContent = () => {
  const metrics = [
    { name: 'Total Events', value: '42', change: '+22%', icon: Calendar, color: 'bg-blue-500' },
    { name: 'Total Clients', value: '128', change: '+8%', icon: Users, color: 'bg-green-500' },
    { name: 'Total Revenue', value: '$528,690', change: '+15%', icon: DollarSign, color: 'bg-indigo-500' },
    { name: 'Avg. Satisfaction', value: '94%', change: '+2%', icon: TrendingUp, color: 'bg-purple-500' },
  ];
  
  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.name} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${metric.color}`}>
                  <metric.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{metric.name}</dt>
                    <dd>
                      <div className="text-lg font-semibold text-gray-900">{metric.value}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm text-green-600">
                {metric.change} from previous period
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Charts - Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Revenue Trends</h2>
          </div>
          <div className="p-5">
            <div className="relative h-80">
              <div className="absolute inset-0 flex items-center justify-center">
                <BarChart />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Event Attendance</h2>
          </div>
          <div className="p-5">
            <div className="relative h-80">
              <div className="absolute inset-0 flex items-center justify-center">
                <LineChart />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts - Row 2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow">
          <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Emotional Impact Analysis</h2>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">Unique Feature</span>
          </div>
          <div className="p-5">
            <div className="relative h-80">
              <div className="absolute inset-0 flex items-center justify-center">
                <RadarChart />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow">
          <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Weather-Mood Correlation</h2>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">Unique Feature</span>
          </div>
          <div className="p-5">
            <div className="relative h-80">
              <div className="absolute inset-0 flex items-center justify-center">
                <ScatterChart />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Upcoming Events */}
      <div className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow">
        <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Upcoming Events</h2>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">View All</button>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Annual Tech Conference', date: 'Apr 15-17, 2025', location: 'San Francisco', status: 'Planning', weather: 'Sunny', mood: 'Excited' },
              { title: 'Product Launch', date: 'Mar 5, 2025', location: 'Virtual Event', status: 'Confirmed', weather: 'N/A', mood: 'Anticipation' },
              { title: 'Leadership Summit', date: 'Jun 12, 2025', location: 'Chicago', status: 'Planning', weather: 'Partly Cloudy', mood: 'Focused' }
            ].map((event, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow hover:border-indigo-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-medium text-gray-900">{event.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{event.date}</p>
                    <p className="mt-1 text-sm text-gray-500">{event.location}</p>
                    <div className="mt-2 flex space-x-2">
                      <span className="inline-flex items-center text-xs text-gray-500">
                        <Cloud className="h-3 w-3 mr-1" /> {event.weather}
                      </span>
                      <span className="inline-flex items-center text-xs text-gray-500">
                        <TrendingUp className="h-3 w-3 mr-1" /> {event.mood}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    event.status === 'Planning' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
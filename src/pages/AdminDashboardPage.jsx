import React, { useState } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Search,
  TrendingUp,
  DollarSign,
  Cloud
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen overflow-hidden">
        <Sidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
        />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          
          <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6">
            <DashboardContent />
          </main>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigation = [
    { name: 'Dashboard', icon: BarChart3 },
    { name: 'Events', icon: Calendar },
    { name: 'Clients', icon: Users },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <>
      <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-20 transition-opacity md:hidden ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)} />

      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform md:translate-x-0 md:relative md:z-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <span className="text-xl font-bold text-indigo-600">Sentinent Stories</span>
          </div>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        <div className="flex flex-col h-0 flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4">
            <div className="space-y-1">
              {navigation.map((item, index) => (
                <button
                  key={item.name}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    index === 0
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${
                    index === 0 ? 'text-indigo-500' : 'text-gray-400'
                  }`} />
                  {item.name}
                </button>
              ))}
            </div>
          </nav>
          
          <div className="p-4 border-t border-gray-200">
            <button className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50">
              <LogOut className="mr-3 h-5 w-5 text-red-500" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="ml-4 md:ml-0">
              <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <button className="ml-4 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
              <Bell className="h-6 w-6" />
            </button>
            
            <div className="ml-4 relative flex-shrink-0">
              <div>
                <button className="bg-white rounded-full flex items-center focus:outline-none">
                  <img
                    className="h-8 w-8 rounded-full"
                    src="/api/placeholder/32/32"
                    alt="User avatar"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const DashboardContent = () => {
  const metrics = [
    { name: 'Total Events', value: '42', change: '+22%', icon: Calendar, color: 'bg-blue-500' },
    { name: 'Total Clients', value: '128', change: '+8%', icon: Users, color: 'bg-green-500' },
    { name: 'Total Revenue', value: '$528,690', change: '+15%', icon: DollarSign, color: 'bg-indigo-500' },
    { name: 'Avg. Satisfaction', value: '94%', change: '+2%', icon: TrendingUp, color: 'bg-purple-500' },
  ];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.name} className="bg-white overflow-hidden shadow rounded-lg">
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
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg overflow-hidden">
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
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
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
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Emotional Impact Analysis</h2>
          </div>
          <div className="p-5">
            <div className="relative h-80">
              <div className="absolute inset-0 flex items-center justify-center">
                <RadarChart />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Weather-Mood Correlation</h2>
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
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Upcoming Events</h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Annual Tech Conference', date: 'Apr 15-17, 2025', location: 'San Francisco', status: 'Planning' },
              { title: 'Product Launch', date: 'Mar 5, 2025', location: 'Virtual Event', status: 'Confirmed' },
              { title: 'Leadership Summit', date: 'Jun 12, 2025', location: 'Chicago', status: 'Planning' }
            ].map((event, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-medium text-gray-900">{event.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{event.date}</p>
                    <p className="mt-1 text-sm text-gray-500">{event.location}</p>
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

const BarChart = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 250">
      <g transform="translate(40, 20)">
        <line x1="0" y1="200" x2="320" y2="200" stroke="#e5e7eb" strokeWidth="1" />
        
        <g transform="translate(0, 200)">
          <text x="20" y="20" textAnchor="middle" fontSize="12" fill="#6b7280">Q1</text>
          <text x="80" y="20" textAnchor="middle" fontSize="12" fill="#6b7280">Q2</text>
          <text x="140" y="20" textAnchor="middle" fontSize="12" fill="#6b7280">Q3</text>
          <text x="200" y="20" textAnchor="middle" fontSize="12" fill="#6b7280">Q4</text>
          <text x="260" y="20" textAnchor="middle" fontSize="12" fill="#6b7280">Q1</text>
        </g>
        
        <g>
          <text x="-10" y="200" textAnchor="end" fontSize="12" fill="#6b7280">0</text>
          <text x="-10" y="150" textAnchor="end" fontSize="12" fill="#6b7280">25K</text>
          <text x="-10" y="100" textAnchor="end" fontSize="12" fill="#6b7280">50K</text>
          <text x="-10" y="50" textAnchor="end" fontSize="12" fill="#6b7280">75K</text>
          <text x="-10" y="10" textAnchor="end" fontSize="12" fill="#6b7280">100K</text>
        </g>
        
        <rect x="10" y="120" width="20" height="80" fill="#818cf8" rx="2" />
        <rect x="70" y="100" width="20" height="100" fill="#818cf8" rx="2" />
        <rect x="130" y="80" width="20" height="120" fill="#818cf8" rx="2" />
        <rect x="190" y="60" width="20" height="140" fill="#818cf8" rx="2" />
        <rect x="250" y="40" width="20" height="160" fill="#818cf8" rx="2" />
      </g>
    </svg>
  );
};

const LineChart = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 250">
      <g transform="translate(40, 20)">
        <line x1="0" y1="200" x2="320" y2="200" stroke="#e5e7eb" strokeWidth="1" />
        
        <g transform="translate(0, 200)">
          <text x="0" y="20" textAnchor="middle" fontSize="12" fill="#6b7280">Jan</text>
          <text x="60" y="20" textAnchor="middle" fontSize="12" fill="#6b7280">Feb</text>
          <text x="120" y="20" textAnchor="middle" fontSize="12" fill="#6b7280">Mar</text>
          <text x="180" y="20" textAnchor="middle" fontSize="12" fill="#6b7280">Apr</text>
          <text x="240" y="20" textAnchor="middle" fontSize="12" fill="#6b7280">May</text>
          <text x="300" y="20" textAnchor="middle" fontSize="12" fill="#6b7280">Jun</text>
        </g>
        
        <g>
          <text x="-10" y="200" textAnchor="end" fontSize="12" fill="#6b7280">0</text>
          <text x="-10" y="150" textAnchor="end" fontSize="12" fill="#6b7280">200</text>
          <text x="-10" y="100" textAnchor="end" fontSize="12" fill="#6b7280">400</text>
          <text x="-10" y="50" textAnchor="end" fontSize="12" fill="#6b7280">600</text>
          <text x="-10" y="10" textAnchor="end" fontSize="12" fill="#6b7280">800</text>
        </g>
        
        <polyline 
          points="0,180 60,150 120,170 180,120 240,90 300,60" 
          fill="none" 
          stroke="#4f46e5" 
          strokeWidth="3" 
        />
        
        <circle cx="0" cy="180" r="4" fill="#4f46e5" />
        <circle cx="60" cy="150" r="4" fill="#4f46e5" />
        <circle cx="120" cy="170" r="4" fill="#4f46e5" />
        <circle cx="180" cy="120" r="4" fill="#4f46e5" />
        <circle cx="240" cy="90" r="4" fill="#4f46e5" />
        <circle cx="300" cy="60" r="4" fill="#4f46e5" />
      </g>
    </svg>
  );
};

const RadarChart = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 250">
      <g transform="translate(200, 125)">
        <polygon points="0,-100 86.6,-50 86.6,50 0,100 -86.6,50 -86.6,-50" fill="none" stroke="#e5e7eb" strokeWidth="1" />
        <polygon points="0,-75 65,-37.5 65,37.5 0,75 -65,37.5 -65,-37.5" fill="none" stroke="#e5e7eb" strokeWidth="1" />
        <polygon points="0,-50 43.3,-25 43.3,25 0,50 -43.3,25 -43.3,-25" fill="none" stroke="#e5e7eb" strokeWidth="1" />
        <polygon points="0,-25 21.7,-12.5 21.7,12.5 0,25 -21.7,12.5 -21.7,-12.5" fill="none" stroke="#e5e7eb" strokeWidth="1" />
        
        <line x1="0" y1="0" x2="0" y2="-100" stroke="#e5e7eb" strokeWidth="1" />
        <line x1="0" y1="0" x2="86.6" y2="-50" stroke="#e5e7eb" strokeWidth="1" />
        <line x1="0" y1="0" x2="86.6" y2="50" stroke="#e5e7eb" strokeWidth="1" />
        <line x1="0" y1="0" x2="0" y2="100" stroke="#e5e7eb" strokeWidth="1" />
        <line x1="0" y1="0" x2="-86.6" y2="50" stroke="#e5e7eb" strokeWidth="1" />
        <line x1="0" y1="0" x2="-86.6" y2="-50" stroke="#e5e7eb" strokeWidth="1" />
        
        <text x="0" y="-110" textAnchor="middle" fontSize="12" fill="#6b7280">Excitement</text>
        <text x="96" y="-50" textAnchor="start" fontSize="12" fill="#6b7280">Wonder</text>
        <text x="96" y="55" textAnchor="start" fontSize="12" fill="#6b7280">Joy</text>
        <text x="0" y="115" textAnchor="middle" fontSize="12" fill="#6b7280">Satisfaction</text>
        <text x="-96" y="55" textAnchor="end" fontSize="12" fill="#6b7280">Trust</text>
        <text x="-96" y="-50" textAnchor="end" fontSize="12" fill="#6b7280">Anticipation</text>
        
        <polygon 
          points="0,-80 69.3,-30 60.6,40 0,70 -73.6,35 -60.6,-40" 
          fill="rgba(79, 70, 229, 0.2)" 
          stroke="#4f46e5" 
          strokeWidth="2" 
        />
        
        <circle cx="0" cy="-80" r="4" fill="#4f46e5" />
        <circle cx="69.3" cy="-30" r="4" fill="#4f46e5" />
        <circle cx="60.6" cy="40" r="4" fill="#4f46e5" />
        <circle cx="0" cy="70" r="4" fill="#4f46e5" />
        <circle cx="-73.6" cy="35" r="4" fill="#4f46e5" />
        <circle cx="-60.6" cy="-40" r="4" fill="#4f46e5" />
      </g>
    </svg>
  );
};

const ScatterChart = () => {
  const points = [
    { x: 30, y: 50, weather: 'Sunny', mood: 'Energetic' },
    { x: 70, y: 80, weather: 'Sunny', mood: 'Joyful' },
    { x: 120, y: 40, weather: 'Sunny', mood: 'Excited' },
    { x: 160, y: 100, weather: 'Sunny', mood: 'Inspired' },
    { x: 50, y: 150, weather: 'Rainy', mood: 'Reflective' },
    { x: 100, y: 130, weather: 'Rainy', mood: 'Calm' },
    { x: 140, y: 160, weather: 'Rainy', mood: 'Nostalgic' },
    { x: 200, y: 120, weather: 'Rainy', mood: 'Relaxed' },
    { x: 230, y: 70, weather: 'Cloudy', mood: 'Focused' },
    { x: 260, y: 110, weather: 'Cloudy', mood: 'Thoughtful' },
    { x: 220, y: 30, weather: 'Cloudy', mood: 'Creative' },
    { x: 190, y: 60, weather: 'Cloudy', mood: 'Productive' },
  ];
  
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 250">
      <g transform="translate(40, 20)">
        <line x1="0" y1="200" x2="320" y2="200" stroke="#e5e7eb" strokeWidth="1" />
        <line x1="0" y1="0" x2="0" y2="200" stroke="#e5e7eb" strokeWidth="1" />
        
        <text x="160" y="230" textAnchor="middle" fontSize="12" fill="#6b7280">Weather Conditions</text>
        <text x="-30" y="100" textAnchor="middle" fontSize="12" fill="#6b7280" transform="rotate(-90, -30, 100)">Mood Impact</text>
        
        {points.map((point, i) => (
          <g key={i}>
            <circle 
              cx={point.x} 
              cy={point.y} 
              r="6" 
              fill={
                point.weather === 'Sunny' ? '#fcd34d' : 
                point.weather === 'Rainy' ? '#60a5fa' : 
                '#9ca3af'
              }
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          </g>
        ))}
        
        <g transform="translate(200, 20)">
          <circle cx="0" cy="0" r="6" fill="#fcd34d" stroke="#ffffff" strokeWidth="1.5" />
          <text x="10" y="4" fontSize="10" fill="#6b7280">Sunny</text>
          
          <circle cx="0" cy="20" r="6" fill="#60a5fa" stroke="#ffffff" strokeWidth="1.5" />
          <text x="10" y="24" fontSize="10" fill="#6b7280">Rainy</text>
          
          <circle cx="0" cy="40" r="6" fill="#9ca3af" stroke="#ffffff" strokeWidth="1.5" />
          <text x="10" y="44" fontSize="10" fill="#6b7280">Cloudy</text>
        </g>
      </g>
    </svg>
  );
};

export default AdminDashboardPage;
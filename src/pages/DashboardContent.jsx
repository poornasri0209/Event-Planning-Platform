import React, { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Package, 
  Briefcase, 
  MessageSquare,
  Star
} from 'lucide-react';

// Import chart components 
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const DashboardContent = () => {
  // State for KPI metrics
  const [metrics, setMetrics] = useState({
    totalVendors: 0,
    totalClients: 0,
    totalEvents: 0,
    totalRevenue: 0,
    totalResources: 0,
    totalFeedbacks: 0
  });

  // State for chart data
  const [eventsData, setEventsData] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);

  // State for loading
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Function to fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch totals for KPI cards
      await Promise.all([
        fetchVendorsTotal(),
        fetchClientsTotal(),
        fetchEventsTotal(),
        fetchRevenueTotal(),
        fetchResourcesTotal(),
        fetchFeedbacksTotal()
      ]);
      
      // Fetch data for charts
      await Promise.all([
        fetchEventsData(),
        fetchFeedbackData()
      ]);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
      setLoading(false);
    }
  };

  // Function to fetch total vendors
  const fetchVendorsTotal = async () => {
    try {
      const vendorsQuery = query(collection(db, 'vendors'));
      const querySnapshot = await getDocs(vendorsQuery);
      
      setMetrics(prev => ({
        ...prev,
        totalVendors: querySnapshot.size
      }));
    } catch (error) {
      console.error('Error fetching vendors total:', error);
    }
  };

  // Function to fetch total clients
  const fetchClientsTotal = async () => {
    try {
      const clientsQuery = query(collection(db, 'users'));
      const querySnapshot = await getDocs(clientsQuery);
      
      setMetrics(prev => ({
        ...prev,
        totalClients: querySnapshot.size
      }));
    } catch (error) {
      console.error('Error fetching clients total:', error);
    }
  };

  // Function to fetch total events
  const fetchEventsTotal = async () => {
    try {
      const eventsQuery = query(collection(db, 'events'));
      const querySnapshot = await getDocs(eventsQuery);
      
      setMetrics(prev => ({
        ...prev,
        totalEvents: querySnapshot.size
      }));
    } catch (error) {
      console.error('Error fetching events total:', error);
    }
  };

  // Function to fetch total revenue
  const fetchRevenueTotal = async () => {
    try {
      const eventsQuery = query(collection(db, 'events'));
      const querySnapshot = await getDocs(eventsQuery);
      
      let total = 0;
      querySnapshot.forEach(doc => {
        const event = doc.data();
        if (event.paymentAmount) {
          total += parseFloat(event.paymentAmount);
        } else if (event.budget) {
          // If paymentAmount is not available, use budget as fallback
          total += parseFloat(event.budget);
        }
      });
      
      setMetrics(prev => ({
        ...prev,
        totalRevenue: total
      }));
    } catch (error) {
      console.error('Error fetching revenue total:', error);
    }
  };

  // Function to fetch total resources
  const fetchResourcesTotal = async () => {
    try {
      const resourcesQuery = query(collection(db, 'resources'));
      const querySnapshot = await getDocs(resourcesQuery);
      
      setMetrics(prev => ({
        ...prev,
        totalResources: querySnapshot.size
      }));
    } catch (error) {
      console.error('Error fetching resources total:', error);
    }
  };

  // Function to fetch total feedbacks
  const fetchFeedbacksTotal = async () => {
    try {
      const feedbacksQuery = query(collection(db, 'feedbacks'));
      const querySnapshot = await getDocs(feedbacksQuery);
      
      setMetrics(prev => ({
        ...prev,
        totalFeedbacks: querySnapshot.size
      }));
    } catch (error) {
      console.error('Error fetching feedbacks total:', error);
    }
  };

  // Function to fetch events data for chart
  const fetchEventsData = async () => {
    try {
      // Get events and group by status
      const eventsQuery = query(collection(db, 'events'));
      const querySnapshot = await getDocs(eventsQuery);
      
      const statusCounts = {
        'In Progress': 0,
        'Completed': 0,
        'Cancelled': 0,
        'Upcoming': 0
      };
      
      querySnapshot.forEach(doc => {
        const event = doc.data();
        if (event.status && statusCounts.hasOwnProperty(event.status)) {
          statusCounts[event.status]++;
        }
      });
      
      const data = Object.keys(statusCounts).map(status => ({
        name: status,
        value: statusCounts[status]
      }));
      
      setEventsData(data);
    } catch (error) {
      console.error('Error fetching events data:', error);
    }
  };

  // Function to fetch feedback data for chart
  const fetchFeedbackData = async () => {
    try {
      // Get feedbacks and categorize by rating
      const feedbacksQuery = query(collection(db, 'feedbacks'));
      const querySnapshot = await getDocs(feedbacksQuery);
      
      const ratings = {
        '5 Stars': 0,
        '4 Stars': 0,
        '3 Stars': 0,
        '2 Stars': 0,
        '1 Star': 0
      };
      
      querySnapshot.forEach(doc => {
        const feedback = doc.data();
        if (feedback.rating) {
          const rating = Math.round(parseFloat(feedback.rating));
          const ratingKey = rating === 1 ? '1 Star' : `${rating} Stars`;
          
          if (ratings.hasOwnProperty(ratingKey)) {
            ratings[ratingKey]++;
          }
        }
      });
      
      const data = Object.keys(ratings).map(rating => ({
        name: rating,
        value: ratings[rating]
      }));
      
      setFeedbackData(data);
    } catch (error) {
      console.error('Error fetching feedback data:', error);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Define colors for charts
  const COLORS = ['#4f46e5', '#60a5fa', '#818cf8', '#a5b4fc', '#c7d2fe'];

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Dashboard Overview</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              {/* Vendors KPI */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                      <Briefcase className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Vendors</dt>
                        <dd>
                          <div className="text-lg font-semibold text-gray-900">{metrics.totalVendors}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clients KPI */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                      <Users className="h-4 w-6 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                        <dd>
                          <div className="text-lg font-semibold text-gray-900">{metrics.totalClients}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Events KPI */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                      <Calendar className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Events</dt>
                        <dd>
                          <div className="text-lg font-semibold text-gray-900">{metrics.totalEvents}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue KPI */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                        <dd>
                          <div className="text-lg font-semibold text-gray-900">{formatCurrency(metrics.totalRevenue)}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resources KPI */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                      <Package className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Resources</dt>
                        <dd>
                          <div className="text-lg font-semibold text-gray-900">{metrics.totalResources}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feedbacks KPI */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                      <MessageSquare className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Feedbacks</dt>
                        <dd>
                          <div className="text-lg font-semibold text-gray-900">{metrics.totalFeedbacks}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Events by Status Chart */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-5 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Events by Status</h3>
                </div>
                <div className="p-5">
                  <div className="h-80">
                    {eventsData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={eventsData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {eventsData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value, name, props) => [`${value} events`, name]} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-gray-500">No event data available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Feedback Ratings Chart */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-5 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Feedback Ratings</h3>
                </div>
                <div className="p-5">
                  <div className="h-80">
                    {feedbackData.length > 0 && feedbackData.some(item => item.value > 0) ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={feedbackData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" />
                          <Tooltip formatter={(value) => [`${value} feedbacks`, 'Count']} />
                          <Legend />
                          <Bar dataKey="value" fill="#818cf8">
                            {feedbackData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-gray-500">No feedback data available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;
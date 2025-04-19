import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Calendar, 
  Download, 
  Filter,
  ChevronDown,
  Users,
  CreditCard,
  User,
  Check,
  X
} from 'lucide-react';
import { collection, query, getDocs, orderBy, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

const FinancialManagement = () => {
  // State for financial data
  const [financialStats, setFinancialStats] = useState({
    totalRevenue: 0,
    totalVendorResourceCosts: 0,
    netProfit: 0,
    revenueGrowth: 0,
    profitGrowth: 0
  });
  
  // State for payment data
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  
  // State for loading/error handling
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  
  // Custom date range
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // State for detailed payment view
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchFinancialData();
    fetchPaymentData();
  }, []);

  // Apply filters and sorting when relevant state changes
  useEffect(() => {
    filterAndSortPayments();
  }, [searchQuery, dateRange, sortBy, payments, startDate, endDate]);

  // Function to fetch financial data
  const fetchFinancialData = async () => {
    try {
      setStatsLoading(true);
      
      // Fetch all events to calculate financial stats
      const eventsRef = collection(db, 'events');
      const eventsQuery = query(eventsRef);
      const eventsSnapshot = await getDocs(eventsQuery);
      
      let totalRevenue = 0;
      let totalVendorResourceCosts = 0;
      let netProfit = 0;
      
      // Calculate the stats from events data
      eventsSnapshot.forEach(doc => {
        const event = doc.data();
        
        // Add payment amount to total revenue
        if (event.paymentAmount) {
          totalRevenue += parseFloat(event.paymentAmount);
        }
        
        // Add vendor costs
        if (event.vendor && event.vendor.budget) {
          const vendorBudget = parseFloat(event.vendor.budget.replace(/[^0-9.-]+/g, ''));
          if (!isNaN(vendorBudget)) {
            totalVendorResourceCosts += vendorBudget;
          }
        }
        
        // Add resources costs
        if (event.resourcesBudget) {
          const resourcesBudget = parseFloat(event.resourcesBudget);
          if (!isNaN(resourcesBudget)) {
            totalVendorResourceCosts += resourcesBudget;
          }
        }
      });
      
      // Calculate net profit
      netProfit = totalRevenue - totalVendorResourceCosts;
      
      // Set the financial stats
      setFinancialStats({
        totalRevenue,
        totalVendorResourceCosts,
        netProfit,
        revenueGrowth: 15.4, // Mock growth data, would be calculated in a real app
        profitGrowth: 12.8    // Mock growth data, would be calculated in a real app
      });
      
      setStatsLoading(false);
    } catch (error) {
      console.error('Error fetching financial data:', error);
      setError('Failed to load financial data. Please try again later.');
      setStatsLoading(false);
    }
  };

  // Function to fetch payment data
  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      
      // Fetch all events to get payment information
      const eventsRef = collection(db, 'events');
      const eventsQuery = query(eventsRef, orderBy('createdAt', 'desc'));
      const eventsSnapshot = await getDocs(eventsQuery);
      
      const fetchedPayments = [];
      
      // Extract payment information from events
      eventsSnapshot.forEach(doc => {
        const event = doc.data();
        
        if (event.paymentAmount && event.paymentAmount > 0) {
          fetchedPayments.push({
            id: doc.id,
            eventName: event.eventName,
            userName: event.userEmail,
            userId: event.createdBy,
            amount: event.paymentAmount,
            date: event.createdAt ? event.createdAt.toDate() : new Date(),
            status: event.paymentStatus || 'Completed',
            eventType: event.category,
            weatherAdapter: event.weatherAdapter,
            emotionalJourney: event.emotionalJourney,
            vendorCost: event.vendor && event.vendor.budget ? parseFloat(event.vendor.budget.replace(/[^0-9.-]+/g, '')) : 0,
            resourcesCost: event.resourcesBudget ? parseFloat(event.resourcesBudget) : 0
          });
        }
      });
      
      setPayments(fetchedPayments);
      setFilteredPayments(fetchedPayments);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payment data:', error);
      setError('Failed to load payment data. Please try again later.');
      setLoading(false);
    }
  };

  // Function to filter and sort payments based on current filters
  const filterAndSortPayments = () => {
    if (!payments || payments.length === 0) {
      setFilteredPayments([]);
      return;
    }
    
    let filtered = [...payments];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(payment => 
        (payment.eventName && payment.eventName.toLowerCase().includes(query)) ||
        (payment.userName && payment.userName.toLowerCase().includes(query)) ||
        (payment.eventType && payment.eventType.toLowerCase().includes(query))
      );
    }
    
    // Apply date range filter
    if (dateRange === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter(payment => payment.date >= today);
    } else if (dateRange === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(payment => payment.date >= weekAgo);
    } else if (dateRange === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter(payment => payment.date >= monthAgo);
    } else if (dateRange === 'year') {
      const yearAgo = new Date();
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      filtered = filtered.filter(payment => payment.date >= yearAgo);
    } else if (dateRange === 'custom' && startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(payment => payment.date >= start && payment.date <= end);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return b.date - a.date;
      } else if (sortBy === 'oldest') {
        return a.date - b.date;
      } else if (sortBy === 'amount-high') {
        return b.amount - a.amount;
      } else if (sortBy === 'amount-low') {
        return a.amount - b.amount;
      } else if (sortBy === 'name-az') {
        return (a.userName || '').localeCompare(b.userName || '');
      } else if (sortBy === 'name-za') {
        return (b.userName || '').localeCompare(a.userName || '');
      }
      return 0;
    });
    
    setFilteredPayments(filtered);
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get growth indicator class (positive or negative)
  const getGrowthClass = (growth) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  // Get status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle export data to CSV
  const exportToCSV = () => {
    if (filteredPayments.length === 0) return;
    
    // Create CSV header row
    const csvHeader = ['ID', 'User', 'Event Name', 'Event Type', 'Amount', 'Date', 'Status', 'AI Features', 'Vendor Cost', 'Resources Cost'];
    
    // Create CSV data rows
    const csvData = filteredPayments.map(payment => [
      payment.id,
      payment.userName || 'Unknown',
      payment.eventName || 'Unnamed Event',
      payment.eventType || 'Not Specified',
      payment.amount.toFixed(2),
      formatDate(payment.date),
      payment.status,
      [
        payment.weatherAdapter ? 'Weather-Mood Adapter' : '',
        payment.emotionalJourney ? 'Emotional Journey Mapper' : ''
      ].filter(Boolean).join(', '),
      payment.vendorCost.toFixed(2),
      payment.resourcesCost.toFixed(2)
    ]);
    
    // Combine header and data
    const csvContent = [csvHeader, ...csvData].map(row => row.join(',')).join('\n');
    
    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `payments_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Financial KPIs */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Total Revenue */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd>
                    <div className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {statsLoading ? 'Loading...' : formatCurrency(financialStats.totalRevenue)}
                      </div>
                      
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-900">View all revenue</a>
            </div>
          </div>
        </div>


      </div>

      {/* Payments Table Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Payment History</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Filter className="h-4 w-4 inline-block mr-1" />
              Filter
              <ChevronDown className={`h-4 w-4 inline-block ml-1 transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={exportToCSV}
              disabled={filteredPayments.length === 0}
              className="px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
            >
              <Download className="h-4 w-4 inline-block mr-1" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filter Section */}
        {showFilters && (
          <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="searchQuery"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by user, event name..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <select
                  id="dateRange"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="year">Last Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <div>
                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="amount-high">Amount (High to Low)</option>
                  <option value="amount-low">Amount (Low to High)</option>
                  <option value="name-az">User Name (A-Z)</option>
                  <option value="name-za">User Name (Z-A)</option>
                </select>
              </div>

              {dateRange === 'custom' && (
                <div className="lg:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payments Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="p-5">
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <X className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="p-5 text-center">
              <div className="py-12">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
                  <CreditCard className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchQuery || dateRange !== 'all' 
                    ? "No payments match your current filters. Try adjusting your search or filters."
                    : "There are no payments in the system yet."}
                </p>
              </div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AI Features
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{payment.userName || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">{payment.userId || 'No ID'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.eventName || 'Unnamed Event'}</div>
                      <div className="text-xs text-gray-500">{payment.eventType || 'Not specified'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</div>
                      <div className="text-xs text-gray-500">
                        Costs: {formatCurrency(payment.vendorCost + payment.resourcesCost)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(payment.date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        {payment.weatherAdapter && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">Weather-Mood</span>
                        )}
                        {payment.emotionalJourney && (
                          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">Emotional Journey</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedPayment(payment);
                          setShowPaymentDetails(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Payment Details Modal */}
      {showPaymentDetails && selectedPayment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
            {/* Modal header */}
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Payment Details</h3>
              <button
                onClick={() => setShowPaymentDetails(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal content */}
            <div className="space-y-6">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Payment ID</p>
                    <p className="text-sm font-medium text-gray-900 break-all">{selectedPayment.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedPayment.status)}`}>
                      {selectedPayment.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">User</p>
                    <p className="text-sm font-medium text-gray-900">{selectedPayment.userName || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="text-sm font-medium text-gray-900 break-all">{selectedPayment.userId || 'Not available'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Event Name</p>
                    <p className="text-sm font-medium text-gray-900">{selectedPayment.eventName || 'Unnamed Event'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Event Type</p>
                    <p className="text-sm font-medium text-gray-900">{selectedPayment.eventType || 'Not specified'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(selectedPayment.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedPayment.date ? new Date(selectedPayment.date).toLocaleTimeString() : 'Not available'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-indigo-800 mb-2">Financial Breakdown</h4>
                
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Payment:</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(selectedPayment.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Vendor Cost:</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(selectedPayment.vendorCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Resources Cost:</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(selectedPayment.resourcesCost)}</span>
                  </div>
                </div>
                
                <div className="border-t border-indigo-200 pt-2">
                  <div className="flex justify-between font-medium">
                    <span className="text-sm text-indigo-800">Net Profit:</span>
                    <span className="text-sm text-indigo-800">
                      {formatCurrency(selectedPayment.amount - selectedPayment.vendorCost - selectedPayment.resourcesCost)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">AI Features</h4>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {selectedPayment.weatherAdapter ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Weather-Mood Adapter</p>
                      {selectedPayment.weatherAdapter && (
                        <p className="text-xs text-gray-500">$99.00</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {selectedPayment.emotionalJourney ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Emotional Journey Mapper</p>
                      {selectedPayment.emotionalJourney && (
                        <p className="text-xs text-gray-500">$149.00</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowPaymentDetails(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialManagement;
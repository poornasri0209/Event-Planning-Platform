import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { DollarSign, CalendarIcon, Search, AlertCircle, Download, FileText, Filter } from 'lucide-react';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const { currentUser } = useAuth();

  // Fetch payments on component mount
  useEffect(() => {
    fetchPayments();
  }, [currentUser]);

  // Filter and sort payments when relevant state changes
  useEffect(() => {
    filterAndSortPayments();
  }, [searchQuery, sortBy, payments]);

  // Function to fetch user's payments from Firestore
  const fetchPayments = async () => {
    if (!currentUser) {
      return;
    }

    try {
      setLoading(true);
      
      // Get all events with payment information
      const eventsRef = collection(db, 'events');
      const q = query(
        eventsRef,
        where('createdBy', '==', currentUser.uid),
        where('paymentStatus', '==', 'completed'), // Only get completed payments
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      
      // Process the results to extract payment information
      const fetchedPayments = querySnapshot.docs.map(doc => {
        const eventData = doc.data();
        return {
          id: doc.id,
          eventName: eventData.eventName,
          paymentAmount: eventData.paymentAmount || 0,
          paymentDate: eventData.createdAt ? eventData.createdAt.toDate() : new Date(),
          paymentStatus: eventData.paymentStatus,
          paymentMethod: 'Credit Card', // Assuming all payments are by credit card
          paymentDetails: {
            aiFeatures: {
              weatherAdapter: eventData.weatherAdapter,
              emotionalJourney: eventData.emotionalJourney
            },
            vendor: eventData.vendor,
            resources: eventData.resources,
            resourcesBudget: eventData.resourcesBudget
          }
        };
      });
      
      setPayments(fetchedPayments);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setError('Failed to load your payment history. Please try again later.');
      setLoading(false);
    }
  };

  // Function to filter and sort payments based on current filters
  const filterAndSortPayments = () => {
    let filtered = [...payments];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(payment => 
        payment.eventName?.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.paymentDate) - new Date(a.paymentDate);
      } else if (sortBy === 'oldest') {
        return new Date(a.paymentDate) - new Date(b.paymentDate);
      } else if (sortBy === 'highest') {
        return b.paymentAmount - a.paymentAmount;
      } else if (sortBy === 'lowest') {
        return a.paymentAmount - b.paymentAmount;
      }
      return 0;
    });
    
    setFilteredPayments(filtered);
  };

  // Function to format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Total amount spent
  const totalSpent = payments.reduce((total, payment) => total + payment.paymentAmount, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
          <p className="mt-2 text-gray-600">
            Review all your payments for events and services
          </p>
        </div>
        
        {/* Payment Summary */}
        <div className="bg-white shadow-md rounded-lg mb-8 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <div className="flex items-center">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <DollarSign className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-indigo-800 font-medium">Total Spent</p>
                  <p className="text-2xl font-bold text-indigo-900">{formatCurrency(totalSpent)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-green-800 font-medium">Total Payments</p>
                  <p className="text-2xl font-bold text-green-900">{payments.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <CalendarIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-purple-800 font-medium">Latest Payment</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {payments.length > 0 ? formatDate(payments[0].paymentDate) : 'None'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white shadow rounded-lg mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="flex-grow mb-4 md:mb-0">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search payments by event name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Payments List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : filteredPayments.length > 0 ? (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map(payment => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.eventName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(payment.paymentDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(payment.paymentAmount)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {payment.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end">
                        <Download className="h-4 w-4 mr-1" />
                        Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-10 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
              <DollarSign className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? "No payments match your search. Try adjusting your search criteria."
                : "You haven't made any payments yet. Payments will appear here once you've paid for events or features."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsPage;
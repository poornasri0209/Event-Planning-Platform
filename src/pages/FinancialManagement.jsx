import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, where, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust path as needed based on your project structure

const FinancialManagement = () => {
  // State for financial stats
  const [financialStats, setFinancialStats] = useState([
    { title: 'Total Revenue', value: '$0', change: '0%', period: 'YTD' },
    { title: 'Expenses', value: '$0', change: '0%', period: 'YTD' },
    { title: 'Net Profit', value: '$0', change: '0%', period: 'YTD' }
  ]);
  
  // State for financial reports
  const [reports, setReports] = useState([]);
  
  // State for selected period
  const [selectedPeriod, setSelectedPeriod] = useState('Q1 2025');
  
  // State for loading status
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  
  // State for modal visibility
  const [showModal, setShowModal] = useState(false);
  
  // State for new report data
  const [newReport, setNewReport] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    period: 'Q1 2025'
  });
  
  // State for form error
  const [formError, setFormError] = useState('');

  // Fetch financial stats and reports on component mount
  useEffect(() => {
    fetchFinancialStats();
    fetchReports();
  }, []);

  // Fetch reports when selected period changes
  useEffect(() => {
    fetchReports();
  }, [selectedPeriod]);

  // Function to fetch financial stats from Firebase
  const fetchFinancialStats = async () => {
    try {
      setStatsLoading(true);
      const statsDoc = await getDoc(doc(db, 'financialStats', 'current'));
      
      if (statsDoc.exists()) {
        const statsData = statsDoc.data();
        const formattedStats = [
          { 
            title: 'Total Revenue', 
            value: formatCurrency(statsData.totalRevenue || 0), 
            change: `${statsData.revenueChange || 0}%`, 
            period: 'YTD' 
          },
          { 
            title: 'Expenses', 
            value: formatCurrency(statsData.totalExpenses || 0), 
            change: `${statsData.expensesChange || 0}%`, 
            period: 'YTD' 
          },
          { 
            title: 'Net Profit', 
            value: formatCurrency(statsData.netProfit || 0), 
            change: `${statsData.profitChange || 0}%`, 
            period: 'YTD' 
          }
        ];
        setFinancialStats(formattedStats);
      } else {
        // If no document exists, create a default one
        await addDoc(collection(db, 'financialStats'), {
          totalRevenue: 528690,
          revenueChange: 15,
          totalExpenses: 215430,
          expensesChange: 8,
          netProfit: 313260,
          profitChange: 21,
          lastUpdated: new Date()
        });
      }
      
      setStatsLoading(false);
    } catch (error) {
      console.error('Error fetching financial stats:', error);
      setStatsLoading(false);
    }
  };

  // Function to fetch financial reports from Firebase
  const fetchReports = async () => {
    try {
      setLoading(true);
      const reportsCollection = collection(db, 'financialReports');
      const reportsQuery = query(
        reportsCollection, 
        where('period', '==', selectedPeriod),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(reportsQuery);
      
      const fetchedReports = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: formatDate(doc.data().date.toDate())
      }));
      
      setReports(fetchedReports);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setLoading(false);
    }
  };

  // Function to add a new financial report to Firebase
  const addReport = async (e) => {
    e.preventDefault();
    setFormError('');
    
    try {
      // Validation
      if (!newReport.name.trim()) {
        setFormError('Report name is required');
        return;
      }
      
      // Add document to Firestore
      await addDoc(collection(db, 'financialReports'), {
        name: newReport.name.trim(),
        date: new Date(newReport.date),
        period: newReport.period,
        createdAt: new Date()
      });
      
      // Reset form and close modal
      setNewReport({
        name: '',
        date: new Date().toISOString().split('T')[0],
        period: selectedPeriod
      });
      setShowModal(false);
      
      // Refresh reports list
      fetchReports();
    } catch (error) {
      console.error('Error adding report:', error);
      setFormError('Failed to add report. Please try again.');
    }
  };

  // Handle input changes for the new report form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReport(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format date to a readable string
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Handle period change
  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statsLoading ? (
          <>
            <div className="bg-white overflow-hidden shadow rounded-lg p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            </div>
          </>
        ) : (
          financialStats.map((stat, i) => (
            <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                    <dd className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</dd>
                  </div>
                  <div className="bg-gray-50 rounded-md p-2">
                    <div className={`text-sm ${parseFloat(stat.change) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </div>
                    <div className="text-xs text-gray-500">
                      {stat.period}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Financial Reports</h2>
          <div className="flex space-x-4">
            <select 
              className="border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={selectedPeriod}
              onChange={handlePeriodChange}
            >
              <option>Q1 2025</option>
              <option>Q4 2024</option>
              <option>Q3 2024</option>
              <option>Q2 2024</option>
            </select>
            <button 
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
              onClick={() => setShowModal(true)}
            >
              Add Report
            </button>
          </div>
        </div>
        <div className="p-5">
          {loading ? (
            <div className="text-center py-4">
              <p>Loading reports...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.length > 0 ? (
                    reports.map((report, i) => (
                      <tr key={report.id || i}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.period}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">Download</button>
                          <button className="text-indigo-600 hover:text-indigo-900">Share</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                        No reports found for this period. Add your first report!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Report Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Financial Report</h3>
            
            {formError && (
              <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                {formError}
              </div>
            )}
            
            <form onSubmit={addReport}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Report Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newReport.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">Generation Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={newReport.date}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="period" className="block text-sm font-medium text-gray-700">Period</label>
                  <select
                    id="period"
                    name="period"
                    value={newReport.period}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option>Q1 2025</option>
                    <option>Q2 2025</option>
                    <option>Q3 2025</option>
                    <option>Q4 2025</option>
                    <option>Q4 2024</option>
                    <option>Q3 2024</option>
                    <option>Q2 2024</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Add Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialManagement;
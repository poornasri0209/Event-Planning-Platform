// FinancialManagement.jsx
import React from 'react';

const FinancialManagement = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: 'Total Revenue', value: '$528,690', change: '+15%', period: 'YTD' },
          { title: 'Expenses', value: '$215,430', change: '+8%', period: 'YTD' },
          { title: 'Net Profit', value: '$313,260', change: '+21%', period: 'YTD' }
        ].map((stat, i) => (
          <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900">{stat.value}</dd>
                </div>
                <div className="bg-gray-50 rounded-md p-2">
                  <div className="text-sm text-green-600">
                    {stat.change}
                  </div>
                  <div className="text-xs text-gray-500">
                    {stat.period}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Financial Reports</h2>
          <div>
            <select className="border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <option>Q1 2025</option>
              <option>Q4 2024</option>
              <option>Q3 2024</option>
              <option>Q2 2024</option>
            </select>
          </div>
        </div>
        <div className="p-5">
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
                {[
                  { name: 'Revenue Report', date: 'Mar 31, 2025', period: 'Q1 2025' },
                  { name: 'Expense Breakdown', date: 'Mar 31, 2025', period: 'Q1 2025' },
                  { name: 'Event Profitability', date: 'Mar 31, 2025', period: 'Q1 2025' },
                  { name: 'Client Revenue Analysis', date: 'Mar 31, 2025', period: 'Q1 2025' },
                  { name: 'Forecast Report', date: 'Mar 25, 2025', period: 'Q2 2025' }
                ].map((report, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.period}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">Download</button>
                      <button className="text-indigo-600 hover:text-indigo-900">Share</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialManagement;
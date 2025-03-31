import React from 'react';

// Client Management Component
const ClientManagement = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Client Management</h2>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Add Client</button>
        </div>
        <div className="p-5">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Events</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spend</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { name: 'Acme Corporation', contact: 'john@acme.com', events: 5, spend: '$125,000', satisfaction: '96%' },
                  { name: 'TechStart Inc', contact: 'sarah@techstart.io', events: 3, spend: '$78,500', satisfaction: '92%' },
                  { name: 'Global Media Group', contact: 'mike@gmg.com', events: 2, spend: '$87,200', satisfaction: '89%' },
                  { name: 'Innovate Partners', contact: 'james@innovate.co', events: 1, spend: '$32,600', satisfaction: '94%' },
                  { name: 'Nexus Enterprises', contact: 'lisa@nexus.com', events: 4, spend: '$112,450', satisfaction: '97%' }
                ].map((client, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.contact}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.events}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.spend}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.satisfaction}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                      <button className="text-indigo-600 hover:text-indigo-900">Contact</button>
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

export default ClientManagement;
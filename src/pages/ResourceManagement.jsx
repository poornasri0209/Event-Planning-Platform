import React from 'react';

const ResourceManagement = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Resource Management</h2>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Add Resource</button>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Event Planning Templates', type: 'Document', format: 'PDF', lastUpdated: 'Feb 12, 2025', status: 'Available' },
              { name: 'Emotional Journey Mapper Tool', type: 'Software', format: 'Web App', lastUpdated: 'Mar 05, 2025', status: 'Available' },
              { name: 'Weather-Mood Analysis Kit', type: 'Tool', format: 'API', lastUpdated: 'Jan 28, 2025', status: 'Available' },
              { name: 'Client Satisfaction Surveys', type: 'Document', format: 'Forms', lastUpdated: 'Feb 22, 2025', status: 'Available' },
              { name: 'Vendor Evaluation Checklist', type: 'Document', format: 'Spreadsheet', lastUpdated: 'Mar 11, 2025', status: 'Available' },
              { name: 'Event ROI Calculator', type: 'Tool', format: 'Web App', lastUpdated: 'Feb 08, 2025', status: 'Maintenance' }
            ].map((resource, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow hover:border-indigo-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-medium text-gray-900">{resource.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">Type: {resource.type}</p>
                    <p className="mt-1 text-sm text-gray-500">Format: {resource.format}</p>
                    <p className="mt-1 text-sm text-gray-500">Last Updated: {resource.lastUpdated}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    resource.status === 'Available' ? 'bg-green-100 text-green-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {resource.status}
                  </span>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button className="flex-1 px-3 py-1 bg-indigo-50 text-indigo-600 text-sm rounded hover:bg-indigo-100">
                    Access
                  </button>
                  <button className="flex-1 px-3 py-1 bg-gray-50 text-gray-600 text-sm rounded hover:bg-gray-100">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceManagement;
import React from 'react';

const VendorManagement = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Vendor Management</h2>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Add Vendor</button>
        </div>
        <div className="p-5">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Events Serviced</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { name: 'Elite Catering', category: 'Food & Beverage', contact: 'sales@elitecatering.com', events: 18, rating: '4.8/5' },
                  { name: 'Sound Masters', category: 'Audio/Visual', contact: 'support@soundmasters.com', events: 22, rating: '4.7/5' },
                  { name: 'Decor Unlimited', category: 'Decor & Styling', contact: 'info@decorunlimited.com', events: 15, rating: '4.9/5' },
                  { name: 'VIP Transport', category: 'Transportation', contact: 'bookings@viptransport.com', events: 12, rating: '4.6/5' },
                  { name: 'Security Pro', category: 'Security Services', contact: 'ops@securitypro.com', events: 8, rating: '4.8/5' }
                ].map((vendor, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vendor.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.contact}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.events}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.rating}</td>
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

export default VendorManagement;
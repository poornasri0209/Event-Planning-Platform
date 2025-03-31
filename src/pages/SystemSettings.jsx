import React from 'react';

const SystemSettings = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">System Settings</h2>
        </div>
        <div className="p-5">
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">General Settings</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Notifications</h4>
                    <p className="text-sm text-gray-500">Enable email notifications</p>
                  </div>
                  <div className="relative inline-block w-12 align-middle select-none">
                    <input type="checkbox" name="toggle" id="notifications" className="sr-only" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full cursor-pointer"></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500">Enforce 2FA for all users</p>
                  </div>
                  <div className="relative inline-block w-12 align-middle select-none">
                    <input type="checkbox" name="toggle" id="twofa" className="sr-only" defaultChecked />
                    <div className="w-11 h-6 bg-blue-600 rounded-full cursor-pointer"></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Dark Mode</h4>
                    <p className="text-sm text-gray-500">Enable dark mode interface</p>
                  </div>
                  <div className="relative inline-block w-12 align-middle select-none">
                    <input type="checkbox" name="toggle" id="darkmode" className="sr-only" />
                    <div className="w-11 h-6 bg-gray-200 rounded-full cursor-pointer"></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Analytics Tracking</h4>
                    <p className="text-sm text-gray-500">Track user interactions</p>
                  </div>
                  <div className="relative inline-block w-12 align-middle select-none">
                    <input type="checkbox" name="toggle" id="analytics" className="sr-only" defaultChecked />
                    <div className="w-11 h-6 bg-blue-600 rounded-full cursor-pointer"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">Weather-Mood System</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Auto Weather Updates</h4>
                    <p className="text-sm text-gray-500">Automatically fetch weather data</p>
                  </div>
                  <div className="relative inline-block w-12 align-middle select-none">
                    <input type="checkbox" name="toggle" id="weather" className="sr-only" defaultChecked />
                    <div className="w-11 h-6 bg-blue-600 rounded-full cursor-pointer"></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Mood Prediction</h4>
                    <p className="text-sm text-gray-500">Enable AI mood predictions</p>
                  </div>
                  <div className="relative inline-block w-12 align-middle select-none">
                    <input type="checkbox" name="toggle" id="mood" className="sr-only" defaultChecked />
                    <div className="w-11 h-6 bg-blue-600 rounded-full cursor-pointer"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">User Management</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { role: 'Admin', users: 3, permissions: 'Full Access' },
                      { role: 'Event Manager', users: 8, permissions: 'Create, Edit, View' },
                      { role: 'Finance Manager', users: 2, permissions: 'Financial Reports, Billing' },
                      { role: 'Analyst', users: 4, permissions: 'View Reports, Analytics' }
                    ].map((role, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{role.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{role.users}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{role.permissions}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
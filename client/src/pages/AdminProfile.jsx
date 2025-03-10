import React, { useState } from 'react';
import { User, Mail, Phone, Shield, Key, Lock, LogOut, Menu, X, Bell, ChevronLeft } from 'lucide-react';

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  const [userData, setUserData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@sentinent-stories.com',
    phone: '+1 (555) 123-4567',
    role: 'System Administrator',
    joinDate: 'January 15, 2023'
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };
  
  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    console.log('Updated profile data:', userData);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <a href="/admin/dashboard" className="flex items-center text-indigo-600 hover:text-indigo-800">
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to Dashboard
            </a>
            <div className="ml-auto flex items-center">
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                <Bell className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Admin Profile</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>
            
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center space-x-5">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                      <User className="h-8 w-8 text-indigo-600" />
                    </div>
                    {isEditing && (
                      <div className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow">
                        <div className="bg-indigo-600 rounded-full p-1">
                          <User className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {userData.firstName} {userData.lastName}
                  </h1>
                  <p className="text-sm text-gray-500">{userData.role}</p>
                </div>
              </div>
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSave} className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={userData.firstName}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      id="lastName"
                      value={userData.lastName}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={userData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      value={userData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <div className="border-t border-gray-200">
                <dl>
                  <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-2" />
                      Email address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {userData.email}
                    </dd>
                  </div>
                  <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-2" />
                      Phone number
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {userData.phone}
                    </dd>
                  </div>
                  <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      <Shield className="h-5 w-5 text-gray-400 mr-2" />
                      Role
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {userData.role}
                    </dd>
                  </div>
                  <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                    <dt className="text-sm font-medium text-gray-500 flex items-center">
                      Member since
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {userData.joinDate}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
            
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Security Settings</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <Key className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Change Password</h4>
                      <p className="text-xs text-gray-500">Update your password regularly to keep your account secure</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    Update
                  </button>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <Lock className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    Enable
                  </button>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProfile;
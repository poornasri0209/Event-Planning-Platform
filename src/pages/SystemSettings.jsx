import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, collection, getDocs, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust path as needed based on your project structure

const SystemSettings = () => {
  // State for general settings
  const [generalSettings, setGeneralSettings] = useState({
    notifications: false,
    twoFactorAuth: true,
    darkMode: false,
    analyticsTracking: true
  });

  // State for weather-mood system
  const [weatherMoodSettings, setWeatherMoodSettings] = useState({
    autoWeatherUpdates: true,
    moodPrediction: true
  });

  // State for user roles
  const [userRoles, setUserRoles] = useState([]);

  // State for loading statuses
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  // State for error message
  const [errorMessage, setErrorMessage] = useState('');
  
  // State for success message
  const [successMessage, setSuccessMessage] = useState('');

  // State for role being edited
  const [editingRole, setEditingRole] = useState(null);
  
  // State for current edited values
  const [editedRole, setEditedRole] = useState({
    role: '',
    permissions: ''
  });

  // Load settings from Firebase on component mount
  useEffect(() => {
    fetchSettings();
    fetchUserRoles();
  }, []);

  // Function to fetch settings from Firebase
  const fetchSettings = async () => {
    try {
      setLoadingSettings(true);
      // Fetch general settings
      const generalSettingsDoc = await getDoc(doc(db, 'systemSettings', 'general'));
      if (generalSettingsDoc.exists()) {
        setGeneralSettings(generalSettingsDoc.data());
      } else {
        // Create default settings if none exist
        await setDoc(doc(db, 'systemSettings', 'general'), generalSettings);
      }

      // Fetch weather-mood settings
      const weatherMoodSettingsDoc = await getDoc(doc(db, 'systemSettings', 'weatherMood'));
      if (weatherMoodSettingsDoc.exists()) {
        setWeatherMoodSettings(weatherMoodSettingsDoc.data());
      } else {
        // Create default settings if none exist
        await setDoc(doc(db, 'systemSettings', 'weatherMood'), weatherMoodSettings);
      }

      setLoadingSettings(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setErrorMessage('Failed to load settings. Please try again later.');
      setLoadingSettings(false);
    }
  };

  // Function to fetch user roles from Firebase
  const fetchUserRoles = async () => {
    try {
      setLoadingRoles(true);
      const rolesCollection = collection(db, 'userRoles');
      const rolesQuery = query(rolesCollection, orderBy('role'));
      const querySnapshot = await getDocs(rolesQuery);
      
      const fetchedRoles = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      if (fetchedRoles.length === 0) {
        // Create default roles if none exist
        const defaultRoles = [
          { role: 'Admin', users: 3, permissions: 'Full Access' },
          { role: 'Event Manager', users: 8, permissions: 'Create, Edit, View' },
          { role: 'Finance Manager', users: 2, permissions: 'Financial Reports, Billing' },
          { role: 'Analyst', users: 4, permissions: 'View Reports, Analytics' }
        ];
        
        for (const role of defaultRoles) {
          await setDoc(doc(collection(db, 'userRoles')), role);
        }
        
        // Fetch the newly created roles
        const newRolesSnapshot = await getDocs(query(collection(db, 'userRoles'), orderBy('role')));
        const newRoles = newRolesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setUserRoles(newRoles);
      } else {
        setUserRoles(fetchedRoles);
      }
      
      setLoadingRoles(false);
    } catch (error) {
      console.error('Error fetching user roles:', error);
      setErrorMessage('Failed to load user roles. Please try again later.');
      setLoadingRoles(false);
    }
  };

  // Function to handle toggle change
  const handleToggleChange = (section, setting) => {
    if (section === 'general') {
      setGeneralSettings(prev => ({
        ...prev,
        [setting]: !prev[setting]
      }));
    } else if (section === 'weatherMood') {
      setWeatherMoodSettings(prev => ({
        ...prev,
        [setting]: !prev[setting]
      }));
    }
  };

  // Function to save all settings to Firebase
  const saveSettings = async () => {
    try {
      setSavingSettings(true);
      setErrorMessage('');
      setSuccessMessage('');
      
      // Save general settings
      await setDoc(doc(db, 'systemSettings', 'general'), generalSettings);
      
      // Save weather-mood settings
      await setDoc(doc(db, 'systemSettings', 'weatherMood'), weatherMoodSettings);
      
      setSavingSettings(false);
      setSuccessMessage('Settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setErrorMessage('Failed to save settings. Please try again.');
      setSavingSettings(false);
    }
  };

  // Function to start editing a role
  const startEditingRole = (role) => {
    setEditingRole(role.id);
    setEditedRole({
      role: role.role,
      permissions: role.permissions
    });
  };

  // Function to save edited role
  const saveEditedRole = async (roleId) => {
    try {
      const roleRef = doc(db, 'userRoles', roleId);
      await updateDoc(roleRef, {
        role: editedRole.role,
        permissions: editedRole.permissions
      });
      
      // Update the role in state
      setUserRoles(prev => prev.map(role => 
        role.id === roleId 
          ? { ...role, role: editedRole.role, permissions: editedRole.permissions }
          : role
      ));
      
      // Reset editing state
      setEditingRole(null);
      setEditedRole({ role: '', permissions: '' });
    } catch (error) {
      console.error('Error updating role:', error);
      setErrorMessage('Failed to update role. Please try again.');
    }
  };

  // Function to cancel role editing
  const cancelEditingRole = () => {
    setEditingRole(null);
    setEditedRole({ role: '', permissions: '' });
  };

  // Function to handle edited role input changes
  const handleRoleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedRole(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Render toggle switch component
  const renderToggleSwitch = (section, setting, value, label, description) => {
    return (
      <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
        <div>
          <h4 className="font-medium text-gray-900">{label}</h4>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="relative inline-block w-12 align-middle select-none">
          <input 
            type="checkbox" 
            className="sr-only" 
            checked={value}
            onChange={() => handleToggleChange(section, setting)} 
            disabled={loadingSettings}
          />
          <div className={`w-11 h-6 rounded-full cursor-pointer ${value ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">System Settings</h2>
        </div>
        <div className="p-5">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}
          
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}
          
          <div className="space-y-6">
            {/* General Settings */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">General Settings</h3>
              {loadingSettings ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="p-4 border border-gray-200 rounded-lg animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {renderToggleSwitch('general', 'notifications', generalSettings.notifications, 'Notifications', 'Enable email notifications')}
                  {renderToggleSwitch('general', 'twoFactorAuth', generalSettings.twoFactorAuth, 'Two-Factor Authentication', 'Enforce 2FA for all users')}
                  {renderToggleSwitch('general', 'darkMode', generalSettings.darkMode, 'Dark Mode', 'Enable dark mode interface')}
                  {renderToggleSwitch('general', 'analyticsTracking', generalSettings.analyticsTracking, 'Analytics Tracking', 'Track user interactions')}
                </div>
              )}
            </div>
            
            {/* Weather-Mood System */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">Weather-Mood System</h3>
              {loadingSettings ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="p-4 border border-gray-200 rounded-lg animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {renderToggleSwitch('weatherMood', 'autoWeatherUpdates', weatherMoodSettings.autoWeatherUpdates, 'Auto Weather Updates', 'Automatically fetch weather data')}
                  {renderToggleSwitch('weatherMood', 'moodPrediction', weatherMoodSettings.moodPrediction, 'Mood Prediction', 'Enable AI mood predictions')}
                </div>
              )}
            </div>
            
            {/* User Management */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">User Management</h3>
              {loadingRoles ? (
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
                      {[1, 2, 3, 4].map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                          <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
                          <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                          <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-12"></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
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
                      {userRoles.map((role) => (
                        <tr key={role.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {editingRole === role.id ? (
                              <input
                                type="text"
                                name="role"
                                value={editedRole.role}
                                onChange={handleRoleInputChange}
                                className="border rounded px-2 py-1 w-full"
                              />
                            ) : (
                              role.role
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{role.users}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {editingRole === role.id ? (
                              <input
                                type="text"
                                name="permissions"
                                value={editedRole.permissions}
                                onChange={handleRoleInputChange}
                                className="border rounded px-2 py-1 w-full"
                              />
                            ) : (
                              role.permissions
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {editingRole === role.id ? (
                              <>
                                <button 
                                  className="text-green-600 hover:text-green-900 mr-3"
                                  onClick={() => saveEditedRole(role.id)}
                                >
                                  Save
                                </button>
                                <button 
                                  className="text-red-600 hover:text-red-900"
                                  onClick={cancelEditingRole}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button 
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                                onClick={() => startEditingRole(role)}
                              >
                                Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Save Button */}
            <div className="flex justify-end">
              <button 
                className={`px-4 py-2 ${savingSettings ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-md`}
                onClick={saveSettings}
                disabled={loadingSettings || loadingRoles || savingSettings}
              >
                {savingSettings ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
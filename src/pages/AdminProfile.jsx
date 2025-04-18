import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { db, auth } from '../firebase'; // Adjust path as needed based on your project structure
import { useAuth } from '../context/AuthContext'; // Adjust path as needed
import Navbar from '../components/Navbar';

const AdminProfile = () => {
  // Get current user from auth context
  const { currentUser } = useAuth();
  
  // State for profile data
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    bio: '',
    joinDate: '',
    lastLogin: '',
  });
  
  // State for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // State for loading and error handling
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  // State for reauthentication modal
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [reauthPassword, setReauthPassword] = useState('');
  const [reauthError, setReauthError] = useState('');
  const [pendingAction, setPendingAction] = useState(null);

  // Helper function to format dates safely
  const formatDateSafely = (dateValue) => {
    if (!dateValue) return '';
    
    // Check if the date is a Firestore timestamp
    if (dateValue && typeof dateValue.toDate === 'function') {
      return dateValue.toDate().toISOString().split('T')[0];
    }
    
    // Handle string dates or ISO strings
    if (typeof dateValue === 'string') {
      // Check if it's already in YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        return dateValue;
      }
      
      // Try to parse the string into a date
      try {
        return new Date(dateValue).toISOString().split('T')[0];
      } catch (e) {
        console.error("Error parsing date:", e);
        return '';
      }
    }
    
    // Handle Date objects
    if (dateValue instanceof Date) {
      return dateValue.toISOString().split('T')[0];
    }
    
    // If all else fails, return empty string
    return '';
  };

  // Fetch admin profile from Firebase on component mount
  useEffect(() => {
    fetchProfile();
  }, [currentUser]);

  // Function to fetch profile from Firebase
  const fetchProfile = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      // Get user profile document from Firestore
      const userID = currentUser.uid || 'admin-user';
      const profileDoc = await getDoc(doc(db, 'adminProfiles', userID));
      
      if (profileDoc.exists()) {
        // Get the data from the document
        const data = profileDoc.data();
        
        // Create a new profile object with safely formatted dates
        const formattedProfile = {
          ...data,
          email: currentUser.email || 'admin@admin.com',
          joinDate: formatDateSafely(data.joinDate),
          lastLogin: formatDateSafely(data.lastLogin)
        };
        
        setProfile(formattedProfile);
      } else {
        // Create default profile if none exists
        const defaultProfile = {
          displayName: currentUser.displayName || 'Admin User',
          email: currentUser.email || 'admin@admin.com',
          phone: '',
          position: 'Administrator',
          department: 'Management',
          bio: '',
          joinDate: new Date().toISOString().split('T')[0],
          lastLogin: new Date().toISOString().split('T')[0],
        };
        
        // Add the default profile to Firestore
        await setDoc(doc(db, 'adminProfiles', userID), defaultProfile);
        setProfile(defaultProfile);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data. Please try again later.');
      setLoading(false);
    }
  };

  // Handle profile input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save profile changes to Firebase
  const saveProfile = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      // Check if email is being changed
      if (profile.email !== currentUser.email) {
        // Email change requires reauthentication first
        setPendingAction('email');
        setShowReauthModal(true);
        setSaving(false);
        return;
      }
      
      // Prepare data for Firestore update
      const profileData = {
        ...profile,
        updatedAt: new Date()
      };
      
      // Remove email as it's stored in auth, not Firestore
      delete profileData.email;
      
      // Update Firestore document
      const userID = currentUser.uid || 'admin-user';
      await updateDoc(doc(db, 'adminProfiles', userID), profileData);
      
      setSaving(false);
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to update profile. Please try again.');
      setSaving(false);
    }
  };

  // Change password
  const changePassword = async (e) => {
    e.preventDefault();
    
    try {
      setPasswordError('');
      setPasswordSuccess('');
      
      // Validate new password
      if (passwordData.newPassword.length < 6) {
        setPasswordError('New password must be at least 6 characters long.');
        return;
      }
      
      // Check if passwords match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError('New password and confirm password do not match.');
        return;
      }
      
      // Password change requires reauthentication first
      setPendingAction('password');
      setShowReauthModal(true);
    } catch (error) {
      console.error('Error in password change:', error);
      setPasswordError('Failed to update password. Please try again.');
    }
  };

  // Complete the email change after reauthentication
  const completeEmailChange = async () => {
    try {
      // Update email in Firebase Auth (only for real Firebase users)
      if (currentUser && currentUser.uid !== 'admin-user') {
        await updateEmail(currentUser, profile.email);
      }
      
      setSaving(false);
      setSuccess('Profile and email updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Error updating email:', error);
      setError('Failed to update email. Please try again.');
      setSaving(false);
    }
  };

  // Complete the password change after reauthentication
  const completePasswordChange = async () => {
    try {
      // Update password in Firebase Auth (only for real Firebase users)
      if (currentUser && currentUser.uid !== 'admin-user') {
        await updatePassword(currentUser, passwordData.newPassword);
      }
      
      // Reset password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      setPasswordSuccess('Password updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setPasswordSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError('Failed to update password. Please try again.');
    }
  };

  // Handle reauthentication
  const handleReauthentication = async () => {
    try {
      setReauthError('');
      
      // Skip actual reauthentication for the mock admin user
      if (currentUser.uid === 'admin-user') {
        setShowReauthModal(false);
        setReauthPassword('');
        
        // Perform pending action
        if (pendingAction === 'email') {
          completeEmailChange();
        } else if (pendingAction === 'password') {
          completePasswordChange();
        }
        
        // Reset pending action
        setPendingAction(null);
        return;
      }
      
      // Create credential with current email and provided password
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        reauthPassword
      );
      
      // Reauthenticate user
      await reauthenticateWithCredential(currentUser, credential);
      
      // Close modal
      setShowReauthModal(false);
      setReauthPassword('');
      
      // Perform pending action
      if (pendingAction === 'email') {
        completeEmailChange();
      } else if (pendingAction === 'password') {
        completePasswordChange();
      }
      
      // Reset pending action
      setPendingAction(null);
    } catch (error) {
      console.error('Reauthentication error:', error);
      setReauthError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600">
            <h2 className="text-xl font-semibold text-white">Admin Profile</h2>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Admin Information Header */}
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-200">
                  <div className="flex-grow">
                    <h3 className="text-xl font-medium text-gray-900">{profile.displayName || 'Admin User'}</h3>
                    <p className="text-sm text-gray-500">{profile.position}{profile.department ? `, ${profile.department}` : ''}</p>
                  </div>
                </div>
                
                {/* Profile Information Form */}
                <form onSubmit={saveProfile}>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        id="displayName"
                        name="displayName"
                        value={profile.displayName}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profile.email}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={profile.phone}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Phone number"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
                      <input
                        type="text"
                        id="position"
                        name="position"
                        value={profile.position}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Your position"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department</label>
                      <input
                        type="text"
                        id="department"
                        name="department"
                        value={profile.department}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Your department"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700">Join Date</label>
                      <input
                        type="date"
                        id="joinDate"
                        name="joinDate"
                        value={profile.joinDate}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100"
                        readOnly
                      />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio / About</label>
                      <textarea
                        id="bio"
                        name="bio"
                        rows="4"
                        value={profile.bio}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="A short bio about yourself"
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      className={`px-4 py-2 ${saving ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-md`}
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                  </div>
                </form>
                
                {/* Password Change Section */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                  
                  {passwordError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                      {passwordError}
                    </div>
                  )}
                  
                  {passwordSuccess && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                      {passwordSuccess}
                    </div>
                  )}
                  
                  <form onSubmit={changePassword} className="space-y-4">
                    <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Change Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Reauthentication Modal */}
      {showReauthModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Your Password</h3>
            <p className="text-sm text-gray-500 mb-4">
              For security reasons, please enter your current password to continue.
            </p>
            
            {reauthError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                {reauthError}
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="reauthPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                id="reauthPassword"
                value={reauthPassword}
                onChange={(e) => setReauthPassword(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter your current password"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setShowReauthModal(false);
                  setReauthPassword('');
                  setReauthError('');
                  setPendingAction(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                onClick={handleReauthentication}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
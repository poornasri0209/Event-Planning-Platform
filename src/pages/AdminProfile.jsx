import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { db, auth, storage } from '../firebase'; // Adjust path as needed based on your project structure
import { useAuth } from '../context/AuthContext'; // Adjust path as needed

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
    photoURL: '',
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
  
  // State for profile photo
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  
  // State for reauthentication modal
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [reauthPassword, setReauthPassword] = useState('');
  const [reauthError, setReauthError] = useState('');
  const [pendingAction, setPendingAction] = useState(null);

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
      const profileDoc = await getDoc(doc(db, 'adminProfiles', currentUser.uid));
      
      if (profileDoc.exists()) {
        // Format dates if they exist
        const data = profileDoc.data();
        if (data.joinDate) {
          data.joinDate = data.joinDate.toDate().toISOString().split('T')[0];
        }
        if (data.lastLogin) {
          data.lastLogin = data.lastLogin.toDate().toISOString().split('T')[0];
        }
        
        setProfile({
          ...data,
          email: currentUser.email,
          photoURL: data.photoURL || currentUser.photoURL,
        });
      } else {
        // Create default profile if none exists
        const defaultProfile = {
          displayName: currentUser.displayName || '',
          email: currentUser.email,
          phone: '',
          position: 'Admin',
          department: 'Management',
          bio: '',
          photoURL: currentUser.photoURL || '',
          joinDate: new Date().toISOString().split('T')[0],
          lastLogin: new Date().toISOString().split('T')[0],
        };
        
        await setDoc(doc(db, 'adminProfiles', currentUser.uid), defaultProfile);
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

  // Handle profile photo change
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload profile photo to Firebase Storage
  const uploadProfilePhoto = async () => {
    if (!photoFile) return null;
    
    try {
      setUploadingPhoto(true);
      
      // Create a storage reference
      const photoRef = ref(storage, `profilePhotos/${currentUser.uid}/${Date.now()}_${photoFile.name}`);
      
      // Upload file
      await uploadBytes(photoRef, photoFile);
      
      // Get download URL
      const downloadURL = await getDownloadURL(photoRef);
      
      setUploadingPhoto(false);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading photo:', error);
      setError('Failed to upload profile photo. Please try again.');
      setUploadingPhoto(false);
      return null;
    }
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
      
      // Upload photo if a new one was selected
      let photoURL = profile.photoURL;
      if (photoFile) {
        photoURL = await uploadProfilePhoto();
        if (!photoURL) {
          setSaving(false);
          return;
        }
      }
      
      // Prepare data for Firestore update
      const profileData = {
        ...profile,
        photoURL,
        updatedAt: new Date()
      };
      
      // Remove email as it's stored in auth, not Firestore
      delete profileData.email;
      
      // Update Firestore document
      await updateDoc(doc(db, 'adminProfiles', currentUser.uid), profileData);
      
      // Update profile state
      setProfile(prev => ({
        ...prev,
        photoURL
      }));
      
      // Reset file state
      setPhotoFile(null);
      setPhotoPreview(null);
      
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
      // Update email in Firebase Auth
      await updateEmail(currentUser, profile.email);
      
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
      // Update password in Firebase Auth
      await updatePassword(currentUser, passwordData.newPassword);
      
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
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Admin Profile</h2>
        </div>
        <div className="p-5">
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
              {/* Profile Photo Section */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-200">
                <div className="flex-shrink-0">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                    {(photoPreview || profile.photoURL) ? (
                      <img 
                        src={photoPreview || profile.photoURL} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-500">
                        <span className="text-2xl font-bold">
                          {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : 'A'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-xl font-medium text-gray-900">{profile.displayName || 'Admin User'}</h3>
                  <p className="text-sm text-gray-500">{profile.position}{profile.department ? `, ${profile.department}` : ''}</p>
                  
                  <div className="mt-3">
                    <label className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 cursor-pointer">
                      <span>Change Photo</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                    </label>
                  </div>
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
                    className={`px-4 py-2 ${saving || uploadingPhoto ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-md`}
                    disabled={saving || uploadingPhoto}
                  >
                    {saving || uploadingPhoto ? 'Saving...' : 'Save Profile'}
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
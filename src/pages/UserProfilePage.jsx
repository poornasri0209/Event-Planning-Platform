import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Briefcase, Link as LinkIcon, Instagram, Twitter, Facebook, Linkedin, CalendarRange } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import Navbar from "../components/Navbar"

const UserProfilePage = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    age: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    company: '',
    jobTitle: '',
    bio: '',
    eventPreferences: '',
    socialMedia: {
      website: '',
      instagram: '',
      twitter: '',
      facebook: '',
      linkedin: ''
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          // Initialize social media if it doesn't exist in the document
          const data = docSnap.data();
          if (!data.socialMedia) {
            data.socialMedia = {
              website: '',
              instagram: '',
              twitter: '',
              facebook: '',
              linkedin: ''
            };
          }
          setUserData(data);
        } else {
          // Set default data with the current user's email
          setUserData(prev => ({ 
            ...prev, 
            email: currentUser.email,
            socialMedia: {
              website: '',
              instagram: '',
              twitter: '',
              facebook: '',
              linkedin: ''
            }
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested socialMedia fields
    if (name.startsWith('socialMedia.')) {
      const socialField = name.split('.')[1];
      setUserData({
        ...userData,
        socialMedia: {
          ...userData.socialMedia,
          [socialField]: value
        }
      });
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  // Calculate age from date of birth
  const updateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '';
    
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age.toString();
  };

  // Handle date of birth change
  const handleDobChange = (e) => {
    const dob = e.target.value;
    const age = updateAge(dob);
    setUserData({ 
      ...userData, 
      dateOfBirth: dob,
      age: age
    });
  };

  const handleSave = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const docRef = doc(db, 'users', currentUser.uid);
      await setDoc(docRef, userData, { merge: true });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving user data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="relative h-48 bg-gradient-to-r from-indigo-500 to-purple-600">
            <div className="absolute bottom-0 left-0 w-full px-6 transform translate-y-1/2 flex justify-between items-end">
              <div className="flex items-end">
                <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg">
                  <div className="h-full w-full rounded-full bg-indigo-100 flex items-center justify-center">
                    <User size={40} className="text-indigo-500" />
                  </div>
                </div>
                <div className="ml-4 mb-4">
                  <h1 className="text-white text-2xl font-bold">
                    {userData.firstName ? `${userData.firstName} ${userData.lastName}` : 'Your Profile'}
                  </h1>
                  <p className="text-indigo-100">{userData.jobTitle || 'Event Planner'}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="mb-4 px-4 py-2 bg-white text-indigo-600 rounded-md shadow-md hover:bg-indigo-50 transition-colors font-medium"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="mt-12 p-6">
            {/* Personal Information Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">Personal Information</h2>
              
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={userData.firstName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={userData.lastName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={userData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={userData.dateOfBirth}
                      onChange={handleDobChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="text"
                      name="age"
                      value={userData.age}
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <User className="mt-1 h-5 w-5 text-indigo-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{userData.firstName} {userData.lastName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="mt-1 h-5 w-5 text-indigo-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{userData.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="mt-1 h-5 w-5 text-indigo-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{userData.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <CalendarRange className="mt-1 h-5 w-5 text-indigo-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium">
                        {userData.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString() : 'Not provided'}
                        {userData.age ? ` (${userData.age} years old)` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Address Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">Address Information</h2>
              
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={userData.address || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Street Address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      name="city"
                      value={userData.city || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      name="state"
                      value={userData.state || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={userData.zipCode || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-start">
                  <MapPin className="mt-1 h-5 w-5 text-indigo-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">
                      {userData.address ? (
                        <>
                          {userData.address}, {userData.city}, {userData.state} {userData.zipCode}
                        </>
                      ) : (
                        'Not provided'
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Professional Info Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">Professional Information</h2>
              
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={userData.company || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={userData.jobTitle || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <Briefcase className="mt-1 h-5 w-5 text-indigo-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="font-medium">{userData.company || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Briefcase className="mt-1 h-5 w-5 text-indigo-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Job Title</p>
                      <p className="font-medium">{userData.jobTitle || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Social Media Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">Social Media</h2>
              
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                    <input
                      type="url"
                      name="socialMedia.website"
                      value={userData.socialMedia?.website || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="https://yourdomain.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                    <input
                      type="text"
                      name="socialMedia.instagram"
                      value={userData.socialMedia?.instagram || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="@username"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                    <input
                      type="text"
                      name="socialMedia.twitter"
                      value={userData.socialMedia?.twitter || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="@username"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                    <input
                      type="text"
                      name="socialMedia.linkedin"
                      value={userData.socialMedia?.linkedin || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="linkedin.com/in/username"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                    <input
                      type="text"
                      name="socialMedia.facebook"
                      value={userData.socialMedia?.facebook || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="facebook.com/username"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {userData.socialMedia?.website && (
                    <a href={userData.socialMedia.website} target="_blank" rel="noopener noreferrer" className="flex items-center px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                      <LinkIcon className="h-4 w-4 text-indigo-500 mr-2" />
                      <span>Website</span>
                    </a>
                  )}
                  
                  {userData.socialMedia?.instagram && (
                    <a href={`https://instagram.com/${userData.socialMedia.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                      <Instagram className="h-4 w-4 text-indigo-500 mr-2" />
                      <span>Instagram</span>
                    </a>
                  )}
                  
                  {userData.socialMedia?.twitter && (
                    <a href={`https://twitter.com/${userData.socialMedia.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                      <Twitter className="h-4 w-4 text-indigo-500 mr-2" />
                      <span>Twitter</span>
                    </a>
                  )}
                  
                  {userData.socialMedia?.facebook && (
                    <a href={userData.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                      <Facebook className="h-4 w-4 text-indigo-500 mr-2" />
                      <span>Facebook</span>
                    </a>
                  )}
                  
                  {userData.socialMedia?.linkedin && (
                    <a href={userData.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                      <Linkedin className="h-4 w-4 text-indigo-500 mr-2" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  
                  {!userData.socialMedia?.website && 
                   !userData.socialMedia?.instagram && 
                   !userData.socialMedia?.twitter && 
                   !userData.socialMedia?.facebook && 
                   !userData.socialMedia?.linkedin && (
                    <p className="text-gray-500">No social media links provided</p>
                  )}
                </div>
              )}
            </div>

            {/* Event Preferences Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">Event Preferences</h2>
              
              {isEditing ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">What types of events are you interested in?</label>
                  <textarea
                    name="eventPreferences"
                    value={userData.eventPreferences || ''}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Corporate events, weddings, birthday parties, etc."
                  ></textarea>
                </div>
              ) : (
                <div className="flex items-start">
                  <Calendar className="mt-1 h-5 w-5 text-indigo-500 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Event Preferences</p>
                    <p className="font-medium">{userData.eventPreferences || 'No preferences specified'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Bio Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">About Me</h2>
              
              {isEditing ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={userData.bio || ''}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Tell us about yourself..."
                  ></textarea>
                </div>
              ) : (
                <div>
                  <p className="text-gray-700 whitespace-pre-line">{userData.bio || 'No bio information provided'}</p>
                </div>
              )}
            </div>

            {/* Save Button */}
            {isEditing && (
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 transition-colors font-medium"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
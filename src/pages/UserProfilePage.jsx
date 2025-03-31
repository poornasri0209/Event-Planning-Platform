// Updated: Styled editing inputs, centered navbar menu, and Feedback tab
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Settings, MessageSquare } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'events', label: 'My Events', icon: <Calendar className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
    { id: 'feedback', label: 'Feedback', icon: <MessageSquare className="w-5 h-5" /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileInfo />;
      case 'events':
        return <UserEvents />;
      case 'settings':
        return <UserSettings />;
      case 'feedback':
        return <Feedback />;
      default:
        return <ProfileInfo />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm py-4 px-6 flex justify-center items-center">
        <div className="flex-1 text-left">
          <h1 className="text-xl font-bold text-indigo-600">Sentinent Stories</h1>
        </div>
        <div className="flex-1 text-center">
          <nav className="space-x-4 hidden md:inline-block">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-sm font-medium px-3 py-1 rounded-md ${
                  activeTab === tab.id ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex-1 text-right">
          <button onClick={() => getAuth().signOut()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md">
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <nav className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-3 mb-1 text-sm font-medium rounded-md ${
                      activeTab === tab.id
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`mr-3 ${activeTab === tab.id ? 'text-indigo-500' : 'text-gray-400'}`}>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </nav>
          </div>

          <div className="mt-8 lg:mt-0 lg:col-span-9">
            <div className="bg-white shadow rounded-lg overflow-hidden transition-all duration-300">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileInfo = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    bio: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      const docRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        setUserData((prev) => ({ ...prev, email: currentUser.email }));
      }
      setLoading(false);
    };
    fetchData();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSave = async () => {
    if (!currentUser) return;
    const docRef = doc(db, 'users', currentUser.uid);
    await setDoc(docRef, userData);
    setIsEditing(false);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div>
      <div className="px-4 py-5 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>
      <div className="p-6">
        {isEditing ? (
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6 transition-all duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="firstName" value={userData.firstName} onChange={handleChange} placeholder="First Name" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" />
              <input name="lastName" value={userData.lastName} onChange={handleChange} placeholder="Last Name" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" />
              <input name="email" value={userData.email} disabled className="w-full border border-gray-200 bg-gray-100 rounded-md px-3 py-2" />
              <input name="phone" value={userData.phone} onChange={handleChange} placeholder="Phone" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" />
              <input name="company" value={userData.company} onChange={handleChange} placeholder="Company" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <textarea name="bio" value={userData.bio} onChange={handleChange} placeholder="Bio" rows={4} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500" />
            <div className="flex justify-end">
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Save</button>
            </div>
          </form>
        ) : (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><dt className="font-medium text-gray-500">Full Name</dt><dd className="text-gray-900">{userData.firstName} {userData.lastName}</dd></div>
            <div><dt className="font-medium text-gray-500">Email</dt><dd className="text-gray-900">{userData.email}</dd></div>
            <div><dt className="font-medium text-gray-500">Phone</dt><dd className="text-gray-900">{userData.phone}</dd></div>
            <div><dt className="font-medium text-gray-500">Company</dt><dd className="text-gray-900">{userData.company}</dd></div>
            <div className="sm:col-span-2"><dt className="font-medium text-gray-500">Bio</dt><dd className="text-gray-900">{userData.bio}</dd></div>
          </dl>
        )}
      </div>
    </div>
  );
};

const UserEvents = () => <div className="p-6">My Events section coming soon...</div>;

const UserSettings = () => {
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(getAuth(), provider);
    } catch (error) {
      console.error('Google login failed', error);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Social Login</h3>
      <button
        onClick={handleGoogleLogin}
        className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Continue with Google
      </button>
    </div>
  );
};

const Feedback = () => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">We value your feedback</h3>
      <textarea
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
        rows="5"
        placeholder="Let us know what you think..."
      ></textarea>
      <div className="mt-4 text-right">
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default UserProfile;

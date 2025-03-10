import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Edit, LogOut, Settings } from 'lucide-react';
import Navbar from "../components/Navbar"

const UserProfile = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('profile');
  
  // Tabs configuration
  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'events', label: 'My Events', icon: <Calendar className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ];
  
  // Render appropriate content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileInfo />;
      case 'events':
        return <UserEvents />;
      case 'settings':
        return <UserSettings />;
      default:
        return <ProfileInfo />;
    }
  };

  return (
    <div className="min-h-screen bg-grey">

      
      {/* Simple Profile Header */}
      <div className="bg-white shadow ">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW05qlVj4S5K9HLzyiOpwFr1Ui33gmmcrykg&s"
              alt="Profile"
              className="h-20 w-20 rounded-full bg-gray-200 object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tony Stark</h1>
              <p className="text-sm text-gray-500">Event Planner | Member since January 2023</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar with tabs */}
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
                    <span className={`mr-3 ${activeTab === tab.id ? 'text-indigo-500' : 'text-gray-400'}`}>
                      {tab.icon}
                    </span>
                    {tab.label}
                  </button>
                ))}
                
                {/* Logout button */}
                <button className="w-full flex items-center px-3 py-3 mt-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50">
                  <LogOut className="mr-3 h-5 w-5 text-red-500" />
                  Sign Out
                </button>
              </div>
            </nav>
          </div>
          
          {/* Main content area */}
          <div className="mt-8 lg:mt-0 lg:col-span-9">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Profile information component
const ProfileInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Sample user data
  const [userData, setUserData] = useState({
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Creative Events Inc.',
    bio: 'Passionate event planner with over 8 years of experience in corporate and social events.'
  });
  
  const handleSave = () => {
    setIsEditing(false);
    console.log('Saving profile data:', userData);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };
  
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
      
      {isEditing ? (
        <div className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={userData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={userData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={userData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone number
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  value={userData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company
              </label>
              <input
                type="text"
                name="company"
                id="company"
                value={userData.company}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                value={userData.bio}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {userData.firstName} {userData.lastName}
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900">{userData.email}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{userData.phone}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Company</dt>
              <dd className="mt-1 text-sm text-gray-900">{userData.company}</dd>
            </div>
            
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Bio</dt>
              <dd className="mt-1 text-sm text-gray-900">{userData.bio}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
};

// User Events component
const UserEvents = () => {
  // Sample events data
  const events = [
    {
      id: 1,
      title: 'Annual Tech Conference 2025',
      date: 'Apr 15-17, 2025',
      location: 'San Francisco Convention Center',
      status: 'upcoming',
      attendees: 1200,
      thumbnail: '/api/placeholder/80/60'
    },
    {
      id: 2,
      title: 'Product Launch: EcoSmart Series',
      date: 'Mar 5, 2025',
      location: 'Virtual Event',
      status: 'upcoming',
      attendees: 850,
      thumbnail: '/api/placeholder/80/60'
    },
    {
      id: 3,
      title: 'Leadership Summit 2024',
      date: 'Dec 12, 2024',
      location: 'Hilton Downtown',
      status: 'completed',
      attendees: 350,
      thumbnail: '/api/placeholder/80/60'
    }
  ];
  
  // Filter events by status
  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  const pastEvents = events.filter(event => event.status === 'completed');
  
  return (
    <div>
      <div className="px-4 py-5 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">My Events</h3>
        <button className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
          Create New Event
        </button>
      </div>
      
      <div className="p-6">
        {/* Upcoming Events */}
        <h4 className="text-base font-medium text-gray-900 mb-4">Upcoming Events</h4>
        <div className="space-y-4 mb-8">
          {upcomingEvents.map(event => (
            <div key={event.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
              <div className="flex items-start">
                <img src={event.thumbnail} alt={event.title} className="h-16 w-16 object-cover rounded-md" />
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="text-lg font-medium text-gray-900">{event.title}</h5>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Upcoming
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    <p>{event.date} • {event.location}</p>
                    <p className="mt-1">{event.attendees} attendees</p>
                  </div>
                  <div className="mt-3">
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 mr-4">
                      Edit
                    </button>
                    <button className="text-sm text-indigo-600 hover:text-indigo-800">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Past Events */}
        <h4 className="text-base font-medium text-gray-900 mb-4">Past Events</h4>
        <div className="space-y-4">
          {pastEvents.map(event => (
            <div key={event.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
              <div className="flex items-start">
                <img src={event.thumbnail} alt={event.title} className="h-16 w-16 object-cover rounded-md" />
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="text-lg font-medium text-gray-900">{event.title}</h5>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      Completed
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    <p>{event.date} • {event.location}</p>
                    <p className="mt-1">{event.attendees} attendees</p>
                  </div>
                  <div className="mt-3">
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 mr-4">
                      View Report
                    </button>
                    <button className="text-sm text-indigo-600 hover:text-indigo-800">
                      Duplicate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// User Settings component - simplified
const UserSettings = () => {
  // Sample notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    eventReminders: true,
    marketingEmails: false,
  });
  
  const handleToggle = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };
  
  return (
    <div>
      <div className="px-4 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Settings</h3>
      </div>
      
      <div className="p-6">
        <h4 className="text-base font-medium text-gray-900 mb-4">Notification Preferences</h4>
        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Email Notifications</p>
              <p className="text-xs text-gray-500">Receive important updates about your events</p>
            </div>
            <div>
              <button
                type="button"
                className={`${
                  notificationSettings.emailNotifications ? 'bg-indigo-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none`}
                onClick={() => handleToggle('emailNotifications')}
              >
                <span
                  className={`${
                    notificationSettings.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200`}
                />
              </button>
            </div>
          </div>
          
          {/* Event Reminders */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Event Reminders</p>
              <p className="text-xs text-gray-500">Get reminded about upcoming events</p>
            </div>
            <div>
              <button
                type="button"
                className={`${
                  notificationSettings.eventReminders ? 'bg-indigo-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none`}
                onClick={() => handleToggle('eventReminders')}
              >
                <span
                  className={`${
                    notificationSettings.eventReminders ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200`}
                />
              </button>
            </div>
          </div>
          
          {/* Marketing Emails */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Marketing Emails</p>
              <p className="text-xs text-gray-500">Receive news and offers about Sentinent Stories</p>
            </div>
            <div>
              <button
                type="button"
                className={`${
                  notificationSettings.marketingEmails ? 'bg-indigo-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none`}
                onClick={() => handleToggle('marketingEmails')}
              >
                <span
                  className={`${
                    notificationSettings.marketingEmails ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200`}
                />
              </button>
            </div>
          </div>
        </div>
        
        {/* Account Preferences - simplified */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-base font-medium text-gray-900 mb-4">Account Preferences</h4>
          
          <div className="space-y-4">
            {/* Language Preference */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                Language
              </label>
              <select
                id="language"
                name="language"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
            
            {/* Time Zone */}
            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                Time Zone
              </label>
              <select
                id="timezone"
                name="timezone"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option>(GMT-08:00) Pacific Time</option>
                <option>(GMT-05:00) Eastern Time</option>
                <option>(GMT) Greenwich Mean Time</option>
                <option>(GMT+01:00) Central European Time</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
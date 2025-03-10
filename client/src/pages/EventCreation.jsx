import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign, 
  Tag, 
  Image, 
  FileText, 
  Cloud, 
  Smile, 
  ChevronLeft, 
  Save, 
  X, 
  Plus 
} from 'lucide-react';

const EventCreation = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    virtualEvent: false,
    capacity: '',
    budget: '',
    description: '',
    category: '',
    imageUrl: '',
    tags: []
  });
  
  const [tagInput, setTagInput] = useState('');
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };
  
  const handleTagRemove = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Event data:', formData);
    // Submit form logic would go here
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <a href="/dashboard" className="text-indigo-600 hover:text-indigo-800 flex items-center">
                <ChevronLeft className="h-5 w-5 mr-1" />
                Back to Dashboard
              </a>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Create New Event</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>
      
      <main className="py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit}>
            <div className="bg-white shadow overflow-hidden rounded-lg">
              {/* Basic Info Section */}
              <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Event Information</h3>
                <p className="mt-1 text-sm text-gray-500">Basic details about your event</p>
              </div>
              
              <div className="px-4 py-5 sm:p-6 space-y-6">
                <div>
                  <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">
                    Event Name
                  </label>
                  <input
                    type="text"
                    name="eventName"
                    id="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Annual Tech Conference 2025"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Event Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select a category</option>
                      <option value="conference">Conference</option>
                      <option value="seminar">Seminar</option>
                      <option value="workshop">Workshop</option>
                      <option value="product-launch">Product Launch</option>
                      <option value="team-building">Team Building</option>
                      <option value="networking">Networking</option>
                      <option value="corporate">Corporate Event</option>
                      <option value="celebration">Celebration</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center h-5">
                      <input
                        id="virtualEvent"
                        name="virtualEvent"
                        type="checkbox"
                        checked={formData.virtualEvent}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <label htmlFor="virtualEvent" className="font-medium text-gray-700">
                      This is a virtual event
                    </label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="startDate"
                        id="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="endDate"
                        id="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                      Start Time
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="time"
                        name="startTime"
                        id="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                      End Time
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="time"
                        name="endTime"
                        id="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="location"
                      id="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder={formData.virtualEvent ? "Zoom/Teams Meeting Link" : "Venue Address"}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                      Expected Attendees
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="capacity"
                        id="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="500"
                        min="1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                      Budget
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="budget"
                        id="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="25000"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Description Section */}
              <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-t border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Event Description</h3>
                <p className="mt-1 text-sm text-gray-500">Provide details about your event</p>
              </div>
              
              <div className="px-4 py-5 sm:p-6 space-y-6">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={5}
                      value={formData.description}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Enter a detailed description of your event..."
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                    Event Image URL
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <div className="relative flex items-stretch flex-grow focus-within:z-10">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Image className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="imageUrl"
                        id="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <button
                      type="button"
                      className="relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <FileText className="h-5 w-5 text-gray-400" />
                      <span>Browse</span>
                    </button>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                    Tags
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <div className="relative flex items-stretch flex-grow focus-within:z-10">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Tag className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="tagInput"
                        id="tagInput"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md pl-10 sm:text-sm border-gray-300"
                        placeholder="Add tags..."
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleTagAdd}
                      className="relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <Plus className="h-5 w-5 text-gray-400" />
                      <span>Add</span>
                    </button>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap">
                    {formData.tags.map(tag => (
                      <span key={tag} className="inline-flex rounded-full items-center py-0.5 pl-2.5 pr-1 text-sm font-medium bg-indigo-100 text-indigo-700 mr-2 mb-2">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleTagRemove(tag)}
                          className="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white"
                        >
                          <span className="sr-only">Remove {tag} tag</span>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Event Experience Section */}
              <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-t border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">AI-Enhanced Event Experience</h3>
                <p className="mt-1 text-sm text-gray-500">Optimize your event for maximum emotional impact</p>
              </div>
              
              <div className="px-4 py-5 sm:p-6 space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Cloud className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Weather-Mood Adapter</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>Our AI will analyze weather patterns for your event dates and suggest optimal settings to enhance attendee experience based on predicted weather conditions.</p>
                      </div>
                      <div className="mt-4">
                        <div className="-mx-2 -my-1.5 flex">
                          <button type="button" className="px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Enable Weather Analysis
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Smile className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-purple-800">Emotional Journey Mapper</h3>
                      <div className="mt-2 text-sm text-purple-700">
                        <p>Design your event flow to create specific emotional experiences. Our AI suggests an emotional journey based on your event type and goals.</p>
                      </div>
                      <div className="mt-4">
                        <div className="-mx-2 -my-1.5 flex">
                          <button type="button" className="px-3 py-1.5 bg-purple-100 text-purple-800 text-xs font-medium rounded-md hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                            Design Emotional Journey
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Form Actions */}
              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Draft
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Create Event
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EventCreation;
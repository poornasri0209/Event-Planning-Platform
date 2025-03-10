import React, { useState } from 'react';
import { Star, Send, Menu, X, User } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <a href="/" className="text-2xl font-bold text-indigo-600">
                Sentinent Stories
              </a>
            </div>
            
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <a href="/events" className="text-gray-500 hover:text-indigo-600 px-3 py-2 font-medium">
                Events
              </a>
              <a href="/dashboard" className="text-gray-500 hover:text-indigo-600 px-3 py-2 font-medium">
                Dashboard
              </a>
              <a href="/feedback" className="text-indigo-600 border-b-2 border-indigo-600 px-3 py-2 font-medium">
                Feedback
              </a>
              <a href="/contact" className="text-gray-500 hover:text-indigo-600 px-3 py-2 font-medium">
                Contact
              </a>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="hidden md:flex items-center">
              <a href="/profile" className="text-gray-500 hover:text-indigo-600 flex items-center px-3 py-2 font-medium">
                <User className="h-5 w-5 mr-1" />
                My Profile
              </a>
            </div>
            
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-indigo-600"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="/events" className="text-gray-500 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium">
              Events
            </a>
            <a href="/dashboard" className="text-gray-500 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium">
              Dashboard
            </a>
            <a href="/feedback" className="bg-indigo-50 text-indigo-600 block px-3 py-2 rounded-md text-base font-medium">
              Feedback
            </a>
            <a href="/contact" className="text-gray-500 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium">
              Contact
            </a>
            <a href="/profile" className="text-gray-500 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium">
              My Profile
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

const UserFeedbackPage = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    rating: 0,
    feedback: '',
    name: '',
    email: '',
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  
  const handleRatingClick = (rating) => {
    setFormData({
      ...formData,
      rating
    });
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting feedback:', formData);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Share Your Event Experience</h1>
          <p className="mt-2 text-lg text-gray-600">
            Your feedback helps us create even better events in the future
          </p>
        </div>
        
        {submitted ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-gray-900">Thank You for Your Feedback!</h2>
            <p className="mt-2 text-gray-600">
              We appreciate your input and will use it to improve our events.
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    eventName: '',
                    rating: 0,
                    feedback: '',
                    name: '',
                    email: '',
                  });
                }}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Submit another feedback
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-indigo-50 border-b border-gray-200">
              <h2 className="text-xl font-medium text-gray-900">Event Feedback Form</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
                  Which event are you rating?
                </label>
                <select
                  id="eventName"
                  name="eventName"
                  required
                  value={formData.eventName}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select an event</option>
                  <option value="tech-conference">Annual Tech Conference 2025</option>
                  <option value="product-launch">Product Launch: EcoSmart Series</option>
                  <option value="leadership-summit">Leadership Summit 2024</option>
                  <option value="team-building">Team Building Retreat</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  How would you rate your overall experience?
                </label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleRatingClick(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          (hoverRating || formData.rating) >= star
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-500">
                    {formData.rating > 0 ? `${formData.rating} out of 5 stars` : 'Click to rate'}
                  </span>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                  What did you like or dislike about the event?
                </label>
                <textarea
                  id="feedback"
                  name="feedback"
                  rows={4}
                  required
                  value={formData.feedback}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Please share your thoughts about the event..."
                />
              </div>
              
              <div className="pt-4 mb-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Information (Optional)</h3>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <p className="mt-2 text-xs text-gray-500">
                  We'll never share your personal information with anyone else.
                </p>
              </div>
              
              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserFeedbackPage;
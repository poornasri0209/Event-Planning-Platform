import React, { useState, useEffect } from 'react';
import { Star, Send } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const UserFeedbackPage = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    rating: 0,
    feedback: '',
    name: '',
    email: '',
  });
  const [events, setEvents] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    // If user is logged in, pre-fill name and email
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        email: currentUser.email || '',
        name: currentUser.displayName || ''
      }));
    }

    // Fetch events from Firestore
    const fetchEvents = async () => {
      try {
        // For demo purposes, we'll just use the static list
        // In production, uncomment this to fetch from Firestore
        /*
        const eventsSnapshot = await getDocs(collection(db, 'events'));
        const eventsList = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          value: doc.id,
          label: doc.data().title
        }));
        setEvents(eventsList);
        */

        // Static list of events for demo
        setEvents([
          { id: 'tech-conference', value: 'tech-conference', label: 'Annual Tech Conference 2025' },
          { id: 'product-launch', value: 'product-launch', label: 'Product Launch: EcoSmart Series' },
          { id: 'leadership-summit', value: 'leadership-summit', label: 'Leadership Summit 2024' },
          { id: 'team-building', value: 'team-building', label: 'Team Building Retreat' },
          { id: 'charity-gala', value: 'charity-gala', label: 'Charity Gala Dinner' },
          { id: 'networking-mixer', value: 'networking-mixer', label: 'Industry Networking Mixer' }
        ]);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [currentUser]);

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Add feedback to Firestore
      await addDoc(collection(db, 'feedbacks'), {
        ...formData,
        userId: currentUser?.uid || 'anonymous',
        timestamp: serverTimestamp(),
      });
      
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('There was an error submitting your feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Share Your Event Experience</h1>
          <p className="mt-2 text-lg text-gray-600">
            Your feedback helps us create even more memorable events
          </p>
        </div>

        {submitted ? (
          <div className="bg-white shadow-lg rounded-lg p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-medium text-gray-900 mb-4">Thank You for Your Feedback!</h2>
            <p className="text-gray-600 text-lg mb-6">
              We appreciate your input and will use it to enhance future events.
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    eventName: '',
                    rating: 0,
                    feedback: '',
                    name: currentUser?.displayName || '',
                    email: currentUser?.email || '',
                  });
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit Another Feedback
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 border-b border-gray-200">
              <h2 className="text-xl font-medium text-white">Event Feedback Form</h2>
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
                  {events.map(event => (
                    <option key={event.id} value={event.value}>
                      {event.label}
                    </option>
                  ))}
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
                  placeholder="Please share your thoughts about the event experience, organization, content, and any suggestions for improvement..."
                />
              </div>
              
              <div className="pt-4 mb-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Information</h3>
                
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
                  Your information helps us follow up on your feedback if needed. We respect your privacy and will never share your data.
                </p>
              </div>
              
              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={loading || formData.rating === 0}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    loading || formData.rating === 0 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {loading ? 'Submitting...' : 'Submit Feedback'}
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
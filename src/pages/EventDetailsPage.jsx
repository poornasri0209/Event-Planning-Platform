import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Tag, 
  ChevronLeft, 
  Edit,
  Trash2,
  DollarSign,
  Cloud,
  Smile,
  Briefcase,
  Package,
  CheckCircle,
  Mail,
  Phone,
  Globe,
  FileText,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

const EventDetailsPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Fetch event on component mount
  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  // Function to fetch event details
  const fetchEvent = async () => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    try {
      setLoading(true);
      
      const eventRef = doc(db, 'events', eventId);
      const eventSnap = await getDoc(eventRef);
      
      if (eventSnap.exists()) {
        const eventData = eventSnap.data();
        
        // Verify that the current user is the creator of this event
        if (eventData.createdBy !== currentUser.uid) {
          setError('You do not have permission to view this event.');
          setLoading(false);
          return;
        }
        
        // Format dates
        if (eventData.createdAt) {
          eventData.createdAtFormatted = eventData.createdAt.toDate().toLocaleString();
        }
        
        setEvent({
          id: eventSnap.id,
          ...eventData
        });
      } else {
        setError('Event not found.');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event:', error);
      setError('Failed to load event details. Please try again later.');
      setLoading(false);
    }
  };

  // Function to mark event as completed
  const handleMarkCompleted = async () => {
    try {
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, {
        status: 'Completed'
      });
      
      // Update local state
      setEvent({
        ...event,
        status: 'Completed'
      });
      
    } catch (error) {
      console.error('Error updating event status:', error);
      setError('Failed to update event status. Please try again.');
    }
  };

  // Function to handle event deletion
  const handleDeleteEvent = async () => {
    try {
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, {
        status: 'Cancelled'
      });
      
      setShowDeleteModal(false);
      navigate('/myevents');
    } catch (error) {
      console.error('Error cancelling event:', error);
      setError('Failed to cancel event. Please try again.');
    }
  };

  // Function to navigate to edit page
  const handleEditEvent = () => {
    navigate(`/myevents/${eventId}/edit`);
  };

  // Function to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Function to get status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Upcoming':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/myevents')}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to My Events
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : event ? (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Event Header */}
            <div className="relative h-64 bg-gradient-to-r from-indigo-600 to-purple-600">
              {event.imageUrl && (
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-30"
                  style={{ backgroundImage: `url(${event.imageUrl})` }}
                ></div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{event.eventName}</h1>
                    <div className="flex flex-wrap items-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(event.status)} bg-opacity-70 mr-3 mb-2`}>
                        {event.status}
                      </span>
                      <span className="flex items-center mr-3 mb-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(event.startDate)}
                      </span>
                      <span className="flex items-center mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-4 sm:mt-0 space-x-2">
                    {event.status === 'In Progress' && (
                      <button
                        onClick={handleMarkCompleted}
                        className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark Completed
                      </button>
                    )}
                    <button
                      onClick={handleEditEvent}
                      className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Cancel Event
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Event Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Event Details */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Description */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
                    <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
                  </div>
                  
                  {/* Dates & Times */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Date & Time</h2>
                    <div className="bg-gray-50 rounded-md p-4 space-y-3">
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-indigo-500 mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Date</p>
                          <p className="text-gray-700">
                            {formatDate(event.startDate)}
                            {event.endDate && event.endDate !== event.startDate && ` - ${formatDate(event.endDate)}`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-indigo-500 mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Time</p>
                          <p className="text-gray-700">
                            {event.startTime}
                            {event.endTime && ` - ${event.endTime}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
                    <div className="bg-gray-50 rounded-md p-4">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-indigo-500 mr-3 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {event.virtualEvent ? 'Virtual Event' : 'Venue Address'}
                          </p>
                          <p className="text-gray-700">{event.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Vendors */}
                  {event.vendor && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Vendor</h2>
                      <div className="bg-gray-50 rounded-md p-4">
                        <div className="flex items-start">
                          <Briefcase className="h-5 w-5 text-indigo-500 mr-3 mt-0.5" />
                          <div>
                            <p className="font-medium text-gray-900">{event.vendor.name}</p>
                            <p className="text-gray-600">{event.vendor.companyName}</p>
                            <div className="mt-2 text-sm text-gray-700">
                              <p>Email: {event.vendor.email}</p>
                              <p>Phone: {event.vendor.phone}</p>
                              <p>Budget: {event.vendor.budget}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Resources */}
                  {event.resources && event.resources.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Resources</h2>
                      <div className="bg-gray-50 rounded-md p-4">
                        <div className="flex items-start">
                          <Package className="h-5 w-5 text-indigo-500 mr-3 mt-0.5" />
                          <div className="flex-grow">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {event.resources.map((resource, index) => (
                                <div key={index} className="border border-gray-200 rounded-md bg-white p-3">
                                  <p className="font-medium text-gray-900">{resource.name}</p>
                                  <p className="text-sm text-gray-600">{resource.type}</p>
                                  <p className="text-sm text-gray-700 mt-1">Value: {resource.value}</p>
                                </div>
                              ))}
                            </div>
                            <p className="mt-3 text-sm text-gray-700">
                              Total Resources Budget: ${event.resourcesBudget || '0.00'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* AI Features */}
                  {(event.weatherAdapter || event.emotionalJourney) && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Features</h2>
                      <div className="space-y-4">
                        {event.weatherAdapter && (
                          <div className="bg-blue-50 rounded-md p-4 border border-blue-100">
                            <div className="flex items-start">
                              <Cloud className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                              <div>
                                <p className="font-medium text-blue-900">Weather-Mood Adapter</p>
                                <p className="text-blue-700 text-sm mt-1">
                                  Our AI will analyze weather patterns for your event dates and suggest optimal settings to enhance attendee experience based on predicted weather conditions.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {event.emotionalJourney && (
                          <div className="bg-purple-50 rounded-md p-4 border border-purple-100">
                            <div className="flex items-start">
                              <Smile className="h-5 w-5 text-purple-500 mr-3 mt-0.5" />
                              <div>
                                <p className="font-medium text-purple-900">Emotional Journey Mapper</p>
                                <p className="text-purple-700 text-sm mt-1">
                                  Our AI maps out a complete emotional journey tailored to your event goals, with detailed schedule of carefully designed emotional touchpoints.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Additional Notes */}
                  {event.notes && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Notes</h2>
                      <div className="bg-gray-50 rounded-md p-4">
                        <div className="flex items-start">
                          <MessageSquare className="h-5 w-5 text-indigo-500 mr-3 mt-0.5" />
                          <p className="text-gray-700 whitespace-pre-line">{event.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Sidebar */}
                <div className="lg:col-span-1">
                  {/* Event Status Card */}
                  <div className="bg-white rounded-lg shadow-md p-5 mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Event Status</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(event.status)}`}>
                          {event.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="text-gray-900">{event.createdAtFormatted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Budget:</span>
                        <span className="text-gray-900">${event.budget}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Status:</span>
                        <span className="text-green-600 font-medium">Completed</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Amount:</span>
                        <span className="text-gray-900">${event.paymentAmount?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Attendees */}
                  <div className="bg-white rounded-lg shadow-md p-5 mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Attendees</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expected Attendees:</span>
                        <span className="text-gray-900">{event.capacity || '0'}</span>
                      </div>
                      {event.ticketRequired && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ticket Price:</span>
                          <span className="text-gray-900">${event.ticketPrice || '0.00'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Contact Information */}
                  <div className="bg-white rounded-lg shadow-md p-5 mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      {event.contactEmail && (
                        <div className="flex items-start">
                          <Mail className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{event.contactEmail}</span>
                        </div>
                      )}
                      {event.contactPhone && (
                        <div className="flex items-start">
                          <Phone className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{event.contactPhone}</span>
                        </div>
                      )}
                      {event.website && (
                        <div className="flex items-start">
                          <Globe className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
                          <a href={event.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                            Event Website
                          </a>
                        </div>
                      )}
                      {event.registrationLink && (
                        <div className="flex items-start">
                          <FileText className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
                          <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                            Registration Link
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-5">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
                      <div className="flex flex-wrap">
                        {event.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center bg-indigo-100 text-indigo-800 text-xs px-2.5 py-0.5 rounded-full mr-2 mb-2"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-10 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Event not found</h3>
            <p className="text-gray-500 mb-6">
              The event you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <button
              onClick={() => navigate('/myevents')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to My Events
            </button>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Cancel Event</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to cancel this event? This will mark the event as cancelled but will not delete it from your records.
            </p>
            <div className="mt-5 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setShowDeleteModal(false)}
              >
                No, Keep Event
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                onClick={handleDeleteEvent}
              >
                Yes, Cancel Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetailsPage;
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Search,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Filter,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Cloud,
  Smile
} from 'lucide-react';
import { collection, query, getDocs, orderBy, doc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { currentUser } = useAuth();

  // Fetch events on component mount
  useEffect(() => {
    if (currentUser) {
      fetchEvents();
    }
  }, [currentUser]);

  // Filter and sort events when relevant state changes
  useEffect(() => {
    filterAndSortEvents();
  }, [searchQuery, statusFilter, sortBy, events]);

  // Function to fetch all events from Firestore
  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      // Create query to get all events
      const eventsRef = collection(db, 'events');
      let eventsQuery;
      
      // If status filter is applied, add it to the query
      if (statusFilter !== 'All') {
        eventsQuery = query(
          eventsRef,
          where('status', '==', statusFilter),
          orderBy('createdAt', 'desc')
        );
      } else {
        eventsQuery = query(
          eventsRef,
          orderBy('createdAt', 'desc')
        );
      }
      
      // Execute the query
      const querySnapshot = await getDocs(eventsQuery);
      
      // Process the results
      const fetchedEvents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date()
      }));
      
      setEvents(fetchedEvents);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Please try again later.');
      setLoading(false);
    }
  };

  // Function to filter and sort events based on current filters
  const filterAndSortEvents = () => {
    if (!events || events.length === 0) {
      setFilteredEvents([]);
      return;
    }
    
    let filtered = [...events];
    
    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.eventName?.toLowerCase().includes(query) ||
        event.location?.toLowerCase().includes(query) ||
        event.category?.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.userEmail?.toLowerCase().includes(query) ||
        (event.tags && event.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'upcoming') {
        const aDate = a.startDate ? new Date(a.startDate) : new Date(9999, 11, 31);
        const bDate = b.startDate ? new Date(b.startDate) : new Date(9999, 11, 31);
        return aDate - bDate;
      } else if (sortBy === 'alphabetical') {
        return (a.eventName || '').localeCompare(b.eventName || '');
      } else if (sortBy === 'budget-high') {
        return parseFloat(b.budget || 0) - parseFloat(a.budget || 0);
      } else if (sortBy === 'budget-low') {
        return parseFloat(a.budget || 0) - parseFloat(b.budget || 0);
      }
      return 0;
    });
    
    setFilteredEvents(filtered);
  };

  // Function to handle marking an event as completed
  const handleMarkCompleted = async (eventId) => {
    try {
      setIsUpdatingStatus(true);
      
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, {
        status: 'Completed'
      });
      
      // Update local state
      setEvents(events.map(event => 
        event.id === eventId 
          ? { ...event, status: 'Completed' } 
          : event
      ));
      
      if (selectedEvent && selectedEvent.id === eventId) {
        setSelectedEvent({ ...selectedEvent, status: 'Completed' });
      }
      
      setIsUpdatingStatus(false);
    } catch (error) {
      console.error('Error updating event status:', error);
      setError('Failed to update event status. Please try again.');
      setIsUpdatingStatus(false);
    }
  };

  // Function to handle cancelling an event
  const handleCancelEvent = async () => {
    if (!eventToDelete) return;
    
    try {
      const eventRef = doc(db, 'events', eventToDelete.id);
      await updateDoc(eventRef, {
        status: 'Cancelled'
      });
      
      // Update local state
      setEvents(events.map(event => 
        event.id === eventToDelete.id 
          ? { ...event, status: 'Cancelled' } 
          : event
      ));
      
      if (selectedEvent && selectedEvent.id === eventToDelete.id) {
        setSelectedEvent({ ...selectedEvent, status: 'Cancelled' });
      }
      
      setShowDeleteModal(false);
      setEventToDelete(null);
    } catch (error) {
      console.error('Error cancelling event:', error);
      setError('Failed to cancel event. Please try again.');
    }
  };

  // Function to view event details
  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
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
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Event Management</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => fetchEvents()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Refresh Events
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="p-5 border-b border-gray-200">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <div className="md:col-span-2 lg:col-span-2">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search events by name, location, user email, etc."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="All">All Statuses</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="upcoming">Upcoming Events</option>
                <option value="alphabetical">A-Z</option>
                <option value="budget-high">Budget (High to Low)</option>
                <option value="budget-low">Budget (Low to High)</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Events Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
            </div>
          ) : error ? (
            <div className="p-5">
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="p-5 text-center">
              <div className="py-12">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
                  <Calendar className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchQuery || statusFilter !== 'All' 
                    ? "No events match your current filters. Try adjusting your search or filters."
                    : "There are no events in the system yet."}
                </p>
              </div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created By
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{event.eventName}</div>
                          <div className="text-sm text-gray-500">{event.category}</div>
                          <div className="flex items-center mt-1">
                            <Users className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">{event.capacity || '0'} Attendees</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(event.startDate)}</div>
                      {event.startTime && (
                        <div className="text-sm text-gray-500">
                          {event.startTime} {event.endTime && `- ${event.endTime}`}
                        </div>
                      )}
                      {event.endDate && event.endDate !== event.startDate && (
                        <div className="text-sm text-gray-500">to {formatDate(event.endDate)}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="truncate max-w-xs">{event.location || 'Not specified'}</span>
                      </div>
                      {event.virtualEvent && (
                        <div className="text-xs text-indigo-600 mt-1">Virtual Event</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(event.status)}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{event.userEmail || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">
                        {event.createdAt ? new Date(event.createdAt).toLocaleDateString() : 'Unknown date'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${parseFloat(event.budget || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewEvent(event)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        {event.status === 'In Progress' && (
                          <button
                            onClick={() => handleMarkCompleted(event.id)}
                            className="text-green-600 hover:text-green-900"
                            disabled={isUpdatingStatus}
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                        )}
                        {event.status !== 'Cancelled' && (
                          <button
                            onClick={() => {
                              setEventToDelete(event);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      {showEventDetails && selectedEvent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-5xl shadow-lg rounded-md bg-white">
            {/* Modal header */}
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Event Details</h3>
              <button
                onClick={() => setShowEventDetails(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal content */}
            <div className="overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main information column */}
                <div className="md:col-span-2 space-y-6">
                  {/* Event header */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.eventName}</h2>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedEvent.status)}`}>
                        {selectedEvent.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {selectedEvent.category && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                            {selectedEvent.category}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-line">{selectedEvent.description || 'No description provided.'}</p>
                  </div>
                  
                  {/* Date and Time */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Date & Time</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-indigo-500 mr-2" />
                        <span className="text-gray-700">
                          {formatDate(selectedEvent.startDate)}
                          {selectedEvent.endDate && selectedEvent.endDate !== selectedEvent.startDate && ` - ${formatDate(selectedEvent.endDate)}`}
                        </span>
                      </div>
                      {(selectedEvent.startTime || selectedEvent.endTime) && (
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-indigo-500 mr-2" />
                          <span className="text-gray-700">
                            {selectedEvent.startTime}
                            {selectedEvent.endTime && ` - ${selectedEvent.endTime}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Location</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-indigo-500 mr-2" />
                        <span className="text-gray-700">
                          {selectedEvent.location || 'No location specified'}
                          {selectedEvent.virtualEvent && ' (Virtual Event)'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Vendor */}
                  {selectedEvent.vendor && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Vendor</h3>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <p><strong>Name:</strong> {selectedEvent.vendor.name}</p>
                        <p><strong>Company:</strong> {selectedEvent.vendor.companyName || 'Not specified'}</p>
                        <p><strong>Email:</strong> {selectedEvent.vendor.email || 'Not specified'}</p>
                        <p><strong>Phone:</strong> {selectedEvent.vendor.phone || 'Not specified'}</p>
                        <p><strong>Budget:</strong> {selectedEvent.vendor.budget || 'Not specified'}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Resources */}
                  {selectedEvent.resources && selectedEvent.resources.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Resources</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {selectedEvent.resources.map((resource, index) => (
                            <div key={index} className="border border-gray-200 rounded p-3 bg-white">
                              <p className="font-medium">{resource.name}</p>
                              <p className="text-sm text-gray-600">{resource.type}</p>
                              <p className="text-sm">Value: {resource.value}</p>
                            </div>
                          ))}
                        </div>
                        <p className="mt-3 text-sm font-medium">
                          Total Resources Budget: ${parseFloat(selectedEvent.resourcesBudget || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* AI Features */}
                  {(selectedEvent.weatherAdapter || selectedEvent.emotionalJourney) && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">AI Features</h3>
                      <div className="space-y-3">
                        {selectedEvent.weatherAdapter && (
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div className="flex items-start">
                              <Cloud className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                              <div>
                                <p className="font-medium text-blue-900">Weather-Mood Adapter</p>
                                <p className="text-sm text-blue-700 mt-1">
                                  AI-powered weather analysis and event adaptation for optimal attendee experience.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {selectedEvent.emotionalJourney && (
                          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <div className="flex items-start">
                              <Smile className="h-5 w-5 text-purple-500 mr-2 mt-0.5" />
                              <div>
                                <p className="font-medium text-purple-900">Emotional Journey Mapper</p>
                                <p className="text-sm text-purple-700 mt-1">
                                  AI-designed emotional flow to create memorable and impactful event experiences.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Additional Notes */}
                  {selectedEvent.notes && (
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Additional Notes</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-line">{selectedEvent.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Event Status */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 pb-2 border-b">Event Status</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Status:</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedEvent.status)}`}>
                          {selectedEvent.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Created:</span>
                        <span className="text-sm">
                          {selectedEvent.createdAt ? new Date(selectedEvent.createdAt).toLocaleDateString() : 'Unknown'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Created By:</span>
                        <span className="text-sm">{selectedEvent.userEmail || 'Unknown'}</span>
                      </div>
                    </div>
                    
                    {/* Status Actions */}
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Actions</h4>
                      <div className="space-y-2">
                        {selectedEvent.status === 'In Progress' && (
                          <button
                            onClick={() => handleMarkCompleted(selectedEvent.id)}
                            disabled={isUpdatingStatus}
                            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Completed
                          </button>
                        )}
                        {selectedEvent.status !== 'Cancelled' && (
                          <button
                            onClick={() => {
                              setEventToDelete(selectedEvent);
                              setShowDeleteModal(true);
                            }}
                            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Cancel Event
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Financial Information */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 pb-2 border-b">Financial Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Total Budget:</span>
                        <span className="font-medium">${parseFloat(selectedEvent.budget || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Payment Status:</span>
                        <span className="text-green-600 font-medium">
                          {selectedEvent.paymentStatus || 'Not Specified'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Payment Amount:</span>
                        <span className="font-medium">
                          ${parseFloat(selectedEvent.paymentAmount || 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Attendee Information */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 pb-2 border-b">Attendee Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Expected Attendees:</span>
                        <span className="font-medium">{selectedEvent.capacity || '0'}</span>
                      </div>
                      {selectedEvent.ticketRequired && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Ticket Price:</span>
                          <span className="font-medium">${selectedEvent.ticketPrice || '0.00'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Contact Information */}
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3 pb-2 border-b">Contact Information</h3>
                    <div className="space-y-2">
                      {selectedEvent.contactEmail && (
                        <div>
                          <span className="text-sm text-gray-500">Email:</span>
                          <p className="font-medium break-all">{selectedEvent.contactEmail}</p>
                        </div>
                      )}
                      {selectedEvent.contactPhone && (
                        <div>
                          <span className="text-sm text-gray-500">Phone:</span>
                          <p className="font-medium">{selectedEvent.contactPhone}</p>
                        </div>
                      )}
                      {selectedEvent.website && (
                        <div>
                          <span className="text-sm text-gray-500">Website:</span>
                          <p className="font-medium break-all">
                            <a href={selectedEvent.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                              {selectedEvent.website}
                            </a>
                          </p>
                        </div>
                      )}
                      {selectedEvent.registrationLink && (
                        <div>
                          <span className="text-sm text-gray-500">Registration:</span>
                          <p className="font-medium break-all">
                            <a href={selectedEvent.registrationLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                              {selectedEvent.registrationLink}
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Tags */}
                  {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-3 pb-2 border-b">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center bg-indigo-100 text-indigo-800 text-xs px-2.5 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Modal footer */}
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowEventDetails(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && eventToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Cancel Event</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to cancel the event "{eventToDelete.eventName}"? This will mark the event as cancelled but will not delete it from the system.
            </p>
            <div className="mt-5 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setShowDeleteModal(false);
                  setEventToDelete(null);
                }}
              >
                No, Keep Event
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                onClick={handleCancelEvent}
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

export default EventManagement;
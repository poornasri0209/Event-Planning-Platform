import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Tag, 
  PlusCircle, 
  Search,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  ChevronDown
} from 'lucide-react';

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, [currentUser]);

  // Filter and sort events when relevant state changes
  useEffect(() => {
    filterAndSortEvents();
  }, [searchQuery, statusFilter, sortBy, events]);

  // Function to fetch user's events from Firestore
  const fetchEvents = async () => {
    if (!currentUser) {
      navigate('/');
      return;
    }

    try {
      setLoading(true);
      
      // Create query to get user's events
      const eventsRef = collection(db, 'events');
      const q = query(
        eventsRef,
        where('createdBy', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      
      // Execute the query
      const querySnapshot = await getDocs(q);
      
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
      setError('Failed to load your events. Please try again later.');
      setLoading(false);
    }
  };

  // Function to filter and sort events based on current filters
  const filterAndSortEvents = () => {
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
        return a.eventName.localeCompare(b.eventName);
      }
      return 0;
    });
    
    setFilteredEvents(filtered);
  };

  // Function to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  // Function to handle creating a new event
  const handleCreateEvent = () => {
    navigate('/events');
  };

  // Function to view event details
  const handleViewEvent = (eventId) => {
    navigate(`/myevents/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
            <p className="mt-2 text-gray-600">
              Manage and track all your events in one place
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <button
              onClick={handleCreateEvent}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Create New Event
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white shadow rounded-lg mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="flex-grow mb-4 md:mb-0">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <div className="mb-4 sm:mb-0">
                <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="All">All</option>
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
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Events List */}
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
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map(event => (
              <div 
                key={event.id} 
                className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div 
                  className="h-48 bg-gray-200 bg-cover bg-center relative" 
                  style={{ backgroundImage: event.imageUrl ? `url(${event.imageUrl})` : 'none' }}
                >
                  {!event.imageUrl && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Calendar className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{event.eventName}</h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">
                        {formatDate(event.startDate)}
                        {event.endDate && event.endDate !== event.startDate && ` - ${formatDate(event.endDate)}`}
                      </span>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">
                        {event.startTime}
                        {event.endTime && ` - ${event.endTime}`}
                      </span>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600 line-clamp-1">{event.location || 'Location TBD'}</span>
                    </div>
                    
                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{event.capacity || '0'} Attendees</span>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap mb-4">
                      {event.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center bg-indigo-100 text-indigo-800 text-xs px-2.5 py-0.5 rounded-full mr-2 mb-2"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                      {event.tags.length > 3 && (
                        <span className="inline-flex items-center bg-gray-100 text-gray-800 text-xs px-2.5 py-0.5 rounded-full mr-2 mb-2">
                          +{event.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* AI Features */}
                  <div className="mb-4">
                    {(event.weatherAdapter || event.emotionalJourney) && (
                      <p className="text-xs text-gray-500 font-medium mb-1">AI Features:</p>
                    )}
                    <div className="flex flex-wrap">
                      {event.weatherAdapter && (
                        <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-1">
                          Weather-Mood Adapter
                        </span>
                      )}
                      {event.emotionalJourney && (
                        <span className="inline-flex items-center bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded mr-2 mb-1">
                          Emotional Journey Mapper
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2 pt-2 mt-2 border-t border-gray-100">
                    <button 
                      onClick={() => handleViewEvent(event.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-10 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
              <Calendar className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || statusFilter !== 'All' 
                ? "No events match your current filters. Try adjusting your search or filters."
                : "You haven't created any events yet. Start by creating your first event!"}
            </p>
            <button
              onClick={handleCreateEvent}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Create New Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEventsPage;    
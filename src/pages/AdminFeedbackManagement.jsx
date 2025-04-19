import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Search, 
  SortAsc, 
  SortDesc, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  Clock,
  Mail,
  User,
  MessageSquare,
  X,
  AlertCircle,
  Filter
} from 'lucide-react';
import { collection, query, getDocs, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';

const AdminFeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [showDetail, setShowDetail] = useState(null);
  const [expandedFeedbacks, setExpandedFeedbacks] = useState({});
  
  // Fetch feedbacks on component mount
  useEffect(() => {
    fetchFeedbacks();
  }, []);
  
  // Filter and sort feedbacks when relevant state changes
  useEffect(() => {
    filterAndSortFeedbacks();
  }, [searchQuery, sortField, sortDirection, ratingFilter, feedbacks]);
  
  // Function to fetch feedbacks from Firestore
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      
      // Create query to get all feedbacks
      const feedbacksCollection = collection(db, 'feedbacks');
      const feedbacksQuery = query(
        feedbacksCollection,
        orderBy('timestamp', 'desc')
      );
      
      // Execute the query
      const querySnapshot = await getDocs(feedbacksQuery);
      
      // Process the results
      const fetchedFeedbacks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp ? doc.data().timestamp.toDate() : new Date()
      }));
      
      setFeedbacks(fetchedFeedbacks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      setError('Failed to load feedbacks. Please try again later.');
      setLoading(false);
    }
  };
  
  // Function to filter and sort feedbacks based on current filters and sort settings
  const filterAndSortFeedbacks = () => {
    if (!feedbacks || feedbacks.length === 0) {
      setFilteredFeedbacks([]);
      return;
    }
    
    let filtered = [...feedbacks];
    
    // Apply rating filter
    if (ratingFilter !== 'all') {
      const ratingValue = parseInt(ratingFilter);
      filtered = filtered.filter(feedback => feedback.rating === ratingValue);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(feedback => 
        feedback.eventName?.toLowerCase().includes(query) ||
        feedback.feedback?.toLowerCase().includes(query) ||
        feedback.name?.toLowerCase().includes(query) ||
        feedback.email?.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let fieldA, fieldB;
      
      // Handle different field types
      switch (sortField) {
        case 'timestamp':
          fieldA = a.timestamp ? new Date(a.timestamp) : new Date(0);
          fieldB = b.timestamp ? new Date(b.timestamp) : new Date(0);
          break;
        case 'rating':
          fieldA = a.rating || 0;
          fieldB = b.rating || 0;
          break;
        case 'eventName':
          fieldA = a.eventName || '';
          fieldB = b.eventName || '';
          return sortDirection === 'asc' 
            ? fieldA.localeCompare(fieldB)
            : fieldB.localeCompare(fieldA);
        case 'name':
          fieldA = a.name || '';
          fieldB = b.name || '';
          return sortDirection === 'asc' 
            ? fieldA.localeCompare(fieldB)
            : fieldB.localeCompare(fieldA);
        default:
          fieldA = a[sortField] || 0;
          fieldB = b[sortField] || 0;
      }
      
      return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA;
    });
    
    setFilteredFeedbacks(filtered);
  };
  
  // Function to toggle sort direction and set sort field
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to descending for dates, ascending for others
      setSortField(field);
      setSortDirection(field === 'timestamp' ? 'desc' : 'asc');
    }
  };
  
  // Function to render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };
  
  // Function to format date
  const formatDate = (date) => {
    if (!date) return 'Unknown';
    
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Function to toggle feedback detail view
  const toggleFeedbackDetail = (feedbackId) => {
    if (showDetail === feedbackId) {
      setShowDetail(null);
    } else {
      setShowDetail(feedbackId);
    }
  };
  
  // Function to toggle expanded view of feedback text
  const toggleFeedbackExpanded = (feedbackId) => {
    setExpandedFeedbacks(prev => ({
      ...prev,
      [feedbackId]: !prev[feedbackId]
    }));
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Customer Feedback Management</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchFeedbacks}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Refresh Feedbacks
            </button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="p-5 border-b border-gray-200">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by event name, feedback content, or customer name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="ratingFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Rating
              </label>
              <select
                id="ratingFilter"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Feedback Table */}
        <div>
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
          ) : filteredFeedbacks.length === 0 ? (
            <div className="p-5 text-center">
              <div className="py-12">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
                  <MessageSquare className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No feedbacks found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchQuery || ratingFilter !== 'all' 
                    ? "No feedbacks match your current filters. Try adjusting your search or filters."
                    : "There are no feedbacks in the system yet."}
                </p>
              </div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="group flex items-center space-x-1 focus:outline-none"
                      onClick={() => handleSort('eventName')}
                    >
                      <span>Event</span>
                      <span className="text-gray-400 group-hover:text-gray-500">
                        {sortField === 'eventName' ? (
                          sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        ) : (
                          <ChevronDown size={16} className="opacity-0 group-hover:opacity-100" />
                        )}
                      </span>
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="group flex items-center space-x-1 focus:outline-none"
                      onClick={() => handleSort('rating')}
                    >
                      <span>Rating</span>
                      <span className="text-gray-400 group-hover:text-gray-500">
                        {sortField === 'rating' ? (
                          sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        ) : (
                          <ChevronDown size={16} className="opacity-0 group-hover:opacity-100" />
                        )}
                      </span>
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feedback
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="group flex items-center space-x-1 focus:outline-none"
                      onClick={() => handleSort('name')}
                    >
                      <span>Customer</span>
                      <span className="text-gray-400 group-hover:text-gray-500">
                        {sortField === 'name' ? (
                          sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        ) : (
                          <ChevronDown size={16} className="opacity-0 group-hover:opacity-100" />
                        )}
                      </span>
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button 
                      className="group flex items-center space-x-1 focus:outline-none"
                      onClick={() => handleSort('timestamp')}
                    >
                      <span>Date</span>
                      <span className="text-gray-400 group-hover:text-gray-500">
                        {sortField === 'timestamp' ? (
                          sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        ) : (
                          <ChevronDown size={16} className="opacity-0 group-hover:opacity-100" />
                        )}
                      </span>
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFeedbacks.map((feedback) => (
                  <React.Fragment key={feedback.id}>
                    <tr className={showDetail === feedback.id ? 'bg-indigo-50' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{feedback.eventName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {renderStars(feedback.rating)}
                          <span className="ml-2 text-sm text-gray-500">{feedback.rating}/5</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {feedback.feedback && feedback.feedback.length > 100 && !expandedFeedbacks[feedback.id] ? (
                            <div>
                              <p>{feedback.feedback.substring(0, 100)}...</p>
                              <button 
                                onClick={() => toggleFeedbackExpanded(feedback.id)}
                                className="text-xs text-indigo-600 hover:text-indigo-800 mt-1"
                              >
                                Read more
                              </button>
                            </div>
                          ) : (
                            <div>
                              <p>{feedback.feedback}</p>
                              {feedback.feedback && feedback.feedback.length > 100 && (
                                <button 
                                  onClick={() => toggleFeedbackExpanded(feedback.id)}
                                  className="text-xs text-indigo-600 hover:text-indigo-800 mt-1"
                                >
                                  Show less
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{feedback.name || 'Anonymous'}</div>
                        <div className="text-sm text-gray-500">{feedback.email || 'No email provided'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(feedback.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => toggleFeedbackDetail(feedback.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          {showDetail === feedback.id ? 'Hide' : 'View'}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Detailed Row - Shown when expanded */}
                    {showDetail === feedback.id && (
                      <tr className="bg-indigo-50">
                        <td colSpan="6" className="px-6 py-4">
                          <div className="bg-white shadow-sm rounded-lg p-4 border border-indigo-100">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="text-lg font-medium text-gray-900">Feedback Details</h3>
                              <button
                                onClick={() => setShowDetail(null)}
                                className="text-gray-400 hover:text-gray-500"
                              >
                                <X size={16} />
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Event Information</h4>
                                <div className="bg-gray-50 rounded-md p-3 mb-4">
                                  <p className="text-sm"><strong>Event Name:</strong> {feedback.eventName}</p>
                                  <p className="text-sm"><strong>Event ID:</strong> {feedback.eventId}</p>
                                </div>
                                
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Customer Information</h4>
                                <div className="bg-gray-50 rounded-md p-3">
                                  <p className="text-sm flex items-center">
                                    <User size={14} className="text-gray-400 mr-1" />
                                    <strong>Name:</strong> {feedback.name || 'Anonymous'}
                                  </p>
                                  <p className="text-sm flex items-center mt-1">
                                    <Mail size={14} className="text-gray-400 mr-1" />
                                    <strong>Email:</strong> {feedback.email || 'Not provided'}
                                  </p>
                                  <p className="text-sm flex items-center mt-1">
                                    <User size={14} className="text-gray-400 mr-1" />
                                    <strong>User ID:</strong> {feedback.userId || 'Anonymous'}
                                  </p>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Feedback</h4>
                                <div className="bg-gray-50 rounded-md p-3 mb-4">
                                  <div className="flex items-center mb-2">
                                    <strong className="text-sm mr-2">Rating:</strong>
                                    {renderStars(feedback.rating)}
                                    <span className="ml-1 text-sm">({feedback.rating}/5)</span>
                                  </div>
                                  <p className="text-sm"><strong>Comments:</strong></p>
                                  <p className="text-sm mt-1 whitespace-pre-line">{feedback.feedback}</p>
                                </div>
                                
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Metadata</h4>
                                <div className="bg-gray-50 rounded-md p-3">
                                  <p className="text-sm flex items-center">
                                    <Calendar size={14} className="text-gray-400 mr-1" />
                                    <strong>Submitted:</strong> {formatDate(feedback.timestamp)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFeedbackManagement;
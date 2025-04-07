import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust path as needed based on your project structure

const EventManagement = () => {
  // State for events data from Firebase
  const [events, setEvents] = useState([]);
  // State for loading status
  const [loading, setLoading] = useState(true);
  // State for modal visibility
  const [showModal, setShowModal] = useState(false);
  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  // State for current event being edited
  const [currentEvent, setCurrentEvent] = useState(null);
  // State for event form data
  const [eventForm, setEventForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    location: '',
    status: 'Draft',
    weatherMood: '',
    emotionalTarget: '',
  });
  // State for form error
  const [formError, setFormError] = useState('');
  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // State for event being deleted
  const [eventToDelete, setEventToDelete] = useState(null);

  // Fetch events from Firebase on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Function to fetch events from Firebase
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const eventsCollection = collection(db, 'events');
      const eventsQuery = query(eventsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(eventsQuery);
      
      const fetchedEvents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Format date for display
        displayDate: formatEventDate(doc.data().startDate?.toDate(), doc.data().endDate?.toDate())
      }));
      
      setEvents(fetchedEvents);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  // Function to format event date for display
  const formatEventDate = (startDate, endDate) => {
    if (!startDate) return 'TBD';
    
    const formatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const start = startDate.toLocaleDateString('en-US', formatOptions);
    
    if (endDate) {
      const end = endDate.toLocaleDateString('en-US', formatOptions);
      return `${start} - ${end}`;
    }
    
    return start;
  };

  // Function to add or update an event in Firebase
  const saveEvent = async (e) => {
    e.preventDefault();
    setFormError('');
    
    try {
      // Basic validation
      if (!eventForm.name.trim()) {
        setFormError('Event name is required');
        return;
      }
      
      // Prepare event data
      const eventData = {
        name: eventForm.name.trim(),
        startDate: eventForm.startDate ? new Date(eventForm.startDate) : null,
        endDate: eventForm.endDate ? new Date(eventForm.endDate) : null,
        location: eventForm.location.trim(),
        status: eventForm.status,
        weatherMood: eventForm.weatherMood.trim(),
        emotionalTarget: eventForm.emotionalTarget.trim(),
        updatedAt: new Date()
      };
      
      if (isEditing && currentEvent) {
        // Update existing event
        const eventRef = doc(db, 'events', currentEvent.id);
        await updateDoc(eventRef, eventData);
      } else {
        // Add new event
        eventData.createdAt = new Date();
        await addDoc(collection(db, 'events'), eventData);
      }
      
      // Reset form and close modal
      resetForm();
      setShowModal(false);
      
      // Refresh events list
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      setFormError('Failed to save event. Please try again.');
    }
  };

  // Function to delete an event from Firebase
  const deleteEvent = async () => {
    try {
      if (!eventToDelete) return;
      
      const eventRef = doc(db, 'events', eventToDelete.id);
      await deleteDoc(eventRef);
      
      // Close modal and refresh events list
      setShowDeleteModal(false);
      setEventToDelete(null);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      setFormError('Failed to delete event. Please try again.');
    }
  };

  // Function to reset the form
  const resetForm = () => {
    setEventForm({
      name: '',
      startDate: '',
      endDate: '',
      location: '',
      status: 'Draft',
      weatherMood: '',
      emotionalTarget: '',
    });
    setIsEditing(false);
    setCurrentEvent(null);
    setFormError('');
  };

  // Handle input changes for the event form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open modal to create a new event
  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  // Open modal to edit an existing event
  const openEditModal = (event) => {
    setCurrentEvent(event);
    setIsEditing(true);
    setEventForm({
      name: event.name || '',
      startDate: event.startDate ? event.startDate.toDate().toISOString().split('T')[0] : '',
      endDate: event.endDate ? event.endDate.toDate().toISOString().split('T')[0] : '',
      location: event.location || '',
      status: event.status || 'Draft',
      weatherMood: event.weatherMood || '',
      emotionalTarget: event.emotionalTarget || '',
    });
    setShowModal(true);
  };

  // Open modal to confirm event deletion
  const openDeleteModal = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  // Function to get status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Event Management</h2>
          <button 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            onClick={openCreateModal}
          >
            Create Event
          </button>
        </div>
        <div className="p-5">
          {loading ? (
            <div className="text-center py-4">
              <p>Loading events...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weather Mood</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emotional Target</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {events.length > 0 ? (
                    events.map((event) => (
                      <tr key={event.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.displayDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.location || 'TBD'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(event.status)}`}>
                            {event.status || 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.weatherMood || 'Not set'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.emotionalTarget || 'Not set'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            onClick={() => openEditModal(event)}
                          >
                            Edit
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => openDeleteModal(event)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                        No events found. Create your first event!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Event Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {isEditing ? 'Edit Event' : 'Create New Event'}
            </h3>
            
            {formError && (
              <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                {formError}
              </div>
            )}
            
            <form onSubmit={saveEvent}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Event Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={eventForm.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={eventForm.startDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date (Optional)</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={eventForm.endDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={eventForm.location}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={eventForm.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Planning">Planning</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="weatherMood" className="block text-sm font-medium text-gray-700">Weather Mood</label>
                  <input
                    type="text"
                    id="weatherMood"
                    name="weatherMood"
                    value={eventForm.weatherMood}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g. Sunny, Rainy, Indoor"
                  />
                </div>
                
                <div>
                  <label htmlFor="emotionalTarget" className="block text-sm font-medium text-gray-700">Emotional Target</label>
                  <input
                    type="text"
                    id="emotionalTarget"
                    name="emotionalTarget"
                    value={eventForm.emotionalTarget}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g. Excitement, Focus, Connection"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    resetForm();
                    setShowModal(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  {isEditing ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete the event "{eventToDelete?.name}"? This action cannot be undone.
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
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                onClick={deleteEvent}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;
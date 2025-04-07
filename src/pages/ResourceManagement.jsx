import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, doc, deleteDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust path as needed based on your project structure

const ResourceManagement = () => {
  // State for resources data from Firebase
  const [resources, setResources] = useState([]);
  // State for loading status
  const [loading, setLoading] = useState(true);
  // State for modal visibility
  const [showModal, setShowModal] = useState(false);
  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  // State for current resource being edited
  const [currentResource, setCurrentResource] = useState(null);
  // State for active filter
  const [activeFilter, setActiveFilter] = useState('All');
  // State for resource form data
  const [resourceForm, setResourceForm] = useState({
    name: '',
    type: 'Equipment',
    quantity: 1,
    condition: 'Excellent',
    location: '',
    lastUsed: '',
    description: '',
    value: '',
    status: 'Available'
  });
  // State for form error
  const [formError, setFormError] = useState('');
  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // State for resource being deleted
  const [resourceToDelete, setResourceToDelete] = useState(null);

  // Resource types for filtering and form selection
  const resourceTypes = ['All', 'Equipment', 'Venue', 'Decoration', 'Technology', 'Furniture', 'Marketing', 'Other'];

  // Fetch resources from Firebase on component mount
  useEffect(() => {
    fetchResources();
  }, [activeFilter]);

  // Function to fetch resources from Firebase
  const fetchResources = async () => {
    try {
      setLoading(true);
      const resourcesCollection = collection(db, 'resources');
      
      let resourcesQuery;
      if (activeFilter === 'All') {
        resourcesQuery = query(resourcesCollection, orderBy('name'));
      } else {
        resourcesQuery = query(
          resourcesCollection, 
          where('type', '==', activeFilter),
          orderBy('name')
        );
      }
      
      const querySnapshot = await getDocs(resourcesQuery);
      
      const fetchedResources = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Format date for display if it exists
        lastUsedFormatted: doc.data().lastUsed ? formatDate(doc.data().lastUsed.toDate()) : 'Never'
      }));
      
      setResources(fetchedResources);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setLoading(false);
    }
  };

  // Function to format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Function to add or update a resource in Firebase
  const saveResource = async (e) => {
    e.preventDefault();
    setFormError('');
    
    try {
      // Validation
      if (!resourceForm.name.trim()) {
        setFormError('Resource name is required');
        return;
      }
      
      if (isNaN(resourceForm.quantity) || parseInt(resourceForm.quantity) < 0) {
        setFormError('Quantity must be a valid positive number');
        return;
      }
      
      // Prepare resource data
      const resourceData = {
        name: resourceForm.name.trim(),
        type: resourceForm.type,
        quantity: parseInt(resourceForm.quantity),
        condition: resourceForm.condition,
        location: resourceForm.location.trim(),
        lastUsed: resourceForm.lastUsed ? new Date(resourceForm.lastUsed) : null,
        description: resourceForm.description.trim(),
        value: resourceForm.value.trim(),
        status: resourceForm.status,
        updatedAt: new Date()
      };
      
      if (isEditing && currentResource) {
        // Update existing resource
        const resourceRef = doc(db, 'resources', currentResource.id);
        await updateDoc(resourceRef, resourceData);
      } else {
        // Add new resource
        resourceData.createdAt = new Date();
        await addDoc(collection(db, 'resources'), resourceData);
      }
      
      // Reset form and close modal
      resetForm();
      setShowModal(false);
      
      // Refresh resources list
      fetchResources();
    } catch (error) {
      console.error('Error saving resource:', error);
      setFormError('Failed to save resource. Please try again.');
    }
  };

  // Function to delete a resource from Firebase
  const deleteResource = async () => {
    try {
      if (!resourceToDelete) return;
      
      const resourceRef = doc(db, 'resources', resourceToDelete.id);
      await deleteDoc(resourceRef);
      
      // Close modal and refresh resources list
      setShowDeleteModal(false);
      setResourceToDelete(null);
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      setFormError('Failed to delete resource. Please try again.');
    }
  };

  // Function to reset the form
  const resetForm = () => {
    setResourceForm({
      name: '',
      type: 'Equipment',
      quantity: 1,
      condition: 'Excellent',
      location: '',
      lastUsed: '',
      description: '',
      value: '',
      status: 'Available'
    });
    setIsEditing(false);
    setCurrentResource(null);
    setFormError('');
  };

  // Handle input changes for the resource form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setResourceForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open modal to create a new resource
  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  // Open modal to edit an existing resource
  const openEditModal = (resource) => {
    setCurrentResource(resource);
    setIsEditing(true);
    setResourceForm({
      name: resource.name || '',
      type: resource.type || 'Equipment',
      quantity: resource.quantity || 1,
      condition: resource.condition || 'Excellent',
      location: resource.location || '',
      lastUsed: resource.lastUsed ? resource.lastUsed.toDate().toISOString().split('T')[0] : '',
      description: resource.description || '',
      value: resource.value || '',
      status: resource.status || 'Available'
    });
    setShowModal(true);
  };

  // Open modal to confirm resource deletion
  const openDeleteModal = (resource) => {
    setResourceToDelete(resource);
    setShowDeleteModal(true);
  };

  // Function to get status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'In Use':
        return 'bg-blue-100 text-blue-800';
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Damaged':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get condition badge styling
  const getConditionBadgeClass = (condition) => {
    switch (condition) {
      case 'Excellent':
        return 'bg-green-100 text-green-800';
      case 'Good':
        return 'bg-blue-100 text-blue-800';
      case 'Fair':
        return 'bg-yellow-100 text-yellow-800';
      case 'Poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle filter change
  const handleFilterChange = (type) => {
    setActiveFilter(type);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Resource Management</h2>
          <button 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            onClick={openCreateModal}
          >
            Add Resource
          </button>
        </div>
        
        {/* Resource Type Filters */}
        <div className="px-5 py-3 border-b border-gray-200 flex flex-wrap gap-2">
          {resourceTypes.map((type) => (
            <button
              key={type}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                activeFilter === type 
                  ? 'bg-indigo-100 text-indigo-800' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => handleFilterChange(type)}
            >
              {type}
            </button>
          ))}
        </div>
        
        <div className="p-5">
          {loading ? (
            <div className="text-center py-4">
              <p>Loading resources...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Used</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {resources.length > 0 ? (
                    resources.map((resource) => (
                      <tr key={resource.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{resource.name}</div>
                          {resource.description && (
                            <div className="text-xs text-gray-500 truncate max-w-xs">{resource.description}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resource.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resource.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionBadgeClass(resource.condition)}`}>
                            {resource.condition}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resource.location || '—'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{resource.lastUsedFormatted}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(resource.status)}`}>
                            {resource.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            onClick={() => openEditModal(resource)}
                          >
                            Edit
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => openDeleteModal(resource)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                        No resources found. {activeFilter !== 'All' ? `Try a different filter or add a new ${activeFilter.toLowerCase()} resource.` : 'Add your first resource!'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Resource Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {isEditing ? 'Edit Resource' : 'Add New Resource'}
            </h3>
            
            {formError && (
              <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                {formError}
              </div>
            )}
            
            <form onSubmit={saveResource}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Resource Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={resourceForm.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">Resource Type</label>
                  <select
                    id="type"
                    name="type"
                    value={resourceForm.type}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    {resourceTypes.filter(type => type !== 'All').map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={resourceForm.quantity}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    min="0"
                  />
                </div>
                
                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition</label>
                  <select
                    id="condition"
                    name="condition"
                    value={resourceForm.condition}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={resourceForm.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="Available">Available</option>
                    <option value="In Use">In Use</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Damaged">Damaged</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">Storage Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={resourceForm.location}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g. Warehouse A, Storage Room 3"
                  />
                </div>
                
                <div>
                  <label htmlFor="value" className="block text-sm font-medium text-gray-700">Value/Cost</label>
                  <input
                    type="text"
                    id="value"
                    name="value"
                    value={resourceForm.value}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g. $500"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastUsed" className="block text-sm font-medium text-gray-700">Last Used Date</label>
                  <input
                    type="date"
                    id="lastUsed"
                    name="lastUsed"
                    value={resourceForm.lastUsed}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div className="col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    value={resourceForm.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Brief description of the resource"
                  ></textarea>
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
                  {isEditing ? 'Update Resource' : 'Add Resource'}
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
              Are you sure you want to delete the resource "{resourceToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setShowDeleteModal(false);
                  setResourceToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                onClick={deleteResource}
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

export default ResourceManagement;
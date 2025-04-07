import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust path as needed based on your project structure

const VendorManagement = () => {
  // State for vendors data from Firebase
  const [vendors, setVendors] = useState([]);
  // State for loading status
  const [loading, setLoading] = useState(true);
  // State for modal visibility
  const [showModal, setShowModal] = useState(false);
  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  // State for current vendor being edited
  const [currentVendor, setCurrentVendor] = useState(null);
  // State for vendor form data
  const [vendorForm, setVendorForm] = useState({
    name: '',
    email: '',
    phone: '',
    services: '',
    rate: '',
    rating: '',
    status: 'Active'
  });
  // State for form error
  const [formError, setFormError] = useState('');
  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // State for vendor being deleted
  const [vendorToDelete, setVendorToDelete] = useState(null);

  // Fetch vendors from Firebase on component mount
  useEffect(() => {
    fetchVendors();
  }, []);

  // Function to fetch vendors from Firebase
  const fetchVendors = async () => {
    try {
      setLoading(true);
      const vendorsCollection = collection(db, 'vendors');
      const vendorsQuery = query(vendorsCollection, orderBy('name'));
      const querySnapshot = await getDocs(vendorsQuery);
      
      const fetchedVendors = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setVendors(fetchedVendors);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setLoading(false);
    }
  };

  // Function to add or update a vendor in Firebase
  const saveVendor = async (e) => {
    e.preventDefault();
    setFormError('');
    
    try {
      // Validation
      if (!vendorForm.name.trim()) {
        setFormError('Vendor name is required');
        return;
      }
      
      if (!vendorForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vendorForm.email)) {
        setFormError('Valid email is required');
        return;
      }
      
      // Prepare vendor data
      const vendorData = {
        name: vendorForm.name.trim(),
        email: vendorForm.email.trim(),
        phone: vendorForm.phone.trim(),
        services: vendorForm.services.trim(),
        rate: vendorForm.rate.trim(),
        rating: vendorForm.rating,
        status: vendorForm.status,
        updatedAt: new Date()
      };
      
      if (isEditing && currentVendor) {
        // Update existing vendor
        const vendorRef = doc(db, 'vendors', currentVendor.id);
        await updateDoc(vendorRef, vendorData);
      } else {
        // Add new vendor
        vendorData.createdAt = new Date();
        await addDoc(collection(db, 'vendors'), vendorData);
      }
      
      // Reset form and close modal
      resetForm();
      setShowModal(false);
      
      // Refresh vendors list
      fetchVendors();
    } catch (error) {
      console.error('Error saving vendor:', error);
      setFormError('Failed to save vendor. Please try again.');
    }
  };

  // Function to delete a vendor from Firebase
  const deleteVendor = async () => {
    try {
      if (!vendorToDelete) return;
      
      const vendorRef = doc(db, 'vendors', vendorToDelete.id);
      await deleteDoc(vendorRef);
      
      // Close modal and refresh vendors list
      setShowDeleteModal(false);
      setVendorToDelete(null);
      fetchVendors();
    } catch (error) {
      console.error('Error deleting vendor:', error);
      setFormError('Failed to delete vendor. Please try again.');
    }
  };

  // Function to reset the form
  const resetForm = () => {
    setVendorForm({
      name: '',
      email: '',
      phone: '',
      services: '',
      rate: '',
      rating: '',
      status: 'Active'
    });
    setIsEditing(false);
    setCurrentVendor(null);
    setFormError('');
  };

  // Handle input changes for the vendor form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendorForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open modal to create a new vendor
  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  // Open modal to edit an existing vendor
  const openEditModal = (vendor) => {
    setCurrentVendor(vendor);
    setIsEditing(true);
    setVendorForm({
      name: vendor.name || '',
      email: vendor.email || '',
      phone: vendor.phone || '',
      services: vendor.services || '',
      rate: vendor.rate || '',
      rating: vendor.rating || '',
      status: vendor.status || 'Active'
    });
    setShowModal(true);
  };

  // Open modal to confirm vendor deletion
  const openDeleteModal = (vendor) => {
    setVendorToDelete(vendor);
    setShowDeleteModal(true);
  };

  // Function to get status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Blacklisted':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get rating stars
  const getRatingStars = (rating) => {
    const numRating = parseFloat(rating) || 0;
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ${
              i < fullStars 
                ? 'text-yellow-500' 
                : (i === fullStars && hasHalfStar 
                  ? 'text-yellow-500' 
                  : 'text-gray-300')
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">{numRating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Vendor Management</h2>
          <button 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            onClick={openCreateModal}
          >
            Add Vendor
          </button>
        </div>
        <div className="p-5">
          {loading ? (
            <div className="text-center py-4">
              <p>Loading vendors...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vendors.length > 0 ? (
                    vendors.map((vendor) => (
                      <tr key={vendor.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vendor.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{vendor.email}</div>
                          <div>{vendor.phone}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{vendor.services}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vendor.rate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getRatingStars(vendor.rating)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(vendor.status)}`}>
                            {vendor.status || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            onClick={() => openEditModal(vendor)}
                          >
                            Edit
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => openDeleteModal(vendor)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                        No vendors found. Add your first vendor!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Vendor Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {isEditing ? 'Edit Vendor' : 'Add New Vendor'}
            </h3>
            
            {formError && (
              <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                {formError}
              </div>
            )}
            
            <form onSubmit={saveVendor}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Vendor Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={vendorForm.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={vendorForm.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={vendorForm.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div className="col-span-2">
                  <label htmlFor="services" className="block text-sm font-medium text-gray-700">Services Offered</label>
                  <textarea
                    id="services"
                    name="services"
                    rows="2"
                    value={vendorForm.services}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g. Catering, Photography, Equipment Rental"
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="rate" className="block text-sm font-medium text-gray-700">Rate/Pricing</label>
                  <input
                    type="text"
                    id="rate"
                    name="rate"
                    value={vendorForm.rate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g. $1,000/event, $50/hour"
                  />
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={vendorForm.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                    <option value="Blacklisted">Blacklisted</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (0-5)</label>
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    value={vendorForm.rating}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    min="0"
                    max="5"
                    step="0.1"
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
                  {isEditing ? 'Update Vendor' : 'Add Vendor'}
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
              Are you sure you want to delete the vendor "{vendorToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setShowDeleteModal(false);
                  setVendorToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                onClick={deleteVendor}
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

export default VendorManagement;
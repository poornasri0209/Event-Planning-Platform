import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
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
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  // State for filtered vendors
  const [filteredVendors, setFilteredVendors] = useState([]);
  // State for vendor form data
  const [vendorForm, setVendorForm] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    description: '',
    website: '',
    address: '',
    budget: '',
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

  // Update filtered vendors when search query or vendors change
  useEffect(() => {
    filterVendors();
  }, [searchQuery, vendors]);

  // Function to fetch vendors from Firebase
  const fetchVendors = async () => {
    try {
      setLoading(true);
      const vendorsCollection = collection(db, 'vendors');
      const querySnapshot = await getDocs(vendorsCollection);
      
      const fetchedVendors = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setVendors(fetchedVendors);
      setFilteredVendors(fetchedVendors);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setLoading(false);
    }
  };

  // Filter vendors based on search query
  const filterVendors = () => {
    if (searchQuery.trim() === '') {
      setFilteredVendors(vendors);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = vendors.filter(vendor => 
      vendor.name?.toLowerCase().includes(query) || 
      vendor.companyName?.toLowerCase().includes(query) ||
      vendor.email?.toLowerCase().includes(query)
    );
    
    setFilteredVendors(filtered);
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
      
      if (!vendorForm.phone.trim()) {
        setFormError('Phone number is required');
        return;
      }
      
      // Validate budget as a number
      const budgetValue = parseFloat(vendorForm.budget);
      if (isNaN(budgetValue) || budgetValue <= 0) {
        setFormError('Budget must be a valid positive number');
        return;
      }
      
      // Prepare vendor data
      const vendorData = {
        name: vendorForm.name.trim(),
        email: vendorForm.email.trim(),
        phone: vendorForm.phone.trim(),
        companyName: vendorForm.companyName.trim(),
        description: vendorForm.description.trim(),
        website: vendorForm.website.trim(),
        address: vendorForm.address.trim(),
        budget: vendorForm.budget.trim(),
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
      companyName: '',
      description: '',
      website: '',
      address: '',
      budget: '',
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
      companyName: vendor.companyName || '',
      description: vendor.description || '',
      website: vendor.website || '',
      address: vendor.address || '',
      budget: vendor.budget || '',
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
          {/* Search input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search vendors by name, company, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading vendors...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVendors.length > 0 ? (
                    filteredVendors.map((vendor) => (
                      <tr key={vendor.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                          <div className="text-sm text-gray-500">{vendor.companyName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{vendor.email}</div>
                          <div className="text-sm text-gray-500">{vendor.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${vendor.budget}
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
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        {searchQuery ? 'No vendors found matching your search.' : 'No vendors found. Add your first vendor!'}
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
                <div>
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
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={vendorForm.companyName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      id="budget"
                      name="budget"
                      value={vendorForm.budget}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={vendorForm.website}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="https://example.com"
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
                
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={vendorForm.address}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    value={vendorForm.description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Describe the vendor's services..."
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
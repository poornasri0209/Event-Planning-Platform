import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign, 
  Tag, 
  Image, 
  FileText, 
  Cloud, 
  Smile, 
  ChevronLeft, 
  Save, 
  X, 
  Plus,
  CreditCard,
  CheckCircle,
  Eye,
  Lock,
  Mail,
  Phone,
  Link,
  Globe,
  MessageSquare,
  AlertCircle,
  Briefcase,
  Package,
  Check
} from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import Navbar from "../components/Navbar";

const EventCreation = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formStep, setFormStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [resources, setResources] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [loadingResources, setLoadingResources] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    amount: '0.00'
  });
  
  const [formData, setFormData] = useState({
    eventName: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    location: '',
    virtualEvent: false,
    capacity: '',
    budget: '',
    description: '',
    category: '',
    imageUrl: '',
    tags: [],
    weatherAdapter: false,
    emotionalJourney: false,
    selectedVendor: '',
    selectedResources: [],
    vendorBudget: '',
    resourcesBudget: '',
    paymentStatus: 'pending',
    status: 'In Progress',
    createdBy: currentUser?.uid || '',
    // Additional fields
    contactEmail: '',
    contactPhone: '',
    website: '',
    registrationLink: '',
    ticketRequired: false,
    ticketPrice: '',
    notes: '',
    accessibility: {
      wheelchairAccessible: false,
      signLanguageInterpreter: false,
      audioDescription: false
    },
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: ''
    }
  });
  
  const [tagInput, setTagInput] = useState('');
  const [formErrors, setFormErrors] = useState({});
  
  // Fetch vendors and resources
  useEffect(() => {
    fetchVendors();
    fetchResources();
  }, []);

  // Calculate total payment whenever relevant fields change
  useEffect(() => {
    calculateTotalAmount();
  }, [formData.weatherAdapter, formData.emotionalJourney, formData.vendorBudget, formData.resourcesBudget]);
  
  const fetchVendors = async () => {
    try {
      setLoadingVendors(true);
      const vendorsCollection = collection(db, 'vendors');
      const querySnapshot = await getDocs(vendorsCollection);
      
      const fetchedVendors = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setVendors(fetchedVendors);
      setLoadingVendors(false);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      setLoadingVendors(false);
    }
  };
  
  const fetchResources = async () => {
    try {
      setLoadingResources(true);
      const resourcesCollection = collection(db, 'resources');
      const querySnapshot = await getDocs(resourcesCollection);
      
      const fetchedResources = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isSelected: false
      }));
      
      setResources(fetchedResources);
      setLoadingResources(false);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setLoadingResources(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle nested objects
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
    
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const handleVendorChange = (e) => {
    const vendorId = e.target.value;
    
    // Find the selected vendor to get their budget
    const selectedVendor = vendors.find(vendor => vendor.id === vendorId);
    const vendorBudget = selectedVendor ? selectedVendor.budget : '';
    
    setFormData({
      ...formData,
      selectedVendor: vendorId,
      vendorBudget: vendorBudget
    });
  };
  
  const handleResourceChange = (resourceId) => {
    let updatedResources = [...formData.selectedResources];
    
    if (updatedResources.includes(resourceId)) {
      // Remove resource if already selected
      updatedResources = updatedResources.filter(id => id !== resourceId);
    } else {
      // Add resource if not already selected
      updatedResources.push(resourceId);
    }
    
    // Calculate total resources budget
    const resourcesBudget = calculateResourcesBudget(updatedResources);
    
    setFormData({
      ...formData,
      selectedResources: updatedResources,
      resourcesBudget: resourcesBudget
    });
  };
  
  const calculateResourcesBudget = (selectedResourceIds) => {
    let total = 0;
    
    // Sum up the value of each selected resource
    selectedResourceIds.forEach(resourceId => {
      const resource = resources.find(r => r.id === resourceId);
      if (resource && resource.value) {
        // Remove $ sign and convert to number
        const value = parseFloat(resource.value.replace(/[^0-9.-]+/g, ""));
        if (!isNaN(value)) {
          total += value;
        }
      }
    });
    
    return total.toFixed(2);
  };
  
  const calculateTotalAmount = () => {
    let total = 0;
    
    // Add AI features costs
    if (formData.weatherAdapter) total += 99;
    if (formData.emotionalJourney) total += 149;
    
    // Add vendor budget
    if (formData.vendorBudget) {
      const vendorBudget = parseFloat(formData.vendorBudget.replace(/[^0-9.-]+/g, ""));
      if (!isNaN(vendorBudget)) {
        total += vendorBudget;
      }
    }
    
    // Add resources budget
    if (formData.resourcesBudget) {
      const resourcesBudget = parseFloat(formData.resourcesBudget);
      if (!isNaN(resourcesBudget)) {
        total += resourcesBudget;
      }
    }
    
    // Update payment amount
    setPaymentInfo({
      ...paymentInfo,
      amount: total.toFixed(2)
    });
  };
  
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Format card number with spaces every 4 digits
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().substring(0, 19);
    }
    
    // Format expiry date with slash after 2 digits
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\//g, '');
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2, 4);
      }
    }
    
    // Limit CVV to 3 or 4 digits
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }
    
    setPaymentInfo({
      ...paymentInfo,
      [name]: formattedValue
    });
    
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };
  
  const handleTagRemove = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  const validateForm = () => {
    const errors = {};
    
    // Basic validation for current step
    if (formStep === 1) {
      if (!formData.eventName.trim()) errors.eventName = 'Event name is required';
      if (!formData.category) errors.category = 'Category is required';
      if (!formData.startDate) errors.startDate = 'Start date is required';
      if (!formData.startTime) errors.startTime = 'Start time is required';
      if (!formData.location.trim()) errors.location = 'Location is required';
      
      // Email validation
      if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
        errors.contactEmail = 'Please enter a valid email address';
      }
      
      // Phone validation
      if (formData.contactPhone && !/^\+?[0-9\s-()]{7,}$/.test(formData.contactPhone)) {
        errors.contactPhone = 'Please enter a valid phone number';
      }
    }
    
    // Payment validation
    if (formStep === 3 && parseFloat(paymentInfo.amount) > 0) {
      if (!paymentInfo.cardNumber.trim() || paymentInfo.cardNumber.replace(/\s/g, '').length < 13) {
        errors.cardNumber = 'Please enter a valid card number';
      }
      if (!paymentInfo.cardName.trim()) errors.cardName = 'Name on card is required';
      if (!paymentInfo.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
        errors.expiryDate = 'Enter a valid expiry date (MM/YY)';
      }
      if (!paymentInfo.cvv || !/^\d{3,4}$/.test(paymentInfo.cvv)) {
        errors.cvv = 'Enter a valid CVV';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const nextStep = () => {
    if (validateForm()) {
      setFormStep(formStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    setFormStep(formStep - 1);
    window.scrollTo(0, 0);
  };
  
  const processPayment = () => {
    if (!validateForm()) {
      return;
    }
    
    setProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessingPayment(false);
      setPaymentSuccess(true);
      
      // After showing success message, submit the form
      setTimeout(() => {
        handleSubmit();
      }, 1500);
    }, 3000);
  };
  
  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      // Prepare selected vendor data
      let vendorData = null;
      if (formData.selectedVendor) {
        const vendorRef = doc(db, 'vendors', formData.selectedVendor);
        const vendorDoc = await getDoc(vendorRef);
        if (vendorDoc.exists()) {
          vendorData = {
            id: vendorDoc.id,
            name: vendorDoc.data().name,
            companyName: vendorDoc.data().companyName,
            email: vendorDoc.data().email,
            phone: vendorDoc.data().phone,
            budget: vendorDoc.data().budget
          };
        }
      }
      
      // Prepare selected resources data
      const resourcesData = [];
      for (const resourceId of formData.selectedResources) {
        const resourceRef = doc(db, 'resources', resourceId);
        const resourceDoc = await getDoc(resourceRef);
        if (resourceDoc.exists()) {
          resourcesData.push({
            id: resourceDoc.id,
            name: resourceDoc.data().name,
            type: resourceDoc.data().type,
            value: resourceDoc.data().value
          });
        }
      }
      
      // Add event to Firestore
      const eventData = {
        ...formData,
        vendor: vendorData,
        resources: resourcesData,
        createdBy: currentUser?.uid || 'anonymous',
        userEmail: currentUser?.email || 'anonymous',
        createdAt: serverTimestamp(),
        paymentStatus: 'completed',
        paymentAmount: parseFloat(paymentInfo.amount) || 0
      };
      
      const docRef = await addDoc(collection(db, 'events'), eventData);
      console.log('Event created with ID:', docRef.id);
      
      // Navigate to my events page
      navigate('/myevents');
      
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to display error message
  const ErrorMessage = ({ name }) => {
    return formErrors[name] ? (
      <p className="mt-1 text-sm text-red-600 flex items-center">
        <AlertCircle className="h-3 w-3 mr-1" />
        {formErrors[name]}
      </p>
    ) : null;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with back button */}
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => navigate(-1)} 
              className="text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
          
          {/* Step indicators */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-center">
                <div className="w-full max-w-3xl">
                  <div className="flex items-center">
                    <div 
                      className={`rounded-full flex items-center justify-center h-8 w-8 ${
                        formStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      1
                    </div>
                    <div className={`h-1 flex-1 ${formStep >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                    <div 
                      className={`rounded-full flex items-center justify-center h-8 w-8 ${
                        formStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      2
                    </div>
                    <div className={`h-1 flex-1 ${formStep >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                    <div 
                      className={`rounded-full flex items-center justify-center h-8 w-8 ${
                        formStep >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      3
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-600">
                    <div className="text-center w-24">Event Details</div>
                    <div className="text-center w-24">Vendors & Resources</div>
                    <div className="text-center w-24">Payment</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <form>
            {/* Step 1: Event Information */}
            {formStep === 1 && (
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-white">Event Information</h3>
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
                      Event Name
                    </label>
                    <input
                      type="text"
                      name="eventName"
                      id="eventName"
                      value={formData.eventName}
                      onChange={handleChange}
                      className={`w-full block border ${formErrors.eventName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md shadow-sm py-3 px-4 focus:outline-none sm:text-sm`}
                      placeholder="Annual Tech Conference 2025"
                      required
                    />
                    <ErrorMessage name="eventName" />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        Event Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full block bg-white border ${formErrors.category ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md shadow-sm py-3 px-4 focus:outline-none sm:text-sm`}
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="conference">Conference</option>
                        <option value="seminar">Seminar</option>
                        <option value="workshop">Workshop</option>
                        <option value="product-launch">Product Launch</option>
                        <option value="team-building">Team Building</option>
                        <option value="networking">Networking</option>
                        <option value="corporate">Corporate Event</option>
                        <option value="celebration">Celebration</option>
                        <option value="other">Other</option>
                      </select>
                      <ErrorMessage name="category" />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center h-5">
                        <input
                          id="virtualEvent"
                          name="virtualEvent"
                          type="checkbox"
                          checked={formData.virtualEvent}
                          onChange={handleChange}
                          className="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <label htmlFor="virtualEvent" className="font-medium text-gray-700">
                        This is a virtual event
                      </label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="sm:col-span-1 lg:col-span-2">
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          name="startDate"
                          id="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          className={`w-full block pl-10 py-3 sm:text-sm border ${formErrors.startDate ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md`}
                          required
                        />
                        <ErrorMessage name="startDate" />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-1 lg:col-span-2">
                      <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          name="endDate"
                          id="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                          className="w-full block pl-10 py-3 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-1 lg:col-span-2">
                      <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="time"
                          name="startTime"
                          id="startTime"
                          value={formData.startTime}
                          onChange={handleChange}
                          className={`w-full block pl-10 py-3 sm:text-sm border ${formErrors.startTime ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md`}
                          required
                        />
                        <ErrorMessage name="startTime" />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-1 lg:col-span-2">
                      <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Clock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="time"
                          name="endTime"
                          id="endTime"
                          value={formData.endTime}
                          onChange={handleChange}
                          className="w-full block pl-10 py-3 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="location"
                        id="location"
                        value={formData.location}
                        onChange={handleChange}
                        className={`w-full block pl-10 py-3 sm:text-sm border ${formErrors.location ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md`}
                        placeholder={formData.virtualEvent ? "Zoom/Teams Meeting Link" : "Venue Address"}
                        required
                      />
                      <ErrorMessage name="location" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                        Expected Attendees
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Users className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          name="capacity"
                          id="capacity"
                          value={formData.capacity}
                          onChange={handleChange}
                          className="w-full block pl-10 py-3 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="500"
                          min="1"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                        Overall Budget
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="budget"
                          id="budget"
                          value={formData.budget}
                          onChange={handleChange}
                          className="w-full block pl-10 py-3 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="25000"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full block shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md py-3 px-4"
                      placeholder="Enter a detailed description of your event..."
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Email
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="contactEmail"
                          id="contactEmail"
                          value={formData.contactEmail}
                          onChange={handleChange}
                          className={`w-full block pl-10 py-3 sm:text-sm border ${formErrors.contactEmail ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md`}
                          placeholder="event@example.com"
                        />
                        <ErrorMessage name="contactEmail" />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Phone
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="contactPhone"
                          id="contactPhone"
                          value={formData.contactPhone}
                          onChange={handleChange}
                          className={`w-full block pl-10 py-3 sm:text-sm border ${formErrors.contactPhone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md`}
                          placeholder="+1 (555) 123-4567"
                        />
                        <ErrorMessage name="contactPhone" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                        Event Website
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Globe className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="url"
                          name="website"
                          id="website"
                          value={formData.website}
                          onChange={handleChange}
                          className="w-full block pl-10 py-3 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="https://myevent.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="registrationLink" className="block text-sm font-medium text-gray-700 mb-1">
                        Registration Link
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Link className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="url"
                          name="registrationLink"
                          id="registrationLink"
                          value={formData.registrationLink}
                          onChange={handleChange}
                          className="w-full block pl-10 py-3 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="https://register.myevent.com"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label htmlFor="ticketRequired" className="block text-sm font-medium text-gray-700">
                          Tickets Required?
                        </label>
                        <div className="flex items-center h-5">
                          <input
                            id="ticketRequired"
                            name="ticketRequired"
                            type="checkbox"
                            checked={formData.ticketRequired}
                            onChange={handleChange}
                            className="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                      
                      {formData.ticketRequired && (
                        <div className="relative rounded-md shadow-sm mt-2">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <DollarSign className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="ticketPrice"
                            id="ticketPrice"
                            value={formData.ticketPrice}
                            onChange={handleChange}
                            className="w-full block pl-10 py-3 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Ticket price (e.g. 25.00)"
                          />
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                        Event Image URL
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Image className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="imageUrl"
                          id="imageUrl"
                          value={formData.imageUrl}
                          onChange={handleChange}
                          className="w-full block pl-10 py-3 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Accessibility Options */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Accessibility Options</h4>
                    <div className="grid grid-cols-1 gap-y-2 sm:grid-cols-3 gap-x-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="accessibility.wheelchairAccessible"
                            name="accessibility.wheelchairAccessible"
                            type="checkbox"
                            checked={formData.accessibility.wheelchairAccessible}
                            onChange={handleChange}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="accessibility.wheelchairAccessible" className="font-medium text-gray-700">
                            Wheelchair Accessible
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="accessibility.signLanguageInterpreter"
                            name="accessibility.signLanguageInterpreter"
                            type="checkbox"
                            checked={formData.accessibility.signLanguageInterpreter}
                            onChange={handleChange}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="accessibility.signLanguageInterpreter" className="font-medium text-gray-700">
                            Sign Language Interpreter
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="accessibility.audioDescription"
                            name="accessibility.audioDescription"
                            type="checkbox"
                            checked={formData.accessibility.audioDescription}
                            onChange={handleChange}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="accessibility.audioDescription" className="font-medium text-gray-700">
                            Audio Description
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Notes
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                        <MessageSquare className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full block pl-10 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                        placeholder="Any additional information about your event..."
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                      Tags
                    </label>
                    <div className="flex rounded-md shadow-sm">
                      <div className="relative flex-grow focus-within:z-10">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Tag className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="tagInput"
                          id="tagInput"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                          className="w-full block rounded-none rounded-l-md pl-10 py-3 sm:text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Add tags..."
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleTagAdd}
                        className="relative inline-flex items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        Add
                      </button>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap">
                      {formData.tags.map(tag => (
                        <span key={tag} className="inline-flex rounded-full items-center py-0.5 pl-2.5 pr-1 text-sm font-medium bg-indigo-100 text-indigo-700 mr-2 mb-2">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleTagRemove(tag)}
                            className="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white"
                          >
                            <span className="sr-only">Remove {tag} tag</span>
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Next: Vendors & Resources
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 2: Vendors & Resources + AI Features */}
            {formStep === 2 && (
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-white">Vendors, Resources & AI Features</h3>
                </div>
                
                <div className="p-6 space-y-8">
                  {/* Vendor Selection */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Select a Vendor</h4>
                    
                    {loadingVendors ? (
                      <div className="flex justify-center items-center h-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-indigo-500"></div>
                      </div>
                    ) : vendors.length > 0 ? (
                      <div>
                        <select
                          name="selectedVendor"
                          value={formData.selectedVendor}
                          onChange={handleVendorChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                        >
                          <option value="">Select a vendor...</option>
                          {vendors.map(vendor => (
                            <option key={vendor.id} value={vendor.id}>
                              {vendor.name} ({vendor.companyName}) - {vendor.budget}
                            </option>
                          ))}
                        </select>
                        
                        {formData.selectedVendor && (
                          <div className="mt-4 bg-gray-50 p-4 rounded-md">
                            <p className="text-sm text-gray-600">
                              Selected vendor budget: <span className="font-medium">{formData.vendorBudget}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500">No vendors available.</p>
                    )}
                  </div>
                  
                  {/* Resources Selection */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Select Resources</h4>
                    
                    {loadingResources ? (
                      <div className="flex justify-center items-center h-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-indigo-500"></div>
                      </div>
                    ) : resources.length > 0 ? (
                      <div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {resources.map(resource => (
                            <div 
                              key={resource.id} 
                              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                formData.selectedResources.includes(resource.id)
                                  ? 'border-indigo-500 bg-indigo-50'
                                  : 'border-gray-200 hover:border-indigo-300'
                              }`}
                              onClick={() => handleResourceChange(resource.id)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-medium text-gray-900">{resource.name}</h5>
                                  <p className="text-sm text-gray-500">{resource.type}</p>
                                  <p className="text-sm text-gray-700 mt-1">Value: {resource.value || 'N/A'}</p>
                                </div>
                                <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                                  formData.selectedResources.includes(resource.id)
                                    ? 'bg-indigo-500 text-white'
                                    : 'border border-gray-300'
                                }`}>
                                  {formData.selectedResources.includes(resource.id) && (
                                    <Check className="h-3 w-3" />
                                  )}
                                </div>
                              </div>
                              
                              {resource.description && (
                                <p className="mt-2 text-xs text-gray-500 line-clamp-2">{resource.description}</p>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {formData.selectedResources.length > 0 && (
                          <div className="mt-4 bg-gray-50 p-4 rounded-md">
                            <p className="text-sm text-gray-600">
                              Selected resources: <span className="font-medium">{formData.selectedResources.length}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                              Total resources budget: <span className="font-medium">${formData.resourcesBudget}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500">No resources available.</p>
                    )}
                  </div>
                  
                  {/* AI Features */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Enhanced AI Features</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={`border rounded-lg p-6 transition-all ${formData.weatherAdapter ? 'bg-blue-50 border-blue-200 shadow-md' : 'bg-white border-gray-200 hover:border-blue-200 hover:shadow-sm'}`}>
                        <div className="flex">
                          <div className={`rounded-full p-3 ${formData.weatherAdapter ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                            <Cloud className="h-6 w-6" />
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center justify-between">
                              <h3 className={`text-lg font-medium ${formData.weatherAdapter ? 'text-blue-800' : 'text-gray-900'}`}>
                                Weather-Mood Adapter
                              </h3>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                $99
                              </span>
                            </div>
                            <p className={`mt-2 text-sm ${formData.weatherAdapter ? 'text-blue-700' : 'text-gray-500'}`}>
                              Our AI will analyze weather patterns for your event dates and suggest optimal settings to enhance attendee experience based on predicted weather conditions.
                            </p>
                            <div className="mt-4 flex items-center">
                              <input
                                id="weatherAdapter"
                                name="weatherAdapter"
                                type="checkbox"
                                checked={formData.weatherAdapter}
                                onChange={handleChange}
                                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label htmlFor="weatherAdapter" className="ml-2 block text-sm text-gray-700">
                                Add to my event
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        {formData.weatherAdapter && (
                          <div className="mt-6 bg-white border border-blue-100 rounded-md p-4">
                            <h4 className="text-sm font-medium text-blue-800 mb-2">How it works:</h4>
                            <ol className="list-decimal text-sm text-gray-600 pl-5 space-y-1">
                              <li>Our AI analyzes historical and predicted weather data for your event dates and location</li>
                              <li>We generate mood optimization recommendations based on expected weather conditions</li>
                              <li>Receive suggestions for lighting, music, activities, and even menu items that will create the perfect atmosphere</li>
                              <li>Includes real-time adjustments and a weather contingency plan</li>
                            </ol>
                          </div>
                        )}
                      </div>
                      
                      <div className={`border rounded-lg p-6 transition-all ${formData.emotionalJourney ? 'bg-purple-50 border-purple-200 shadow-md' : 'bg-white border-gray-200 hover:border-purple-200 hover:shadow-sm'}`}>
                        <div className="flex">
                          <div className={`rounded-full p-3 ${formData.emotionalJourney ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                            <Smile className="h-6 w-6" />
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center justify-between">
                              <h3 className={`text-lg font-medium ${formData.emotionalJourney ? 'text-purple-800' : 'text-gray-900'}`}>
                                Emotional Journey Mapper
                              </h3>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                $149
                              </span>
                            </div>
                            <p className={`mt-2 text-sm ${formData.emotionalJourney ? 'text-purple-700' : 'text-gray-500'}`}>
                              Design your event flow to create specific emotional experiences. Our AI suggests an emotional journey based on your event type and goals.
                            </p>
                            <div className="mt-4 flex items-center">
                              <input
                                id="emotionalJourney"
                                name="emotionalJourney"
                                type="checkbox"
                                checked={formData.emotionalJourney}
                                onChange={handleChange}
                                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label htmlFor="emotionalJourney" className="ml-2 block text-sm text-gray-700">
                                Add to my event
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        {formData.emotionalJourney && (
                          <div className="mt-6 bg-white border border-purple-100 rounded-md p-4">
                            <h4 className="text-sm font-medium text-purple-800 mb-2">How it works:</h4>
                            <ol className="list-decimal text-sm text-gray-600 pl-5 space-y-1">
                              <li>Our AI maps out a complete emotional journey tailored to your event goals</li>
                              <li>Receive a detailed schedule with carefully designed emotional touchpoints</li>
                              <li>Get specific recommendations for music, lighting, speaking patterns, and interactive elements</li>
                              <li>Includes personalization options for different audience segments</li>
                              <li>Post-event analysis and emotional impact reporting</li>
                            </ol>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="inline-flex justify-center py-3 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Next: Payment
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 3: Payment */}
            {formStep === 3 && (
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-white">Payment</h3>
                </div>
                
                {paymentSuccess ? (
                  <div className="p-10 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="h-10 w-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                    <p className="text-gray-600 text-center mb-6">
                      Your event has been created and your payment has been processed successfully.
                    </p>
                    <p className="text-gray-500 text-center">
                      You will be redirected to view your events shortly...
                    </p>
                  </div>
                ) : (
                  <div className="p-6 space-y-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Order Summary</h4>
                      <div className="border-t border-b border-gray-200 py-4 my-4">
                        {formData.weatherAdapter && (
                          <div className="flex justify-between text-sm mb-2">
                            <span>Weather-Mood Adapter</span>
                            <span>$99.00</span>
                          </div>
                        )}
                        
                        {formData.emotionalJourney && (
                          <div className="flex justify-between text-sm mb-2">
                            <span>Emotional Journey Mapper</span>
                            <span>$149.00</span>
                          </div>
                        )}
                        
                        {formData.selectedVendor && (
                          <div className="flex justify-between text-sm mb-2">
                            <span>Vendor: {vendors.find(v => v.id === formData.selectedVendor)?.name}</span>
                            <span>{formData.vendorBudget}</span>
                          </div>
                        )}
                        
                        {formData.selectedResources.length > 0 && (
                          <div className="flex justify-between text-sm mb-2">
                            <span>Resources ({formData.selectedResources.length})</span>
                            <span>${formData.resourcesBudget}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between font-medium text-lg">
                        <span>Total</span>
                        <span className="text-indigo-600">${paymentInfo.amount}</span>
                      </div>
                    </div>
                    
                    {parseFloat(paymentInfo.amount) > 0 ? (
                      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h4>
                        
                        <div className="space-y-6">
                          <div>
                            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                              Card Number
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <CreditCard className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="text"
                                name="cardNumber"
                                id="cardNumber"
                                value={paymentInfo.cardNumber}
                                onChange={handlePaymentChange}
                                placeholder="1234 5678 9012 3456"
                                className={`w-full block pl-10 pr-10 py-3 sm:text-sm border ${formErrors.cardNumber ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md`}
                                required={parseFloat(paymentInfo.amount) > 0}
                              />
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-gray-400" />
                              </div>
                            </div>
                            <ErrorMessage name="cardNumber" />
                          </div>
                          
                          <div>
                            <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                              Name on Card
                            </label>
                            <input
                              type="text"
                              name="cardName"
                              id="cardName"
                              value={paymentInfo.cardName}
                              onChange={handlePaymentChange}
                              className={`w-full block py-3 sm:text-sm border ${formErrors.cardName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md`}
                              required={parseFloat(paymentInfo.amount) > 0}
                              placeholder="John Doe"
                            />
                            <ErrorMessage name="cardName" />
                          </div>
                          
                          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <div>
                              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                                Expiration Date (MM/YY)
                              </label>
                              <input
                                type="text"
                                name="expiryDate"
                                id="expiryDate"
                                value={paymentInfo.expiryDate}
                                onChange={handlePaymentChange}
                                placeholder="MM/YY"
                                className={`w-full block py-3 sm:text-sm border ${formErrors.expiryDate ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md`}
                                required={parseFloat(paymentInfo.amount) > 0}
                                maxLength="5"
                              />
                              <ErrorMessage name="expiryDate" />
                            </div>
                            
                            <div>
                              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                                CVV
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  name="cvv"
                                  id="cvv"
                                  value={paymentInfo.cvv}
                                  onChange={handlePaymentChange}
                                  placeholder="123"
                                  className={`w-full block py-3 sm:text-sm border ${formErrors.cvv ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} rounded-md`}
                                  required={parseFloat(paymentInfo.amount) > 0}
                                  maxLength="4"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                  <Lock className="h-4 w-4 text-gray-400" />
                                </div>
                              </div>
                              <ErrorMessage name="cvv" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 bg-gray-50 p-4 rounded-md">
                          <div className="flex">
                            <Lock className="h-5 w-5 text-gray-500" />
                            <p className="ml-2 text-sm text-gray-500">
                              Your payment information is encrypted and secure. We do not store your credit card details.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 bg-green-50 border border-green-100 rounded-lg p-6">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        <p className="text-green-800 font-medium">
                          No payment required. You can proceed with creating your event.
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {!paymentSuccess && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="inline-flex justify-center py-3 px-6 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={processingPayment}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={processPayment}
                      disabled={processingPayment}
                      className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                    >
                      {processingPayment ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing Payment...
                        </>
                      ) : (
                        <>
                          Pay ${paymentInfo.amount} & Create Event
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventCreation;
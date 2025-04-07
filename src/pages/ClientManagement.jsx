import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust path as needed based on your project structure

// Client Management Component
const ClientManagement = () => {
  // State for clients data from Firebase
  const [clients, setClients] = useState([]);
  // State for loading status
  const [loading, setLoading] = useState(true);
  // State for modal visibility
  const [showModal, setShowModal] = useState(false);
  // State for new client data
  const [newClient, setNewClient] = useState({
    name: '',
    contact: '',
    events: 0,
    spend: '',
    satisfaction: ''
  });
  // State for form error
  const [formError, setFormError] = useState('');

  // Fetch clients from Firebase on component mount
  useEffect(() => {
    fetchClients();
  }, []);

  // Function to fetch clients from Firebase
  const fetchClients = async () => {
    try {
      setLoading(true);
      const clientsCollection = collection(db, 'clients');
      const clientsQuery = query(clientsCollection, orderBy('name'));
      const querySnapshot = await getDocs(clientsQuery);
      
      const fetchedClients = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setClients(fetchedClients);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setLoading(false);
    }
  };

  // Function to add a new client to Firebase
  const addClient = async (e) => {
    e.preventDefault();
    setFormError('');
    
    try {
      // Validation
      if (!newClient.name.trim()) {
        setFormError('Client name is required');
        return;
      }
      
      if (!newClient.contact.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newClient.contact)) {
        setFormError('Valid email is required');
        return;
      }
      
      // Add document to Firestore
      await addDoc(collection(db, 'clients'), {
        name: newClient.name.trim(),
        contact: newClient.contact.trim(),
        events: parseInt(newClient.events) || 0,
        spend: newClient.spend.trim(),
        satisfaction: newClient.satisfaction.trim()
      });
      
      // Reset form and close modal
      setNewClient({
        name: '',
        contact: '',
        events: 0,
        spend: '',
        satisfaction: ''
      });
      setShowModal(false);
      
      // Refresh client list
      fetchClients();
    } catch (error) {
      console.error('Error adding client:', error);
      setFormError('Failed to add client. Please try again.');
    }
  };

  // Handle input changes for the new client form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Client Management</h2>
          <button 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            onClick={() => setShowModal(true)}
          >
            Add Client
          </button>
        </div>
        <div className="p-5">
          {loading ? (
            <div className="text-center py-4">
              <p>Loading clients...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Events</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spend</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clients.length > 0 ? (
                    clients.map((client, i) => (
                      <tr key={client.id || i}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.contact}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.events}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.spend}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.satisfaction}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                          <button className="text-indigo-600 hover:text-indigo-900">Contact</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No clients found. Add your first client!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Client Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Client</h3>
            
            {formError && (
              <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                {formError}
              </div>
            )}
            
            <form onSubmit={addClient}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Client Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newClient.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-700">Contact Email</label>
                  <input
                    type="email"
                    id="contact"
                    name="contact"
                    value={newClient.contact}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="events" className="block text-sm font-medium text-gray-700">Number of Events</label>
                  <input
                    type="number"
                    id="events"
                    name="events"
                    value={newClient.events}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="spend" className="block text-sm font-medium text-gray-700">Total Spend</label>
                  <input
                    type="text"
                    id="spend"
                    name="spend"
                    value={newClient.spend}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="$0.00"
                  />
                </div>
                <div>
                  <label htmlFor="satisfaction" className="block text-sm font-medium text-gray-700">Satisfaction Rate</label>
                  <input
                    type="text"
                    id="satisfaction"
                    name="satisfaction"
                    value={newClient.satisfaction}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="e.g. 95%"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Add Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManagement;
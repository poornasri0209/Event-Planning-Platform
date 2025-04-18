import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust path as needed based on your project structure
import { Search } from 'lucide-react';

const ClientManagement = () => {
  // State for users data from Firebase
  const [users, setUsers] = useState([]);
  // State for filtered users (after search and alphabetical filtering)
  const [filteredUsers, setFilteredUsers] = useState([]);
  // State for loading status
  const [loading, setLoading] = useState(true);
  // State for error
  const [error, setError] = useState(null);
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  // State for alphabetical filter
  const [alphabetFilter, setAlphabetFilter] = useState('All');

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Update filtered users when search query, alphabet filter, or users change
  useEffect(() => {
    filterUsers();
  }, [searchQuery, alphabetFilter, users]);

  // Function to fetch users from Firestore
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get users from users collection
      const usersCollectionRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersCollectionRef);
      
      const fetchedUsers = [];
      querySnapshot.forEach((document) => {
        // Extract user data from document
        const userData = document.data();
        fetchedUsers.push({
          id: document.id,
          name: userData.firstName && userData.lastName 
            ? `${userData.firstName} ${userData.lastName}` 
            : userData.displayName || 'N/A',
          email: userData.email || 'N/A',
          dob: userData.dateOfBirth || 'N/A',
          firstName: userData.firstName || '',
          lastName: userData.lastName || ''
        });
      });
      
      // Sort users alphabetically by name as the default order
      fetchedUsers.sort((a, b) => a.name.localeCompare(b.name));
      
      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again later.');
      setLoading(false);
    }
  };

  // Filter users based on search query and alphabet filter
  const filterUsers = () => {
    let result = [...users];
    
    // Apply search filter if search query exists
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        user => 
          user.name.toLowerCase().includes(query) || 
          user.email.toLowerCase().includes(query)
      );
    }
    
    // Apply alphabet filter if not set to 'All'
    if (alphabetFilter !== 'All') {
      result = result.filter(user => {
        // Use firstName for filtering if available, otherwise use the first character of name
        const firstChar = user.firstName 
          ? user.firstName.charAt(0).toUpperCase() 
          : user.name.charAt(0).toUpperCase();
        return firstChar === alphabetFilter;
      });
    }
    
    setFilteredUsers(result);
  };

  // Format date for display if needed
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    
    // Handle Firestore timestamps
    if (dateString && typeof dateString.toDate === 'function') {
      return dateString.toDate().toLocaleDateString();
    }
    
    // Handle date strings
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  // Generate alphabet buttons for filtering
  const generateAlphabetButtons = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    return (
      <div className="flex flex-wrap gap-1 mb-4">
        <button
          onClick={() => setAlphabetFilter('All')}
          className={`px-3 py-1 text-sm rounded-md ${
            alphabetFilter === 'All'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {alphabet.map(letter => (
          <button
            key={letter}
            onClick={() => setAlphabetFilter(letter)}
            className={`px-3 py-1 text-sm rounded-md ${
              alphabetFilter === letter
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Registered Users</h2>
        </div>
        
        {error && (
          <div className="m-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}
        
        <div className="p-5">
          {/* Search box */}
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          
          {/* Alphabet filter */}
          {generateAlphabetButtons()}
          
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.dob)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                        {users.length > 0 
                          ? 'No users match your search criteria. Try adjusting your filters.'
                          : 'No users found. Users will appear here after they register.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Results count */}
          {!loading && users.length > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientManagement;
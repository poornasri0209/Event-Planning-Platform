import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, getDocs, addDoc, updateDoc, doc, serverTimestamp, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Send, Search, User, Clock, MessageSquare, Check, AlertCircle } from 'lucide-react';

const CommunicationsManagement = () => {
  // State for user chats
  const [users, setUsers] = useState([]);
  // State for currently selected user
  const [selectedUser, setSelectedUser] = useState(null);
  // State for messages
  const [messages, setMessages] = useState([]);
  // State for new message
  const [newMessage, setNewMessage] = useState('');
  // State for loading statuses
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  // State for sending message
  const [sending, setSending] = useState(false);
  // State for error
  const [error, setError] = useState('');
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  // State for unread counts
  const [unreadCounts, setUnreadCounts] = useState({});
  // Reference to scroll to bottom of messages
  const messagesEndRef = useRef(null);

  // Fetch users with messages on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to fetch users who have sent messages
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      
      // Get all unique users who have sent messages
      const messagesRef = collection(db, 'messages');
      const messagesSnapshot = await getDocs(messagesRef);
      
      // Extract unique users
      const uniqueUsers = new Map();
      messagesSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.userId && data.userEmail) {
          if (!uniqueUsers.has(data.userId)) {
            uniqueUsers.set(data.userId, {
              id: data.userId,
              email: data.userEmail,
              name: data.userName || 'User',
              lastMessage: data.content,
              lastTimestamp: data.timestamp,
              hasUnread: data.sender === 'user' && !data.isRead
            });
          } else {
            // Update if this message is newer
            const existingUser = uniqueUsers.get(data.userId);
            if (data.timestamp && (!existingUser.lastTimestamp || data.timestamp.toDate() > existingUser.lastTimestamp.toDate())) {
              existingUser.lastMessage = data.content;
              existingUser.lastTimestamp = data.timestamp;
            }
            // Update unread status
            if (data.sender === 'user' && !data.isRead) {
              existingUser.hasUnread = true;
            }
          }
        }
      });
      
      // Count unread messages for each user
      const unreadCountsMap = {};
      for (const [userId, _] of uniqueUsers) {
        const unreadQuery = query(
          messagesRef,
          where('userId', '==', userId),
          where('sender', '==', 'user'),
          where('isRead', '==', false)
        );
        const unreadSnapshot = await getDocs(unreadQuery);
        unreadCountsMap[userId] = unreadSnapshot.docs.length;
      }
      
      setUnreadCounts(unreadCountsMap);
      
      // Convert map to array and sort by most recent message
      let usersArray = Array.from(uniqueUsers.values());
      usersArray.sort((a, b) => {
        if (!a.lastTimestamp) return 1;
        if (!b.lastTimestamp) return -1;
        return b.lastTimestamp.toDate() - a.lastTimestamp.toDate();
      });
      
      setUsers(usersArray);
      
      // If there are users and none is selected, select the first one
      if (usersArray.length > 0 && !selectedUser) {
        setSelectedUser(usersArray[0]);
        fetchMessages(usersArray[0].id);
      }
      
      setLoadingUsers(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
      setLoadingUsers(false);
    }
  };

  // Function to fetch messages for a user
  const fetchMessages = async (userId) => {
    try {
      setLoadingMessages(true);
      
      // Create a query to get messages for the selected user
      const messagesRef = collection(db, 'messages');
      const q = query(
        messagesRef,
        where('userId', '==', userId),
        orderBy('timestamp', 'asc')
      );
      
      // Execute the query
      const querySnapshot = await getDocs(q);
      
      // Process the results
      const fetchedMessages = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp ? doc.data().timestamp.toDate() : new Date()
      }));
      
      setMessages(fetchedMessages);
      
      // Mark unread messages from user as read
      const unreadMessages = querySnapshot.docs.filter(
        doc => !doc.data().isRead && doc.data().sender === 'user'
      );
      
      for (const unreadDoc of unreadMessages) {
        const messageRef = doc(db, 'messages', unreadDoc.id);
        await updateDoc(messageRef, { isRead: true });
      }
      
      // Update unread count for this user
      if (unreadMessages.length > 0) {
        setUnreadCounts(prev => ({
          ...prev,
          [userId]: 0
        }));
      }
      
      setLoadingMessages(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages. Please try again.');
      setLoadingMessages(false);
    }
  };

  // Function to handle user selection
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    fetchMessages(user.id);
  };

  // Function to send a message
  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!selectedUser || !newMessage.trim()) return;
    
    try {
      setSending(true);
      setError('');
      
      // Add message to Firestore
      await addDoc(collection(db, 'messages'), {
        userId: selectedUser.id,
        userEmail: selectedUser.email,
        userName: selectedUser.name,
        content: newMessage.trim(),
        sender: 'admin',
        timestamp: serverTimestamp(),
        isRead: false
      });
      
      // Clear input
      setNewMessage('');
      
      // Refresh messages
      fetchMessages(selectedUser.id);
      
      setSending(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      setSending(false);
    }
  };

  // Function to format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to filter users based on search query
  const filteredUsers = searchQuery
    ? users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Communications Management</h2>
        </div>
        
        <div className="min-h-[700px] flex">
          {/* Users list */}
          <div className="w-1/3 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div className="overflow-y-auto h-[calc(700px-65px)]">
              {loadingUsers ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-indigo-500"></div>
                </div>
              ) : filteredUsers.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <li 
                      key={user.id}
                      className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedUser?.id === user.id ? 'bg-indigo-50' : ''
                      }`}
                      onClick={() => handleSelectUser(user)}
                    >
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <User className="h-6 w-6 text-indigo-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900 flex items-center">
                                {user.name}
                                {unreadCounts[user.id] > 0 && (
                                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                    {unreadCounts[user.id]}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                          {user.lastTimestamp && (
                            <div className="text-xs text-gray-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatTimestamp(user.lastTimestamp.toDate())}
                            </div>
                          )}
                        </div>
                        <div className="mt-2 text-sm text-gray-500 truncate">
                          {user.lastMessage}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                  <MessageSquare className="h-8 w-8 text-gray-400 mb-2" />
                  <p>No conversations found</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Messages area */}
          <div className="w-2/3 flex flex-col">
            {selectedUser ? (
              <>
                {/* User info header */}
                <div className="p-4 border-b border-gray-200 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">{selectedUser.name}</div>
                    <div className="text-sm text-gray-500">{selectedUser.email}</div>
                  </div>
                </div>
                
                {/* Messages container */}
                <div className="flex-grow p-4 overflow-y-auto bg-gray-50">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-indigo-500"></div>
                    </div>
                  ) : messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div 
                          key={msg.id} 
                          className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                              msg.sender === 'admin' 
                                ? 'bg-indigo-600 text-white rounded-br-none' 
                                : 'bg-gray-200 text-gray-800 rounded-bl-none'
                            }`}
                          >
                            <p className={`text-sm ${msg.sender === 'admin' ? 'text-indigo-100' : 'text-gray-500'}`}>
                              {msg.sender === 'admin' ? 'Support Team' : selectedUser.name}
                            </p>
                            <p className="mt-1">{msg.content}</p>
                            <div className="flex items-center justify-end mt-1">
                              <p className={`text-xs ${msg.sender === 'admin' ? 'text-indigo-200' : 'text-gray-500'}`}>
                                {formatTimestamp(msg.timestamp)}
                              </p>
                              {msg.sender === 'admin' && (
                                <span className="ml-1">
                                  {msg.isRead ? (
                                    <Check className="h-3 w-3 text-indigo-200" />
                                  ) : (
                                    <div className="h-3 w-3" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                      <p>No messages in this conversation yet.</p>
                      <p className="mt-2 text-sm">Start the conversation by sending a message.</p>
                    </div>
                  )}
                </div>
                
                {/* Message input */}
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={sendMessage} className="flex items-center">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-grow block border border-gray-300 rounded-l-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      disabled={sending || !newMessage.trim()}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                    >
                      {sending ? 'Sending...' : <Send className="h-5 w-5" />}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
                <p className="text-xl">Select a conversation</p>
                <p className="mt-2">Choose a user from the list to view and respond to messages.</p>
              </div>
            )}
          </div>
        </div>
        
        {error && (
          <div className="px-5 py-4 bg-red-50 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunicationsManagement;
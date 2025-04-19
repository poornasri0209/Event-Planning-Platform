import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, query, where, orderBy, getDocs, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import Navbar from '../components/Navbar';

const CommunicationPage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Fetch messages on component mount
  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
    
    fetchMessages();
  }, [currentUser, navigate]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to fetch messages from Firestore
  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      // Create a query to get messages for the current user
      const messagesRef = collection(db, 'messages');
      const q = query(
        messagesRef,
        where('userId', '==', currentUser.uid),
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
      setLoading(false);
      
      // Mark all unread messages as read
      const unreadMessages = fetchedMessages.filter(msg => !msg.isRead && msg.sender === 'admin');
      
      for (const msg of unreadMessages) {
        const messageRef = doc(db, 'messages', msg.id);
        await updateDoc(messageRef, {
          isRead: true
        });
      }
      
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages. Please try again later.');
      setLoading(false);
    }
  };

  // Function to scroll to the bottom of the messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to send a message
  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    try {
      setSending(true);
      setError('');
      
      // Add message to Firestore
      await addDoc(collection(db, 'messages'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || 'User',
        content: message.trim(),
        sender: 'user',
        timestamp: serverTimestamp(),
        isRead: false
      });
      
      // Clear input
      setMessage('');
      
      // Refresh messages
      fetchMessages();
      
      setSending(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      setSending(false);
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 border-b border-gray-200 flex items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="mr-4 text-white hover:text-gray-200"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-semibold text-white flex-grow">Communication Center</h2>
          </div>
          
          {error && (
            <div className="px-6 py-4 bg-red-50 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          {/* Messages container */}
          <div className="h-96 px-6 py-4 overflow-y-auto bg-gray-50">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-indigo-500"></div>
              </div>
            ) : messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                        msg.sender === 'user' 
                          ? 'bg-indigo-600 text-white rounded-br-none' 
                          : 'bg-gray-200 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p className={`text-sm ${msg.sender === 'user' ? 'text-indigo-100' : 'text-gray-500'}`}>
                        {msg.sender === 'user' ? 'You' : 'Support Team'}
                      </p>
                      <p className="mt-1">{msg.content}</p>
                      <p className={`text-xs mt-1 text-right ${msg.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'}`}>
                        {formatTimestamp(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <p className="text-center">No messages yet. Start the conversation by sending a message below.</p>
              </div>
            )}
          </div>
          
          {/* Message input */}
          <div className="px-6 py-4 bg-white border-t border-gray-200">
            <form onSubmit={sendMessage} className="flex items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow block border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || !message.trim()}
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {sending ? 'Sending...' : <Send size={18} />}
              </button>
            </form>
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help with your event planning? Send us a message and our team will get back to you as soon as possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationPage;
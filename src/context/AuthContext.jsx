import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  sendEmailVerification,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import app from '../firebase'; // Import the Firebase app instance

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const auth = getAuth(app);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsMultiFactor, setNeedsMultiFactor] = useState(false);
  const [userPhoneNumber, setUserPhoneNumber] = useState('');
  const [verificationMethod, setVerificationMethod] = useState('email'); // 'email' or 'phone'
  const [verificationId, setVerificationId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Set persistent auth
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(error => {
      console.error("Error setting persistence:", error);
    });
  }, [auth]);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setCurrentUser(user);
        
        // Check if user is admin
        if (user.email === 'admin@admin.com') {
          setIsAdmin(true);
          setNeedsMultiFactor(false); // Admin bypasses 2FA
          
          // Store admin status in localStorage to persist across reloads
          localStorage.setItem('isAdmin', 'true');
        } else {
          setIsAdmin(false);
          localStorage.removeItem('isAdmin');
        }
      } else {
        // Check if we have a stored admin user
        if (localStorage.getItem('isAdmin') === 'true') {
          // Recreate admin user object
          const adminUser = {
            uid: 'admin-user',
            email: 'admin@admin.com',
            displayName: 'Admin User',
          };
          setCurrentUser(adminUser);
          setIsAdmin(true);
          setNeedsMultiFactor(false);
        } else {
          setCurrentUser(null);
          setIsAdmin(false);
        }
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  // Register a new user
  const register = async (email, password, firstName, lastName, phone) => {
    try {
      // Validate phone number format
      if (!phone.startsWith('+')) {
        throw new Error('Phone number must include country code (e.g., +1 for US)');
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      });
      
      // Store the phone number
      setUserPhoneNumber(phone);
      localStorage.setItem('userPhoneNumber', phone);
      
      // Send email verification
      await sendEmailVerification(userCredential.user);
      
      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  // Sign in a user
  const login = async (email, password) => {
    try {
      // Special case for admin
      if (email === 'admin@admin.com' && password === 'admin123') {
        // For admin user, we'll create a synthetic user object 
        // Store admin flag in localStorage for persistence
        localStorage.setItem('isAdmin', 'true');
        
        const adminUser = {
          uid: 'admin-user',
          email: 'admin@admin.com',
          displayName: 'Admin User',
        };
        
        // Set current user and admin flag
        setCurrentUser(adminUser);
        setIsAdmin(true);
        setNeedsMultiFactor(false);
        
        return { user: adminUser, isAdmin: true };
      }
      
      // Regular user login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Set default verification method
      setVerificationMethod('email');
      setNeedsMultiFactor(true);
      
      return userCredential;
    } catch (error) {
      console.error('Login error in context:', error);
      throw error;
    }
  };

  // Send email verification link
  const sendVerificationEmail = async () => {
    try {
      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }
      
      await sendEmailVerification(currentUser);
      return true;
    } catch (error) {
      throw error;
    }
  };

  // Set up phone verification
  const setupPhoneVerification = async (phoneNumber) => {
    try {
      const formattedPhoneNumber = phoneNumber || userPhoneNumber || localStorage.getItem('userPhoneNumber');
      
      if (!formattedPhoneNumber) {
        throw new Error('No phone number available');
      }
      
      // For development testing only - bypass actual phone verification
      console.log("Phone verification would normally send a code to:", formattedPhoneNumber);
      setVerificationMethod('phone');
      return true;
    } catch (error) {
      console.error('Phone verification setup error:', error);
      throw new Error(`Failed to set up phone verification: ${error.message}`);
    }
  };

  // Verify phone OTP
  const verifyPhoneOTP = async (otp) => {
    // For development testing only
    // Always return true for any 6-digit OTP
    if (otp.length === 6) {
      return true;
    }
    
    throw new Error('Invalid verification code');
  };

  // Logout
  const logout = async () => {
    try {
      // Clear admin flag from localStorage
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('userPhoneNumber');
      
      // If admin user (which is not actually authenticated with Firebase)
      if (isAdmin && currentUser?.email === 'admin@admin.com') {
        setCurrentUser(null);
        setIsAdmin(false);
        setNeedsMultiFactor(false);
        return;
      }
      
      // Regular Firebase logout
      await signOut(auth);
      setNeedsMultiFactor(false);
      setVerificationId('');
      setIsAdmin(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    needsMultiFactor,
    setNeedsMultiFactor,
    verificationMethod,
    setVerificationMethod,
    userPhoneNumber,
    setUserPhoneNumber,
    isAdmin,
    loading,
    register,
    login,
    logout,
    sendVerificationEmail,
    setupPhoneVerification,
    verifyPhoneOTP
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
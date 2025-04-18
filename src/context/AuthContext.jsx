import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile
      await updateProfile(userCredential.user, {
        displayName: `${firstName} ${lastName}`
      });
      
      // Store additional user data in localStorage if needed
      localStorage.setItem('userPhone', phone);
      
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
        
        return { user: adminUser, isAdmin: true };
      }
      
      // Regular user login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      return userCredential;
    } catch (error) {
      console.error('Login error in context:', error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      // Clear admin flag from localStorage
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('userPhone');
      
      // If admin user (which is not actually authenticated with Firebase)
      if (isAdmin && currentUser?.email === 'admin@admin.com') {
        setCurrentUser(null);
        setIsAdmin(false);
        return;
      }
      
      // Regular Firebase logout
      await signOut(auth);
      setIsAdmin(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    isAdmin,
    loading,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
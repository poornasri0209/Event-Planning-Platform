// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuj_vl2HT3QfQlt_uRsQni14xWfwM_NDI",
  authDomain: "sentinentstories-8afcb.firebaseapp.com",
  projectId: "sentinentstories-8afcb",
  storageBucket: "sentinentstories-8afcb.firebasestorage.app",
  messagingSenderId: "1002716497830",
  appId: "1:1002716497830:web:b225e4a6d88a32d46bf167",
  measurementId: "G-8GNHN3BXQR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
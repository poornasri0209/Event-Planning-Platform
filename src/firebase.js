// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBuj_vl2HT3QfQlt_uRsQni14xWfwM_NDI",
  authDomain: "sentinentstories-8afcb.firebaseapp.com",
  projectId: "sentinentstories-8afcb",
  storageBucket: "sentinentstories-8afcb.appspot.com",
  messagingSenderId: "1002716497830",
  appId: "1:1002716497830:web:b225e4a6d88a32d46bf167",
  measurementId: "G-8GNHN3BXQR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
export default app;
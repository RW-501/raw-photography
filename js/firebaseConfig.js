// firebaseConfig.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js'; // Include storage
import { getAuth } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js";

// Firebase configuration object
const firebaseConfig = {
 //   apiKey: import.meta.env.VITE_FIREBASE_API_KEY, // Use environment variables for sensitive data
 apiKey: "AIzaSyC2bb6osv0jnvpnETCVoG6bvBynGGsOVaw",

 authDomain: "raw-photography-12616.firebaseapp.com",
    projectId: "raw-photography-12616",
    storageBucket: "raw-photography-12616.appspot.com",
    messagingSenderId: "1078385378836",
    appId: "1:1078385378836:web:bb8f9611bfbdac1e480901",
    measurementId: "G-0DLEHE7DEK"
};

// Initialize Firebase
let app;
let db;
let storage;
let auth;

try {
     app = initializeApp(firebaseConfig);
 auth = getAuth(app);

    db = getFirestore(app);
    storage = getStorage(app); // Initialize storage
    console.log("Firebase initialized successfully.");
} catch (error) {
    console.error("Error initializing Firebase:", error);
}

// Export Firestore and Storage instances for use in other modules
export { db, storage, auth };

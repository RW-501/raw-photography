// Function to dynamically append Firebase SDKs to the body
function loadFirebaseSDKs() {
    const firebaseScripts = [
        "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js",
        "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js",
        "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js",
        "https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js",
        "https://www.gstatic.com/firebasejs/9.17.2/firebase-analytics.js"
    ];

    let loadPromises = firebaseScripts.map(src => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.type = "module"; // Specify the script type as module
            script.async = true; // Load script asynchronously
            script.onload = () => resolve(); // Resolve promise when loaded
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.body.appendChild(script);
        });
    });

    // Wait for all scripts to load
    Promise.all(loadPromises)
        .then(() => {
            initializeFirebase(); // Call Firebase initialization after all scripts are loaded
        })
        .catch(error => {
            console.error("Error loading Firebase SDKs:", error);
        });
}

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js';
import { getFirestore, getAuth, getStorage, initializeAnalytics } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js';

let auth;
let db;
let storage;
let analytics;

// Function to initialize Firebase
function initializeFirebase() {

    // Firebase configuration object
    const firebaseConfig = {
        apiKey: "AIzaSyC2bb6osv0jnvpnETCVoG6bvBynGGsOVaw",
        authDomain: "raw-photography-12616.firebaseapp.com",
        projectId: "raw-photography-12616",
        storageBucket: "raw-photography-12616.appspot.com",
        messagingSenderId: "1078385378836",
        appId: "1:1078385378836:web:bb8f9611bfbdac1e480901",
        measurementId: "G-0DLEHE7DEK"
    };

    try {
        const app = initializeApp(firebaseConfig);
         auth = getAuth(app); // Initialize auth
         db = getFirestore(app); // Initialize Firestore
         storage = getStorage(app); // Initialize Storage
         analytics = initializeAnalytics(app);

        console.log("Firebase initialized successfully.");
        console.log("Firestore initialized:", db);
        console.log("db.collection exists:", typeof db.collection === "function"); // Expect this to be false with v9

        // Export your Firebase instances if needed

    } catch (error) {
        console.error("Error initializing Firebase:", error);
    }
}

// Load Firebase SDKs when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', loadFirebaseSDKs);

// Export Firestore, Storage, and Auth instances for use in other modules
export {  db, doc,getDoc, query, updateDoc,
    setDoc,  addDoc,    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    OAuthProvider,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    where, getDocs, storage, collection, auth, analytics};


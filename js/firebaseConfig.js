    // Function to dynamically append Firebase SDKs to the body
    function loadFirebaseSDKs() {
        const firebaseScripts = [
            "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js",
            "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js",
            "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js",
            "https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js",
            "https://www.gstatic.com/firebasejs/9.17.2/firebase-analytics.js"
        ];

        firebaseScripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true; // Load script asynchronously
            document.body.appendChild(script);
        });
    }

    // Load Firebase SDKs when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', loadFirebaseSDKs);
    
// firebaseConfig.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js';
import {     getFirestore,
    doc, where,
    updateDoc,
    setDoc, limit, 
    serverTimestamp,query ,
    collection,
    getDocs,
    getDoc } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js';
import { getStorage
 } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js';
import {   getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    OAuthProvider,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js'; // Updated to match other imports
    import { initializeAnalytics } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-analytics.js";

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

// Initialize Firebase
let app;
let db;
let storage;
let auth;
let analytics;
let firestore;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app); // Initialize auth
    db = getFirestore(app); // Initialize Firestore
    storage = getStorage(app); // Initialize Storage
    analytics = initializeAnalytics(app);
     firestore = getFirestore(app); // Initialize Firestore

    console.log("Firebase initialized successfully.");
} catch (error) {
    console.error("Error initializing Firebase:", error);
}

// Export Firestore, Storage, and Auth instances for use in other modules
export {  db, doc,getDoc, query, updateDoc,
    setDoc,     signInWithPopup,
    GoogleAuthProvider,
    FacebookAuthProvider,
    OAuthProvider,
    signOut, firestore,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    where, getDocs, storage, collection, auth, analytics};


    console.log("Firestore initialized:", db);
console.log("db.collection exists:", typeof db.collection === "function");

// Get the elements
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('error-message');

// Firebase Authentication setup
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    // Firebase sign-in
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Successfully signed in
            window.location.href = 'admin/dashboard.html'; // Redirect to admin dashboard
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessageText = error.message;
            errorMessage.textContent = errorMessageText; // Display error message
        });
});

// dashboard Initialize Firebase
const db = firebase.firestore();

// Function to fetch key metrics
async function fetchMetrics() {
    try {
        // Get total images
        const imagesSnapshot = await db.collection('images').get();
        document.getElementById('totalImages').textContent = imagesSnapshot.size;

        // Get total purchases
        const purchasesSnapshot = await db.collection('purchases').get();
        document.getElementById('totalPurchases').textContent = purchasesSnapshot.size;

        // Get pending appointments
        const appointmentsSnapshot = await db.collection('appointments').where('status', '==', 'pending').get();
        document.getElementById('pendingAppointments').textContent = appointmentsSnapshot.size;

        // Calculate total revenue
        let totalRevenue = 0;
        purchasesSnapshot.forEach(doc => {
            totalRevenue += doc.data().amount;
        });
        document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
    } catch (error) {
        console.error("Error fetching metrics: ", error);
    }
}

// Function to fetch recent purchases
async function fetchRecentPurchases() {
    try {
        const purchasesSnapshot = await db.collection('purchases').orderBy('datePurchased', 'desc').limit(5).get();
        const purchasesList = document.getElementById('recentPurchases');
        purchasesList.innerHTML = ''; // Clear the list

        purchasesSnapshot.forEach(doc => {
            const purchaseData = doc.data();
            const listItem = document.createElement('li');
            listItem.textContent = `Purchase ID: ${purchaseData.purchaseId}, Amount: $${purchaseData.amount.toFixed(2)}, Date: ${purchaseData.datePurchased.toDate().toLocaleString()}`;
            purchasesList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Error fetching recent purchases: ", error);
    }
}

// Call functions to fetch data on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchMetrics();
    fetchRecentPurchases();
});


function replaceNavbarNav() {
    // Select the .navbar-nav element within the .admin-header
    const navbarNav = document.querySelector('.admin-header .navbar-nav');

    // If .navbar-nav is found, proceed
    if (navbarNav) {
        // Define the new list items for .navbar-nav
        const newNavItemsHTML = `
            <li class="nav-item"><a class="nav-link" href="../index">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="../admin/dashboard">Dashboard</a></li>
            <li class="nav-item"><a class="nav-link" href="design">Design</a></li>
            <li class="nav-item"><a class="nav-link" href="images">Images</a></li>
            <li class="nav-item"><a class="nav-link" href="analytics">Analytics</a></li>
            <li class="nav-item"><a class="nav-link" href="purchases">Purchases</a></li>
            <li class="nav-item"><a class="nav-link" href="appointments">Appointments</a></li>
            <li class="nav-item"><a class="nav-link" href="settings">Settings</a></li>
        `;

        // Replace the contents of .navbar-nav with the new items
        navbarNav.innerHTML = newNavItemsHTML;
    } else {
        console.error("The .navbar-nav element within .admin-header was not found.");
    }
}

// Run the function to replace the .navbar-nav content
replaceNavbarNav();

// Get the elements
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('error-message');


// Authenticate admin
auth.onAuthStateChanged(user => {
    if (!user || user.role !== 'admin') {
        window.location = '../admin-login.html'; // Redirect to login if not authenticated
    }
});


        // Logout function
        function logout() {
            firebase.auth().signOut()
                .then(() => {
                    // Clear local storage
                    localStorage.removeItem('adminEmail');

                    // Redirect to the login page
                    window.location.href = '../';
                })
                .catch(error => {
                    console.error("Error during logout:", error);
                });
        }

        // Attach logout function to the button
        document.getElementById('logoutBtn').addEventListener('click', logout);
   

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



// Function to fetch and display metrics
function fetchMetrics() {
    db.collection('analytics').doc('metrics').get().then(doc => {
        if (doc.exists) {
            document.getElementById('totalImages').innerText = doc.data().totalImages || 0;
            document.getElementById('totalPurchases').innerText = doc.data().totalPurchases || 0;
            document.getElementById('pendingAppointments').innerText = doc.data().pendingAppointments || 0;
            document.getElementById('totalRevenue').innerText = `$${doc.data().totalRevenue || 0}`;
        }
    }).catch(error => console.error('Error fetching metrics:', error));
}

// Function to fetch recent purchases
function fetchRecentPurchases() {
    db.collection('purchases').orderBy('datePurchased', 'desc').limit(5).get().then(snapshot => {
        const purchasesList = document.getElementById('recentPurchases');
        purchasesList.innerHTML = ''; // Clear existing list
        snapshot.forEach(doc => {
            const purchase = doc.data();
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = `${purchase.userId} purchased ${purchase.imageId} on ${new Date(purchase.datePurchased).toLocaleDateString()}`;
            purchasesList.appendChild(listItem);
        });
    }).catch(error => console.error('Error fetching purchases:', error));
}

// Function to set user preferences in local storage
function setUserPreferences(preferences) {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
}

// Call the functions on page load
fetchMetrics();
fetchRecentPurchases();



// Toast Notification Function
function showToast(message, type = 'info', duration = 3000) {
   
    // Create a div for the toast
    const toast = document.createElement('div');
    
    // Set inline styles for the toast
    toast.style.position = 'fixed';
    toast.style.bottom = '20px'; // Position from the bottom
    toast.style.left = '50%'; // Center horizontally
    toast.style.transform = 'translateX(-50%)'; // Centering
    toast.style.padding = '15px 20px'; // Padding for the toast
    toast.style.borderRadius = '5px'; // Rounded corners
    toast.style.color = 'white'; // Text color
    toast.style.fontSize = '16px'; // Font size
    toast.style.zIndex = '9999'; // Ensure it appears above other elements
    toast.style.transition = 'opacity 0.5s ease'; // Fade transition
    
    // Set background color based on toast type
    switch (type) {
        case 'success':
            toast.style.backgroundColor = '#4CAF50'; // Green for success
            break;
        case 'error':
            toast.style.backgroundColor = '#F44336'; // Red for error
            break;
        case 'info':
            toast.style.backgroundColor = '#2196F3'; // Blue for info
            break;
        case 'warning':
            toast.style.backgroundColor = '#FF9800'; // Orange for warning
            break;
        default:
            toast.style.backgroundColor = '#2196F3'; // Default to info
    }

   

    toast.className = `toast toast-${type}`; // Add classes for styling
    toast.innerText = message; // Set the message text

    // Append the toast to the body
    document.body.appendChild(toast);

    // Set a timer to remove the toast after the specified duration
    setTimeout(() => {
        toast.classList.add('fade-out'); // Add fade-out effect
        setTimeout(() => {
            document.body.removeChild(toast); // Remove toast from DOM
        }, 500); // Time to wait for fade-out animation
    }, duration);
}

// Example usage: Replace alerts with showToast
// showToast('This is a success message!', 'success');
// showToast('This is an error message!', 'error');
// showToast('This is an info message!', 'info');
// showToast('This is a warning message!', 'warning');



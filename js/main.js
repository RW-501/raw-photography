import { db } from './firebaseConfig.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js';



// EVENTS.HTML

// Fetch events from Firestore and populate the gallery
function fetchEvents() {
    db.collection("events").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const eventData = doc.data();
            const eventItem = document.createElement("div");
            eventItem.className = "event-item";
            eventItem.innerHTML = `
                <img src="${eventData.coverImage}" alt="${eventData.title}" onclick="openModal('${doc.id}')">
                <h2>${eventData.title}</h2>
            `;
            document.getElementById("eventGalleryGrid").appendChild(eventItem);
        });
    });
}

// Open modal with event details
function openModal(eventId) {
    db.collection("events").doc(eventId).get().then((doc) => {
        const eventData = doc.data();
        const modalContent = document.getElementById("modalContent");
        modalContent.innerHTML = `
            <h2>${eventData.title}</h2>
            <p>${eventData.description}</p>
            <div class="images">
                ${eventData.imageIds.map(imgId => `<img src="${imgId}" alt="${eventData.title}">`).join("")}
            </div>
        `;
        document.getElementById("eventModal").style.display = "block";
    });
}

// Close the modal
function closeModal() {
    document.getElementById("eventModal").style.display = "none";
}

// Initialize the fetch process
fetchEvents();


        // Auto move to next input (if applicable)
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const nextInput = e.target.nextElementSibling;
                    if (nextInput) {
                        nextInput.focus();
                    }
                }
            });
        });

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



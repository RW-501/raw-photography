import { db } from './firebaseConfig.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js';



// EVENTS.HTML
document.addEventListener("DOMContentLoaded", () => {
    loadEvents();
});

// Load events from Firestore and display them in the gallery
async function loadEvents() {
    const eventGalleryGrid = document.getElementById("eventGalleryGrid");
    const eventsSnapshot = await getDocs(collection(db, "events"));

    eventsSnapshot.forEach((doc) => {
        const eventData = doc.data();
        const eventDiv = document.createElement("div");
        eventDiv.className = "event-item";
        eventDiv.innerHTML = `
            <img src="${eventData.coverImage}" alt="${eventData.title}" onclick="openModal('${doc.id}')">
            <h3>${eventData.title}</h3>
            <p>${eventData.date.toDate().toDateString()}</p>
        `;
        eventGalleryGrid.appendChild(eventDiv);
    });
}

// Function to open the modal with event details
window.openModal = async function(eventId) {
    const modal = document.getElementById("eventModal");
    const modalContent = document.getElementById("modalContent");

    modal.style.display = "block";
    modalContent.innerHTML = "";  // Clear previous content

    const eventRef = collection(db, "events").doc(eventId);
    const eventDoc = await eventRef.get();
    if (eventDoc.exists) {
        const eventData = eventDoc.data();

        modalContent.innerHTML = `
            <h2>${eventData.title}</h2>
            <p>${eventData.description}</p>
            <div class="modal-gallery">
                ${eventData.imageIds.map(id => `<img src="${id}" class="modal-image">`).join("")}
            </div>
        `;
    }
};

// Function to close the modal
window.closeModal = function() {
    document.getElementById("eventModal").style.display = "none";
};





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







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
// showToast('This is an error message!', 'error', duration);
// showToast('This is an info message!', 'info');
// showToast('This is a warning message!', 'warning');

import { db, storage } from './js/firebaseConfig.js';

async function applyStylesFromSettings() {
    // Fetch settings from Firestore
    try {
        const doc = await db.collection('settings').doc('siteDesign').get();

        if (doc.exists) {
            const data = doc.data();

            // Create a style element
            const style = document.createElement('style');
            style.type = 'text/css';

            // Add styles to the style element
            style.innerHTML = `
                body {
                    background-color: ${data.themeColor} !important;
                    font-family: ${data.font} !important;
                }
                #navigation-menu {
                    color: ${data.navFontColor} !important;
                    background-color: ${data.navBackgroundColor} !important;
                }
                #site-footer {
                    color: ${data.footerFontColor} !important;
                    background-color: ${data.footerBackgroundColor} !important;
                }
                /* Add additional styles as needed */
            `;

            // Append the style element to the head
            document.head.appendChild(style);
            console.log("Styles applied successfully!");
        } else {
            console.error("No such document!");
        }
    } catch (error) {
        console.error("Error fetching styles: ", error);
    }
}

// Call the function to apply styles
applyStylesFromSettings();

// Function to fetch settings and update footer elements
async function updateFooterElements() {
    try {

        // Fetch social media links and other websites from the 'social_media' document
        const socialMediaDoc = await db.collection("settings").doc("social_media").get();
        const socialIconsContainer = document.querySelector(".social-icons");

        if (socialMediaDoc.exists) {
            const socialMediaData = socialMediaDoc.data();
            
            // Clear existing social links
            socialIconsContainer.innerHTML = "";

            // Loop through social media and website links dynamically
            Object.keys(socialMediaData).forEach(key => {
                const link = socialMediaData[key];
                const anchor = document.createElement("a");
                anchor.href = link;
                anchor.target = "_blank";
                anchor.classList.add("social-link");

                // Add an icon or text based on the platform name
                let icon;
                if (key.toLowerCase() === "facebook") {
                    icon = `<i class="fab fa-facebook"></i>`;
                } else if (key.toLowerCase() === "instagram") {
                    icon = `<i class="fab fa-instagram"></i>`;
                } else if (key.toLowerCase() === "twitter") {
                    icon = `<i class="fab fa-twitter"></i>`;
                } else {
                    // Default icon or name if it's another website
                    icon = `<i class="fas fa-globe"></i> ${key.charAt(0).toUpperCase() + key.slice(1)}`;
                }

                anchor.innerHTML = icon;
                socialIconsContainer.appendChild(anchor);
            });
        } else {
            console.error("No 'social_media' document found.");
        }

        // Fetch footer text content from the 'footer' document
        const footerDoc = await db.collection("settings").doc("footer").get();
        if (footerDoc.exists) {
            const footerData = footerDoc.data();
            const currentYear = new Date().getFullYear();
            document.querySelector("footer-body p").innerHTML = 
                `${footerData.copyrightText} &copy; ${currentYear}`;
        } else {
            console.error("No 'footer' document found.");
        }
    } catch (error) {
        console.error("Error fetching footer elements:", error);
    }
}

// Call the function to update the footer elements when the page loads
document.addEventListener("DOMContentLoaded", updateFooterElements);

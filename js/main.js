



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


async function applyStylesFromSettings() {
    // Fetch settings from Firestore
    const db = firebase.firestore();
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

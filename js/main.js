import {  db, doc,getDoc, query, updateDoc,
  setDoc,     signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signOut,
  onAuthStateChanged, firestore,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  where, getDocs, storage, collection, auth, analytics } from '../js/firebaseConfig.js';

console.log("Page loaded main ?????????????");

// Create the CSS styles as a string
const styles = ` 
  #loadingContainer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  #cameraSpinner {
    position: relative;
    width: 120px;
    height: 120px;
  }

  /* DSLR Camera Body */
  .camera-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 60px;
    background-color: #333;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }

  /* Shutter button on the camera */
  .camera-icon::before {
    content: '';
    position: absolute;
    top: -10px;
    right: 10px;
    width: 10px;
    height: 10px;
    background-color: #007bff;
    border-radius: 50%;
  }

  /* Flash on the camera */
  .camera-icon::after {
    content: '';
    position: absolute;
    top: -15px;
    left: 15px;
    width: 6px;
    height: 10px;
    background-color: #999;
    border-radius: 2px;
  }

  /* Lens */
  .lens {
    width: 35px;
    height: 35px;
    background-color: #222;
    border: 5px solid #666;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3) inset;
    position: relative;
  }

  /* Inner lens glass effect */
  .lens::after {
    content: '';
    position: absolute;
    width: 15px;
    height: 15px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    top: 5px;
    left: 5px;
  }

  /* Spinner Circle to simulate rotating lens */
  .spinner-circle {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 6px solid transparent;
    border-top-color: #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    z-index: -1;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Create a style element and add the CSS to the document head
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// Create the main loading container
const loadingContainer = document.createElement('div');
loadingContainer.id = 'loadingContainer';

// Create the camera icon with spinner
const cameraSpinner = document.createElement('div');
cameraSpinner.id = 'cameraSpinner';
cameraSpinner.innerHTML = `
  <div class="camera-icon">
    <div class="lens"></div>
  </div>
  <div class="spinner-circle"></div>
`;

// Append camera spinner to loading container
loadingContainer.appendChild(cameraSpinner);

// Add the loading container to the body
document.body.appendChild(loadingContainer);

// Optionally, set display to none initially if you want it hidden by default
loadingContainer.style.display = 'none';

// Function to apply loading spinner colors based on settings
async function applyLoadingSpinnerColors() {
  const docRef = doc(firestore, "settings", "loading_spinner"); // Create a document reference
  const docSnap = await getDoc(docRef); // Get the document snapshot

  if (docSnap.exists()) {
      const data = docSnap.data();

        // Extract color settings from the document
        const {
          backgroundColor = "rgba(255, 255, 255, 0.8)", 
          cameraBodyColor = "#333",
          shutterButtonColor = "#007bff",
          flashColor = "#999",
          lensColor = "#222",
          lensBorderColor = "#666",
          spinnerCircleColor = "#007bff"
        } = doc.data();
  
        // Apply colors to individual elements
        document.querySelector("#loadingContainer").style.backgroundColor = backgroundColor;
        document.querySelector(".camera-icon").style.backgroundColor = cameraBodyColor;
        document.querySelector(".camera-icon::before").style.backgroundColor = shutterButtonColor;
        document.querySelector(".camera-icon::after").style.backgroundColor = flashColor;
        document.querySelector(".lens").style.backgroundColor = lensColor;
        document.querySelector(".lens").style.borderColor = lensBorderColor;
        document.querySelector(".spinner-circle").style.borderTopColor = spinnerCircleColor;
      } else {
        console.error("No color settings found in 'loading_spinner' document.");
      }
   
  }
  
  // Call the function to apply settings when needed (e.g., on page load or spinner show)
  applyLoadingSpinnerColors();
  


// Function to show the loading spinner on page load
function showLoadingSpinner(automatic = true) {
  const loadingContainer = document.querySelector("#loadingContainer");
  console.log("Loading Container:", loadingContainer);
    loadingContainer.style.display = 'flex';

    console.log("automatic??  ",automatic);

    if (automatic.isTrusted == true || automatic == true) {
      console.log("hide?? ");
      setTimeout(() => {
            hideLoadingSpinner();
        }, 3000); // 3000 milliseconds = 3 seconds
    }
}

function hideLoadingSpinner() {
  const loadingContainer = document.querySelector("#loadingContainer"); // Example selector
  console.log("Hiding loading spinner");
  loadingContainer.style.display = 'none';
}

  // Call the function when the page loads
  window.addEventListener('load', showLoadingSpinner);
  

        // Auto move to next input (if applicable)
        const inputs = document.querySelectorAll('input');
        inputs.forEach((input, index) => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                  //  console.log("Pressed Enter on:", input);
                    
                    // Prevent form submission if Enter is pressed
                    e.preventDefault();
        
                    // Find the next input in the NodeList
                    const nextInput = inputs[index + 1];
                    
                    if (nextInput) {
                        nextInput.focus();
                       // console.log("Focused on next input:", nextInput);
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

             // Implement your toast display logic here
             console.log(`${type.toUpperCase()}: ${message}`);

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


async function applyStylesFromSettings() {
    try {
        // Reference the document in the 'settings' collection
        const settingsDocRef = doc(db, 'settings', 'siteDesign');
        
        // Fetch the document
        const docSnap = await getDoc(settingsDocRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

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
        // Reference to the 'social_media' document in the 'settings' collection
        const socialMediaDocRef = doc(db, "settings", "social_media");
        
        // Fetch the 'social_media' document
        const socialMediaDocSnap = await getDoc(socialMediaDocRef);
        const socialIconsContainer = document.querySelector(".social-icons");

        if (socialMediaDocSnap.exists()) {
            const socialMediaData = socialMediaDocSnap.data();
            
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
                    icon = `<i class="fas fa-globe"></i> ${key.charAt(0).toUpperCase() + key.slice(1)}`;
                }

                anchor.innerHTML = icon;
                socialIconsContainer.appendChild(anchor);
            });
        } else {
            console.error("No 'social_media' document found.");
        }

        // Reference to the 'footer' document in the 'settings' collection
        const footerDocRef = doc(db, "settings", "footer");
        
        // Fetch the 'footer' document
        const footerDocSnap = await getDoc(footerDocRef);
        if (footerDocSnap.exists()) {
            const footerData = footerDocSnap.data();
            const currentYear = new Date().getFullYear();
            document.querySelector(".footer-body p").innerHTML = 
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
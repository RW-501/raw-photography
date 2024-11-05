import {  db, doc,getDoc, query, updateDoc,
  setDoc,     signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signOut,
  onAuthStateChanged, 
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

// Define and call the function to apply spinner colors
async function applyLoadingSpinnerColors(data) {
  
      // Apply colors to elements
// Set the background color of the loading container, checking for null or undefined values
const loadingContainer = document.querySelector("#loadingContainer");
if (data.backgroundColor !== null && data.backgroundColor !== undefined) {
    loadingContainer.style.backgroundColor = data.backgroundColor;
}

// Set camera icon color, checking for null or undefined values
let cameraIcon = document.querySelector(".camera-icon");
if (data.cameraBodyColor !== null && data.cameraBodyColor !== undefined) {
    cameraIcon.style.backgroundColor = data.cameraBodyColor;
}

// Set lens background color, checking for null or undefined values
const lens = document.querySelector(".lens");
if (data.lensColor !== null && data.lensColor !== undefined) {
    lens.style.backgroundColor = data.lensColor;
}

// Set lens border color, checking for null or undefined values
if (data.lensBorderColor !== null && data.lensBorderColor !== undefined) {
    lens.style.borderColor = data.lensBorderColor;
}

// Set spinner circle border top color, checking for null or undefined values
const spinnerCircle = document.querySelector(".spinner-circle");
if (data.spinnerCircleColor !== null && data.spinnerCircleColor !== undefined) {
    spinnerCircle.style.borderTopColor = data.spinnerCircleColor;
}

// Add a class to handle pseudo-elements in CSS for the shutter and flash colors
 cameraIcon = document.querySelector(".camera-icon");

// Check if the camera icon exists before adding a class
if (cameraIcon) {
    cameraIcon.classList.add("apply-spinner-colors");
}

// Set the CSS variables only if the data values are not null or undefined
if (data.shutterButtonColor !== null && data.shutterButtonColor !== undefined) {
    document.documentElement.style.setProperty("--shutter-button-color", data.shutterButtonColor);
} else {
    console.warn("Shutter button color is null or undefined, using default.");
    // Optionally, you can set a default color
    document.documentElement.style.setProperty("--shutter-button-color", "#defaultColor"); // Replace #defaultColor with your actual default color
}

if (data.flashColor !== null && data.flashColor !== undefined) {
    document.documentElement.style.setProperty("--flash-color", data.flashColor);
} else {
    console.warn("Flash color is null or undefined, using default.");
    // Optionally, you can set a default color
    document.documentElement.style.setProperty("--flash-color", "#defaultColor"); // Replace #defaultColor with your actual default color
}

 
}


  window.showLoadingSpinner = function(automatic = true) {

// Function to show the loading spinner on page load
  const loadingContainer = document.querySelector("#loadingContainer");
  //console.log("Loading Container:", loadingContainer);
    loadingContainer.style.display = 'flex';


    if (automatic.isTrusted == true || automatic == true) {
      setTimeout(() => {
            hideLoadingSpinner();
        }, 1000); // 3000 milliseconds = 3 seconds
    }
}
window.hideLoadingSpinner = function() {
  const loadingContainer = document.querySelector("#loadingContainer"); // Example selector
  loadingContainer.style.display = 'none';
}

  // Call the function when the page loads
  window.addEventListener('load', showLoadingSpinner);
  


// Function to inject styles based on site design data
function injectStyles(styles) {
  const styleElement = document.createElement('style');
  styleElement.type = 'text/css';
  styleElement.innerHTML = `
      body {
          background-color: ${styles.themeColor} !important;
          font-family: ${styles.font} !important;
      }
      #navigation-menu {
          color: ${styles.navFontColor} !important;
          background-color: ${styles.navBackgroundColor} !important;
      }
      #site-footer {
          color: ${styles.footerFontColor} !important;
          background-color: ${styles.footerBackgroundColor} !important;
      }
  `;
  document.head.appendChild(styleElement);
  console.log("Styles applied successfully!");
}

// Function to update social media links
function updateSocialLinks(socialMediaData) {
  const socialIconsContainer = document.querySelector(".social-icons");
  if (!socialIconsContainer) return;

  socialIconsContainer.innerHTML = ""; // Clear existing links

  const iconMap = {
      facebook: '<i class="fab fa-facebook"></i>',
      instagram: '<i class="fab fa-instagram"></i>',
      twitter: '<i class="fab fa-twitter"></i>',
      default: '<i class="fas fa-globe"></i>'
  };

  Object.entries(socialMediaData).forEach(([platform, url]) => {
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.target = "_blank";
      anchor.classList.add("social-link");
      anchor.innerHTML = iconMap[platform.toLowerCase()] || `${iconMap.default} ${platform}`;
      socialIconsContainer.appendChild(anchor);
  });
}

// Function to update header content
function updateHeader(headerData) {
  document.getElementById("header-title").innerText = headerData.headerTitle;
  document.getElementById("header-subtitle").innerText = headerData.headerSubtitle;
}

// Function to update navigation menu
function updateNavMenu(navItems) {
  const navMenu = document.getElementById("nav-menu");
  if (!navMenu) return;

  // Clear existing menu items
  const ul = navMenu.querySelector("ul"); // Select the <ul> within the nav
  if (ul) {
      ul.innerHTML = ''; // Clear existing items
  }

  // Create new list items based on navItems
  navItems.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `<a href="${item.link}" class="nav-link">${item.label}</a>`; // Added class for styling
      ul.appendChild(li);
  });
}

// Function to update the footer
function updateFooter(footerData) {
const currentYear = new Date().getFullYear();
const footerElement = document.querySelector(".footer-body p");

if (footerElement) {
    // Construct the footer content
    const footerContent = `${footerData.copyrightText} &copy; ${currentYear} 
    <a href="https://www.linkedin.com/in/lrpinc/" target="_blank" rel="noopener noreferrer">TeachNoob</a>`;
    
    // Append current time if showTime is true
    if (footerData.showTime) {
        const currentTime = new Date().toLocaleTimeString(); // Format to a readable time string
        footerElement.innerHTML = `${footerContent}<br>${currentTime}`;
    } else {
        footerElement.innerHTML = footerContent;
    }
}
}

// Consolidated function to fetch and apply settings with defaults
async function applySettings() {
  try {
      // Reference the 'settings' collection
      const settingsQuery = query(collection(db, "settings"));
      const settingsSnapshots = await getDocs(settingsQuery);
      
      // Default settings
      let siteDesignData = {
          themeColor: "#ffffff",
          font: "Arial, sans-serif",
          navFontColor: "#333333",
          navBackgroundColor: "#f0f0f0",
          footerFontColor: "#666666",
          footerBackgroundColor: "#e0e0e0"
      };
      
      let socialMediaData = {
          facebook: "https://facebook.com/Mr.RonWilson",
          instagram: "https://instagram.com/ron_dot.dot",
          twitter: "https://x.com/LRPinc"
      };

      let headerFooterData = {
          headerTitle: "Welcome to My Photography Site",
          headerSubtitle: "We On Beast Mode",
          navigationItems: [
              { label: "Home", link: "index" },
              { label: "Events", link: "events" },
              { label: "Portfolio", link: "portfolio" },
              { label: "Contact", link: "contact" }
          ],
          copyrightText: "My Photography Site"
      };
      let loadSpinnerData = {
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        cameraBodyColor:  "#333",
        shutterButtonColor:  "#007bff",
        flashColor:  "#999",
        lensColor:  "#222",
        lensBorderColor:  "#666",
        spinnerCircleColor:  "#007bff"
      } ;
      
      
      // Loop through fetched documents to assign data
      settingsSnapshots.forEach(docSnapshot => {
          const docData = docSnapshot.data();
    // Only proceed if docData is not null or undefined
    
      switch (docSnapshot.id) {
          case "siteDesign":
              siteDesignData = { ...siteDesignData, ...docData };
              break;
          case "social_media":
              socialMediaData = { ...socialMediaData, ...docData };
              break;
          case "header_footer":
              headerFooterData = { ...headerFooterData, ...docData };
              break;
          case "loading_spinner":
              loadSpinnerData = { ...loadSpinnerData, ...docData };
              break;
          default:
              console.warn(`Using Defeat Theme.`);
              break;
      
      }

      });
      applyLoadingSpinnerColors(loadSpinnerData) 
      injectStyles(siteDesignData);
   updateHeader(headerFooterData);
    updateNavMenu(headerFooterData.navigationItems);
    updateSocialLinks(socialMediaData);
    updateFooter(headerFooterData);
  
    } catch (error) {
      console.error("Error fetching settings:", error);
  }
}



function loadMenuToggleControls(){
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  
  // Toggle the navigation menu
  menuToggle.addEventListener("click", function () {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true" || false;
      menuToggle.setAttribute("aria-expanded", !isExpanded);
      navMenu.setAttribute("aria-hidden", isExpanded);
      menuToggle.classList.toggle("active");
      navMenu.classList.toggle("show");
  });
  
  // Close menu when clicking outside
  document.addEventListener("click", function (e) {
      if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
          menuToggle.setAttribute("aria-expanded", "false");
          navMenu.setAttribute("aria-hidden", "true");
          menuToggle.classList.remove("active");
          navMenu.classList.remove("show");
      }
  });
  
 
  
  // Ensure escape key closes the menu for accessibility
  document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navMenu.classList.contains("show")) {
          menuToggle.setAttribute("aria-expanded", "false");
          navMenu.setAttribute("aria-hidden", "true");
          menuToggle.classList.remove("active");
          navMenu.classList.remove("show");
      }
  });
  
}
  
    

      window.checkUrl = (function(keyword) {

        // Get the current URL
        const currentUrl = window.location.href;
        console.log("currentUrl   ",currentUrl);
      
        // Check if the URL contains 
        if (currentUrl.includes(keyword)) {
            return true; // The URL contains either 
            }
        return false; // Neither keyword is found
      });
      

        
      document.addEventListener("DOMContentLoaded", () => {
        if (!window.checkUrl("/admin/")) {
        // Apply fetched or default settings
        // Call the function to apply settings
applyLoadingSpinnerColors();
applySettings();
loadMenuToggleControls();
console.log("User View");

    }else{
      console.log("Admin View");
    } 
    });












        // Sanitize user input to escape HTML characters
        window.sanitizeInput = function(input) {
          const div = document.createElement('div');
          div.appendChild(document.createTextNode(input));
          return div.innerHTML;
      }
      
      // Function to check if input contains potential script injection characters
        window.isSafeInput = function(input) {
          const dangerousPatterns = /(<|>|"|;|&|\$|\(|\)|\*|\\|\/|script|SELECT|UPDATE|DELETE|INSERT|DROP|TABLE|ALTER)/i;
          return !dangerousPatterns.test(input);
      }
      
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
//function showToast(message, type = 'info', duration = 3000) {
  window.showToast = function(message, type = 'info', duration = 3000) {

    // Create a div for the toast
    const toast = document.createElement('div');
    
    toast.setAttribute('role', 'alert'); // Accessibility

    // Add styles to the toast
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = '15px 20px';
    toast.style.margin = '10px';
    toast.style.borderRadius = '5px';
    toast.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    toast.style.color = '#fff';
    toast.style.zIndex = '9999999999999999';
    toast.style.transition = 'opacity 0.5s ease-in-out';
    toast.style.opacity = '1';

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

    toast.className = `toast toast-${type}  noCopy`; // Add classes for styling
    toast.innerText = message; // Set the message text

    // Append the toast to the body
    document.body.appendChild(toast);

    // Set a timer to remove the toast after the specified duration
    setTimeout(() => {
      toast.style.opacity = '0'; // Start fade-out
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




window.userLocationService = (function() {
  const ipAPI = 'https://api.ipify.org?format=json';
  const locationAPI = 'https://ipapi.co';

  // Fetch the user's IP address
  const getUserIP = async () => {
      try {
          const response = await fetch(ipAPI);
          const data = await response.json();
          return data.ip;
      } catch (error) {
          console.error('Error fetching IP address:', error);
          return null;
      }
  };

  // Fetch the user's location based on IP address
  const getUserLocationByIP = async (ip) => {
      try {
          const response = await fetch(`${locationAPI}/${ip}/json/`);
          const data = await response.json();
          return {
              city: data.city || 'N/A',
              state: data.region || 'N/A',
              zip: data.postal || 'N/A',
              country: data.country_name || 'N/A'
          };
      } catch (error) {
          console.error('Error fetching location by IP:', error);
          return null;
      }
  };

  // Main function to get IP and location together
  const getUserIPAndLocation = async () => {
      try {
          let ip = sessionStorage.getItem('userIP');
          let location = JSON.parse(sessionStorage.getItem('userLocation'));

          // If IP or location are not cached, fetch them
          if (!ip || !location) {
              ip = await getUserIP();
              location = await getUserLocationByIP(ip);

              // Cache in session storage for the current session
              if (ip && location) {
                  sessionStorage.setItem('userIP', ip);
                  sessionStorage.setItem('userLocation', JSON.stringify(location));
              }
          }

          return { ip, location };
      } catch (error) {
          console.error('Error retrieving user IP and location:', error);
          return null;
      }
  };

  // Expose only the main function
  return {
      getUserIPAndLocation
  };
})();

function formatCurrency(value, options = {}) {  
  const { locale = "en-US", currency = "USD", decimals = 0 } = options;

  // Convert to string if value is a number
  let cleanValue = typeof value === "number" ? value.toString() : String(value);

  // Remove any non-numeric characters except dots and commas
  cleanValue = cleanValue.replace(/[^0-9.,-]/g, "");

  // Remove commas and convert to number
  cleanValue = cleanValue.replace(/,/g, "");
  let number = parseFloat(cleanValue);

  // Handle invalid numbers
  if (isNaN(number)) {
      return "$0.00"; // Return default if value is invalid
  }

  // Manually format the number as currency (with commas)
  let formattedNumber = number
      .toFixed(decimals)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return `$${formattedNumber}`;
}

window.updateCurrency = function(input) {
  // Format the current input value
  const formattedValue = formatCurrency(input.value, { decimals: 0 });
  // Update the input value with formatted currency or "Negotiable"
  input.value = formattedValue;

  // If using type="text", you can uncomment the line below
  // const position = formattedValue.length; // Cursor position at the end
  // input.setSelectionRange(position, position);
};

window.restrictKeys = function(event) {
  const allowedKeys = [
      "Backspace",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
      "Enter",
      "Escape"
  ];
  if (!/[0-9]/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
  }
};



window.truncateText = (function(text, maxLength, href) {
  return text.length > maxLength 
      ? text.substring(0, maxLength) + `... <a href="${href}">See More</a>` 
      : text;
});


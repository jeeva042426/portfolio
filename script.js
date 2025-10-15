/* global emailjs:true */ 
'use strict'; 

// ----------------------------------------------------------------------
// 1. TAB LOGIC
// ----------------------------------------------------------------------

const tablinks = document.getElementsByClassName("tab-links");
const tabcontents = document.getElementsByClassName("tab-contents");

function opentab(tabname, e) {
    // Safely get the event target for tab switching
    const currentTarget = e ? e.currentTarget : (window.event ? window.event.currentTarget : null);

    if (!currentTarget) return; 

    for (let tablink of tablinks) { 
        tablink.classList.remove("active-links");
    }
    for (let tabcontent of tabcontents) {
        tabcontent.classList.remove("active-table");
    }
    
    currentTarget.classList.add("active-links"); 
    document.getElementById(tabname).classList.add("active-table");
}

// Expose function to global scope so HTML onclick can call it
window.opentab = opentab;


// ----------------------------------------------------------------------
// 2. EMAILJS INTEGRATION CODE
// ----------------------------------------------------------------------

// CONFIGURATION VARIABLES (Your specific IDs)
const PUBLIC_KEY = 'QA9F8BgB77f7qzd1e'; 
const SERVICE_ID = 'service_bxzwy0j'; 
const TEMPLATE_ID = 'template_j9veom8'; 
const FORM_ID = 'contact-form'; // Must match the ID in index.html

// Check if EmailJS is available and initialize
if (typeof emailjs !== 'undefined') {
    emailjs.init({
        publicKey: PUBLIC_KEY,
        limitRate: {
            throttle: 10000, 
        }
    });

    // Get the form elements
    const form = document.getElementById(FORM_ID); 
    const status = document.getElementById('formStatus');

    if (form) { 
        form.addEventListener('submit', function(e) {
            e.preventDefault(); 

            status.textContent = "Sending message..."; 
            status.style.color = "#FFC107"; // Yellow for processing

            const submitButton = form.querySelector('.btn');
            submitButton.disabled = true; // Disable button to prevent spam

            // Call emailjs.sendForm using the defined constant IDs
            emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, this)
                .then(function() {
                    // SUCCESS BLOCK 
                    alert("Thank You! Your message was sent successfully. I'll get back to you soon.");
                    
                    status.textContent = "✅ Message sent successfully! I'll be in touch soon.";
                    status.style.color = "#4CAF50"; // Green for success
                    form.reset(); 
                    submitButton.disabled = false; 
                    console.log('Email Sent Successfully!');
                }, function(error) {
                    // FAILURE BLOCK 
                    alert("⚠️ Submission Failed! Check the console (F12) for the exact error code.");

                    status.textContent = "❌ Failed to send message. Please check console for details.";
                    status.style.color = "#E53935"; // Red for failure
                    submitButton.disabled = false; 
                    console.error('Email Sending FAILED...', error); 
                });
        });
    } else {
        console.error(`Error: Contact form with ID '${FORM_ID}' not found in HTML.`);
    }
} else {
    console.error("Fatal Error: EmailJS SDK is not loaded. Check the script link in your HTML!");
}

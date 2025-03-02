// Open Modal for Login/Signup - NO LONGER NEEDED HERE
// Close Modal - NO LONGER NEEDED HERE
// Switch to Signup Form - NO LONGER NEEDED HERE
// Switch to Login Form - NO LONGER NEEDED HERE

// Function to handle user logout - Keep this, but it's used by script.js now
function handleLogout() {
    fetch('api/logout.php')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = 'index.html';
        } else {
            console.error('Logout failed:', data.error);
            // Optionally display an error message to the user
        }
    })
    .catch(error => {
        console.error('Network error during logout:', error);
        // Optionally display an error message to the user
    });
}


//--------------- Certificate Generation Logic---------------//

let form = document.querySelector("#certificateForm"); // Get the form element
let displayCertificateDiv = document.querySelector(".displayCertificateDiv");
let certificateBackground = document.querySelector("#certificateBackground");
let certificateName = document.querySelector("#certificateName");
let certificateDate = document.querySelector("#certificateDate");
let certificateSignature = document.querySelector("#certificateSignature");
let certificateDetails = document.querySelector("#certificateDetails");

function handleCertificateCreation(e) {
    e.preventDefault();
    displayCertificateDiv.classList.add('hidden'); // Hide initially
    displayCertificateDiv.classList.remove('visible');


    // Get values from the form.
    let inputName = document.getElementById("inputName").value;
    let inputDate = document.getElementById("inputDate").value;
    let inputSignature = document.getElementById("inputSignature").value;
    let inputDetails = document.getElementById("inputDetails").value;
    let selectedTemplateId = document.getElementById("selectedTemplateId").value;
    let certificateFormError = document.getElementById("certificateFormError");

    // Basic client-side validation
    if (!inputName || !inputDate || !inputSignature || !inputDetails) {
        certificateFormError.textContent = "Please fill in all fields.";
        return;
    }
     certificateFormError.textContent = "";

    const formData = new FormData();
    formData.append("name", inputName);
    formData.append("date", inputDate);
    formData.append("signature", inputSignature);
    formData.append("details", inputDetails);
    formData.append("template_id", selectedTemplateId);

    // For local testing without server, just display certificate
    displayCertificate();
    
    // If you have a working API endpoint, uncomment this:
    
    fetch("api/submit_certificate.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayCertificate(); // Show the certificate preview
            form.reset(); // Clear the form
        } else {
            certificateFormError.textContent = data.error;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        certificateFormError.textContent = "An error occurred. Please try again.";
    });
    
}

// Attach to the FORM's submit event
form.addEventListener("submit", handleCertificateCreation);

// Download logic
const downloadButton = document.querySelector("#downloadButton");

function handleDownload() {
    const certificate = document.querySelector(".generatedCertificate");
    const fileFormat = document.querySelector("#fileFormat").value;

    if (fileFormat === "jpg") {
        html2canvas(certificate, {
            scale: 2,
            useCORS: true
        }).then((canvas) => {
            const link = document.createElement("a");
            link.download = "certificate.jpg";
            link.href = canvas.toDataURL("image/jpeg");
            link.click();
        });
    } else if (fileFormat === "pdf") {
        html2canvas(certificate, {
            scale: 1.5,
            useCORS: true
        }).then((canvas) => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const a4Width = 210;
            const a4Height = 297;
            const aspectRatio = canvasWidth / canvasHeight;
            let newWidth = a4Width;
            let newHeight = newWidth / aspectRatio;

            if (newHeight > a4Height) {
                newHeight = a4Height;
                newWidth = newHeight * aspectRatio;
            }

            const marginX = (a4Width - newWidth) / 2;
            const marginY = (a4Height - newHeight) / 2;
            const imgData = canvas.toDataURL('image/jpeg', 0.7);
            pdf.addImage(imgData, 'JPEG', marginX, marginY, newWidth, newHeight);
            pdf.save('certificate.pdf');
        });
    }
}

// Add the event listener to the download button.
downloadButton.addEventListener("click", handleDownload);

// Accessing template selected by user - add to DOMContentLoaded, below.
let currentlyEditingCertificateId = null; // Global variable

const certificate = document.querySelector(".generatedCertificate");
function adjustFontSizes() {
    // Check if certificate element exists
    if (!certificate) {
        return;
    }
    const certificateWidth = certificate.offsetWidth;
    // Scale font sizes based on certificate width
    if(document.querySelector("#certificateName")){
        document.querySelector("#certificateName").style.fontSize = `${certificateWidth * 0.05}px`;
    }
     if(document.querySelector("#certificateDate")){
        document.querySelector("#certificateDate").style.fontSize = `${certificateWidth * 0.015}px`;
    }
     if(document.querySelector("#certificateSignature")){
       document.querySelector("#certificateSignature").style.fontSize = `${certificateWidth * 0.025}px`;
    }
     if(document.querySelector("#certificateDetails")){
        document.querySelector("#certificateDetails").style.fontSize = `${certificateWidth * 0.02}px`;
    }
}

window.addEventListener("resize", adjustFontSizes);

// Function to display certificate with improved rendering
function displayCertificate() {
    // Get the selected template ID
    const selectedTemplateId = document.getElementById('selectedTemplateId').value;

    // Show certificate container first to ensure elements are in the DOM
    displayCertificateDiv.classList.remove('hidden');
    displayCertificateDiv.classList.add('visible');

    // Get values directly from input fields
    if (certificateName) {
      certificateName.textContent = document.getElementById("inputName").value;
    }
    if (certificateDate) {
        certificateDate.textContent = document.getElementById("inputDate").value;
    }
    if (certificateSignature) {
       certificateSignature.textContent = document.getElementById("inputSignature").value;
    }
    if (certificateDetails) {
        certificateDetails.textContent = document.getElementById("inputDetails").value;
    }

    // Fetch the template image URL based on the selected template ID
    fetch(`api/get_template.php?id=${selectedTemplateId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Set the background image
                if (certificateBackground) {
                     certificateBackground.setAttribute("style", `background-image: url('${data.data.template_image}');`);
                }
            } else {
                console.error('Error fetching template:', data.error);
                // Handle error - maybe set a default background
                if (certificateBackground) {
                    certificateBackground.setAttribute("style", "background-image: url('assets/templates/template1.jpg');");
                }
            }
            
            // Use setTimeout to ensure DOM has updated before adjusting font sizes
            setTimeout(() => {
                adjustFontSizes();
            }, 50);
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle network errors
            if (certificateBackground) {
                certificateBackground.setAttribute("style", "background-image: url('assets/templates/template1.jpg');");
            }
            
            // Still adjust font sizes even if there's an error
            setTimeout(() => {
                adjustFontSizes();
            }, 50);
        });
    
    console.log("Display certificate function called:");
    console.log("Name:", document.getElementById("inputName").value);
    console.log("Date:", document.getElementById("inputDate").value);
    console.log("Signature:", document.getElementById("inputSignature").value);
    console.log("Details:", document.getElementById("inputDetails").value);
}


function editCertificate(certificateId) {
    // Fetch the certificate data by ID
    fetch(`api/get_certificate.php?id=${certificateId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const cert = data.data;
                // Populate the form fields with the certificate data
                document.getElementById('inputName').value = cert.certificate_name;
                document.getElementById('inputDate').value = cert.issue_date;
                document.getElementById('inputSignature').value = cert.signature;
                document.getElementById('inputDetails').value = cert.details;
                document.getElementById('selectedTemplateId').value = cert.template_id;

                // Store the certificate ID for later update
                currentlyEditingCertificateId = certificateId;

                // Change the "Create" button to "Update"
                document.getElementById('createButton').textContent = 'Update Certificate';

                 // Scroll to the form
                scrollToSection('#Templates'); // Use the smooth scrolling function

                // Optionally, change form action (if you have a separate update API)
                // document.getElementById('certificateForm').action = 'api/update_certificate.php';
                const createButton =  document.getElementById('createButton');
                createButton.removeEventListener('click', displayCertificate);  //THIS IS VERY IMPORTANT
                // Add a one-time event listener for the update
                createButton.onclick = function(event) { // Use onclick for one-time
                    event.preventDefault(); // Prevent form submission
                    updateCertificate(); // Call the update function
                };

            } else {
                alert(`Error: ${data.error}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while fetching the certificate.');
        });
}


function updateCertificate() {
  const certificateFormError = document.getElementById("certificateFormError"); //get error message element
    if (!currentlyEditingCertificateId) {
        console.error("No certificate selected for editing.");
        return;
    }
		 // Basic client-side validation
    let inputName = document.getElementById("inputName").value;
    let inputDate = document.getElementById("inputDate").value;
    let inputSignature = document.getElementById("inputSignature").value;
    let inputDetails = document.getElementById("inputDetails").value;
    let selectedTemplateId = document.getElementById("selectedTemplateId").value;
    if (!inputName || !inputDate || !inputSignature || !inputDetails) {
        certificateFormError.textContent = "Please fill in all fields.";
        return; // Stop the function if validation fails
    }
     certificateFormError.textContent = "";
    // Create a FormData object
    const formData = new FormData();
    formData.append("certificate_id", currentlyEditingCertificateId);
    formData.append("name", inputName);
    formData.append("date", inputDate);
    formData.append("signature", inputSignature);
    formData.append("details", inputDetails);
    formData.append("template_id", selectedTemplateId);

    fetch('api/update_certificate.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            // Change the "Update" button back to "Create"
            document.getElementById('createButton').textContent = 'Create Certificate';
            document.getElementById('createButton').onclick = null; // Remove one-time handler
            form.addEventListener("submit", handleCertificateCreation); // Re-bind to create
            currentlyEditingCertificateId = null; // Reset editing state
            form.reset();
            // Show create form and templates
            document.getElementById('createMain').classList.remove('hidden');
            document.getElementById('Templates').classList.remove('hidden');
        } else {
            certificateFormError.textContent = data.error;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        certificateFormError.textContent = "An error occurred. Please try again.";
    });
}

//Smooth Scrolling
function scrollToSection(sectionId) {
    const section = document.querySelector(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}
// Add a function to check login status
function checkLoginStatus() {
  fetch('api/check_login.php')
    .then(response => response.json())
    .then(data => {
      if (data.loggedIn) {
        showUserProfile(data.userName); // Pass the username to showUserProfile
      } else {
        // Show the login and signup buttons, hide user profile
         const loginBtn = document.getElementById('loginBtn');
         const signupBtn = document.getElementById('signupBtn');
         if(loginBtn) loginBtn.style.display = 'inline-block';
         if(signupBtn) signupBtn.style.display = 'inline-block';
         document.getElementById('userProfile').classList.add('hidden');
      }
    })
    .catch(error => console.error('Error checking login status:', error));
}
// Function to show the user profile and hide login/signup
function showUserProfile(userName) {
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const userProfile = document.getElementById('userProfile');

    if (loginBtn) loginBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';
    if (userProfile) userProfile.classList.remove('hidden');

  const usernameDisplay = document.getElementById('usernameDisplay');
  if (usernameDisplay) {
    usernameDisplay.textContent = userName || "User"; // handle null/undefined
  }
}
document.addEventListener('DOMContentLoaded', function() {

	 // Add event listener for dashboard link (if it exists)
    const dashboardLink = document.getElementById('dashboardLink');
    if (dashboardLink) {
        dashboardLink.addEventListener('click', function(event) {
            event.preventDefault();
              window.location.href = 'dashboard.html'; // GO TO DASHBOARD
        });
    }
      // Add event listener for logout link
     const logoutBtn = document.getElementById('logoutBtn');
        if(logoutBtn){
            logoutBtn.addEventListener('click', (event) =>{
                event.preventDefault();
                handleLogout();
            });
        }
    // Fetch and display templates (for the template selection)
    fetch('api/get_templates.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const templatesContainer = document.querySelector('.Templates_Container');
                templatesContainer.innerHTML = ''; // Clear existing templates

                data.data.forEach(template => {
                    const img = document.createElement('img');
                    img.src = template.thumbnail_image; // Use thumbnail here
                    img.alt = template.template_name;
                    img.classList.add('certificate-template');
                    img.dataset.templateId = template.template_id; // Set data-template-id
                    templatesContainer.appendChild(img);

                     // Add click listener to set the selected template
                    img.addEventListener('click', function() {
                        // Remove 'selected' from all
                        document.querySelectorAll('.certificate-template').forEach(el => {
                            el.classList.remove('selected');
                        });
                        // Add 'selected' to the clicked one
                        this.classList.add('selected');
                        document.getElementById('selectedTemplateId').value = this.dataset.templateId;
                    });
                });
            } else {
                console.error('Error fetching templates:', data.error);
            }
        })
        .catch(error => console.error('Error:', error));

    displayCertificateDiv.classList.add('hidden'); // Hide initially
    //Initially hide heading and download option
    displayCertificateDiv.classList.remove('visible');

    // Check for 'edit' query parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const editCertificateId = urlParams.get('edit');
    if (editCertificateId) {
        editCertificate(editCertificateId); // Call edit function
    }
    checkLoginStatus();
});
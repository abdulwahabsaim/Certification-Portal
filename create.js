// Open Modal for Login/Signup
function openAuthModal(type) {
    document.getElementById('authModal').style.display = 'block';
    if(type === 'login'){
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('signupForm').classList.add('hidden');
        document.getElementById('modalTitle').textContent = 'Login';
    }
    else{
         document.getElementById('signupForm').classList.remove('hidden');
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('modalTitle').textContent = 'Signup';
    }
}

// Close Modal
function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
    document.getElementById('loginError').textContent = ''; // Clear error messages
    document.getElementById('signupError').textContent = '';
}

// Switch to Signup Form
function switchToSignup() {
    openAuthModal('signup');
}

// Switch to Login Form
function switchToLogin() {
    openAuthModal('login');
}
// Function to handle user logout
function handleLogout() {
    // Send a request to the logout API
    fetch('api/logout.php')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Redirect to the home page
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

// Show User Profile/Dashboard and Hide Login/Signup
function showUserProfile(userName) { // Accept userName as argument
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('signupBtn').style.display = 'none';
     if (document.getElementById('loginBtnHero')) { // Check if element exists
        document.getElementById('loginBtnHero').style.display = 'none';
        document.getElementById('signupBtnHero').style.display = 'none';
    }

    document.getElementById('userProfile').classList.remove('hidden');
    document.getElementById('usernameDisplay').textContent = userName || "User"; // Use provided name

    if(document.getElementById('createNowBtn')){
        document.getElementById('createNowBtn').classList.remove('hidden');
    }
    displayUserCertificates(); // Call this function to display on dashboard.
}
// Function to check login status on page load
function checkLoginStatus() {
    fetch('api/check_login.php') // Check login status via API
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                showUserProfile(data.userName); // Pass username to showUserProfile
            } else {
                // Show login/signup buttons if not logged in
                document.getElementById('loginBtn').style.display = 'inline-block';
                document.getElementById('signupBtn').style.display = 'inline-block';
                  if (document.getElementById('loginBtnHero')) {
                    document.getElementById('loginBtnHero').style.display = 'inline-block';
                    document.getElementById('signupBtnHero').style.display = 'inline-block';
                }
            }
        })
        .catch(error => console.error('Error checking login status:', error));
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const loginErrorDiv = document.getElementById('loginError');

    fetch('api/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            closeAuthModal();
            // Instead of setting localStorage, check login status again
            checkLoginStatus(); // This will update the UI based on session
            if (window.location.pathname.endsWith('index.html')) {
                 window.location.href = 'create.html'; // Redirect to create.html
            }

        } else {
            // Show error message
           loginErrorDiv.textContent = data.error;
        }
    })
    .catch(error => {
        console.error('Error:', error);
       loginErrorDiv.textContent = 'An error occurred. Please try again.';
    });
}


// Handle Signup
function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const signupErrorDiv = document.getElementById('signupError');

    fetch('api/register.php', { // Use a separate register.php file
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            closeAuthModal();
            // Instead of setting localStorage, check login status
            checkLoginStatus();
            if (window.location.pathname.endsWith('index.html')) {
                window.location.href = 'create.html'; // Redirect to create.html
            }

        } else {
            // Show error message
            signupErrorDiv.textContent = data.error;

        }
    })
    .catch(error => {
        console.error('Error:', error);
         signupErrorDiv.textContent = 'An error occurred. Please try again.';
    });
}

//--------------- Certificate Generation Logic---------------//

let form = document.querySelector("#certificateForm"); // Get the form element
let displayCertificateDiv = document.querySelector(".displayCertificateDiv");
let certificateBackground = document.querySelector("#certificateBackground"); //Keep
let certificateName = document.querySelector("#certificateName"); // Keep
let certificateDate = document.querySelector("#certificateDate");   // Keep
let certificateSignature = document.querySelector("#certificateSignature");  // Keep
let certificateDetails = document.querySelector("#certificateDetails");  // Keep

function handleCertificateCreation(e) {
    e.preventDefault();
     displayCertificateDiv.classList.add('hidden'); // Hide initially
     displayCertificateDiv.classList.remove('visible');

    // Get values from the form.  Using getElementById is more robust.
    let inputName = document.getElementById("inputName").value;
    let inputDate = document.getElementById("inputDate").value;
    let inputSignature = document.getElementById("inputSignature").value;
    let inputDetails = document.getElementById("inputDetails").value;
    let selectedTemplateId = document.getElementById("selectedTemplateId").value;
    let certificateFormError = document.getElementById("certificateFormError"); // Get error element


    // Basic client-side validation
    if (!inputName || !inputDate || !inputSignature || !inputDetails) {
        certificateFormError.textContent = "Please fill in all fields.";
        return; // Stop if validation fails
    }
     certificateFormError.textContent = ""; // Clear previous errors

    // Create a FormData object
    const formData = new FormData();
    formData.append("name", inputName);
    formData.append("date", inputDate);
    formData.append("signature", inputSignature);
    formData.append("details", inputDetails);
    formData.append("template_id", selectedTemplateId);


    fetch("api/submit_certificate.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayCertificate(); // Show the certificate
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

function handleDownload() { // Correct
    const certificate = document.querySelector(".generatedCertificate");
    const fileFormat = document.querySelector("#fileFormat").value; // Get selected format

    if (fileFormat === "jpg") {
        // Image Download Logic (JPG)
        html2canvas(certificate, {
            scale: 2, // Improves resolution
            useCORS: true // Handles cross-origin images
        }).then((canvas) => {
            const link = document.createElement("a");
            link.download = "certificate.jpg"; // File name
            link.href = canvas.toDataURL("image/jpeg"); // Convert canvas to JPG image
            link.click(); // Trigger the download
        });
    } else if (fileFormat === "pdf") {
        // PDF Download Logic
        html2canvas(certificate, {
            scale: 1.5, // Reducing scale to 1.5 to reduce the resolution
            useCORS: true // Handles cross-origin images
        }).then((canvas) => {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4'); // Create a PDF instance

            // Get the dimensions of the canvas
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;

            // A4 size in mm (portrait)
            const a4Width = 210;
            const a4Height = 297;

            // Calculate the aspect ratio of the canvas
            const aspectRatio = canvasWidth / canvasHeight;

            // Calculate the new width and height to maintain the aspect ratio
            let newWidth = a4Width;
            let newHeight = newWidth / aspectRatio;

            // If the new height exceeds the A4 page height, adjust the width accordingly
            if (newHeight > a4Height) {
                newHeight = a4Height;
                newWidth = newHeight * aspectRatio;
            }

            // Center the image on the page
            const marginX = (a4Width - newWidth) / 2;
            const marginY = (a4Height - newHeight) / 2;

            // Convert the canvas to image data URL and add it to the PDF
            const imgData = canvas.toDataURL('image/jpeg', 0.7); // Compressing to JPEG with 70% quality
            pdf.addImage(imgData, 'JPEG', marginX, marginY, newWidth, newHeight);

            // Save the PDF
            pdf.save('certificate.pdf');
        });
    }
}
// Add the event listener to the download button
downloadButton.addEventListener("click", handleDownload);

// Accessing template selected by user - KEEP, but add to DOMContentLoaded
//let certificateBackgroundSrc = "assets/Certificate Template 1.jpg"; // NO DEFAULT

const certificate = document.querySelector(".generatedCertificate");
function adjustFontSizes() {
    // Check if certificate element exists to avoid errors
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
// displayCertificateDiv.classList.remove('hidden'); - MOVED to handleCertificateCreation
function displayCertificate() {
    // Get the selected template ID
    const selectedTemplateId = document.getElementById('selectedTemplateId').value;
     // Fetch the template image URL based on the selected template ID
    fetch(`api/get_template.php?id=${selectedTemplateId}`) // New API endpoint
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Set the background image
            if (certificateBackground) {
                 certificateBackground.setAttribute("style", `background-image: url('${data.data.template_image}');`); // Use template_image
            }
        }
         else {
            console.error('Error fetching template:', data.error);
            // Handle the case where the template image couldn't be fetched, maybe set a default
        }

    })
    .catch(error => {
        console.error('Error:', error);
         // Handle network errors, maybe set a default
    });

     // Get values directly, no need for intermediate variables
    if (certificateName) {
        certificateName.textContent = document.getElementById("inputName").value; // Use .value here
    }
    if (certificateDate) {
        certificateDate.textContent =  document.getElementById("inputDate").value;
    }
    if (certificateSignature) {
        certificateSignature.textContent =  document.getElementById("inputSignature").value;
    }
    if (certificateDetails) {
        certificateDetails.textContent =  document.getElementById("inputDetails").value;
    }
    adjustFontSizes(); // Adjust font sizes AFTER updating content
    displayCertificateDiv.classList.remove('hidden');
     displayCertificateDiv.classList.add('visible'); // Show the section and elements
}

// Function to show the dashboard
function showDashboard() {
   // Hide other sections (e.g., certificate creation form)
    document.getElementById('createMain').classList.add('hidden');
    document.getElementById('Templates').classList.add('hidden'); // Hide templates
     // Show the dashboard section
    const dashboardSection = document.getElementById('dashboardSection');
        dashboardSection.classList.remove('hidden');
    displayUserCertificates(); // Display the user's certificates
}

// Function to display a single certificate (used in the dashboard)
function displaySingleCertificate(cert) {
    const certDiv = document.createElement('div');
    certDiv.classList.add('certificate-item');

    // Create the certificate preview container
    const certPreview = document.createElement('div');
    certPreview.classList.add('generatedCertificate'); // Use existing class
    certPreview.style.backgroundImage = `url('${cert.template_image}')`;
    certPreview.style.backgroundSize = 'contain'; // Use 'contain'
    certPreview.style.backgroundPosition = 'center';
    certPreview.style.backgroundRepeat = 'no-repeat'; // Add this
    certPreview.style.width = '100%'; // Use 100% width
    certPreview.style.height = '300px'; // Set a reasonable fixed height.  Adjust as needed.
    certPreview.style.position = 'relative'; // For absolute positioning inside
    certPreview.style.borderRadius = 'var(--border-radius)';

     // Create elements for the certificate content *within* the preview div
    const certName = document.createElement('h2');
    certName.textContent = cert.certificate_name;
    certName.style.position = 'absolute';
    certName.style.top = '43%'; // Example - Adjust!
    certName.style.left = '50%';
    certName.style.transform = 'translate(-50%, -50%)';
    certName.style.whiteSpace = 'nowrap';
    certName.style.textAlign = 'center';
    certName.style.color = '#05294a';
    certName.style.fontSize = '1.5rem'; //  fixed size


    const certDate = document.createElement('p');
    certDate.textContent = cert.issue_date;
    certDate.style.position = 'absolute';
    certDate.style.bottom = '24%';
    certDate.style.left = '46%';
    certDate.style.transform = 'translate(-50%, -50%)';
    certDate.style.color = '#05294a';
    certDate.style.fontSize = '0.8rem'; //  fixed size.

    const certSignature = document.createElement('p');
    certSignature.textContent = cert.signature;
    certSignature.style.position = 'absolute';
    certSignature.style.bottom = '23%';
    certSignature.style.right = '46%';
    certSignature.style.transform = 'translate(50%, -50%)';
    certSignature.style.color = '#05294a';
    certSignature.style.fontSize = '0.8rem'; //  fixed size

    const certDetails = document.createElement('p');
    certDetails.textContent = cert.details;
    certDetails.style.position = 'absolute';
    certDetails.style.top = '55%';
    certDetails.style.left = '50%';
    certDetails.style.transform = 'translate(-50%, -50%)';
    certDetails.style.width = '60%';
    certDetails.style.textAlign = 'center'
    certDetails.style.color = '#05294a';
    certDetails.style.fontSize = '0.9rem'; // fixed size
    certDetails.style.lineHeight = '1.5';


    // Add the elements to the preview container
    certPreview.appendChild(certName);
    certPreview.appendChild(certDate);
    certPreview.appendChild(certSignature);
    certPreview.appendChild(certDetails);

    // Add the preview container to the certificate div
    certDiv.appendChild(certPreview);

     // Add Edit and Delete buttons
    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('certificate-actions');


    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit-button'); // Add class for styling
    editButton.addEventListener('click', () => editCertificate(cert.certificate_id));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button'); //Add class for styling
    deleteButton.addEventListener('click', () => deleteCertificate(cert.certificate_id));

    actionsDiv.appendChild(editButton);
    actionsDiv.appendChild(deleteButton);
    certDiv.appendChild(actionsDiv);

    return certDiv; // Return the created element
}

// Function to handle displaying user's certificates (Dashboard)
function displayUserCertificates() {
    const dashboardSection = document.getElementById('dashboardSection');
    if (dashboardSection) {
        dashboardSection.classList.remove('hidden');
    }
    else{
        return; // If no dashboard section, exit
    }
     const container = document.getElementById('userCertificates');
      container.innerHTML = ''; // Clear previous certificates

    fetch('api/get_certificates.php')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (data.data.length === 0) {
                container.innerHTML = '<p>No certificates found.</p>';
                return;
            }

            data.data.forEach(cert => { // Iterate over certificates
              fetch(`api/get_certificate.php?id=${cert.certificate_id}`) //get one by one all certificates
              .then(response => response.json())
              .then(certificateData => { //use data of each certificate to display on dashboard
                if (certificateData.success) {
                    const certElement = displaySingleCertificate(certificateData.data); // create html element and set data
                    container.appendChild(certElement); // Append to the container
                }
                else{
                     console.error('Error fetching certificate:', certificateData.error);
                }
              })
               .catch(error => {
                    console.error('Error:', error);
                });
            });

        } else {
            console.error('Error fetching certificates:', data.error);
            container.innerHTML = `<p>Error: ${data.error}</p>`; // Show error
        }
    })
    .catch(error => {
        console.error('Network error fetching certificates:', error);
        container.innerHTML = '<p>Error: Failed to load certificates.</p>';
    });
}

function deleteCertificate(certificateId) {
    if (confirm('Are you sure you want to delete this certificate?')) {
        fetch('api/delete_certificate.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Use form encoding
            },
             body: `id=${certificateId}` // Send as form data

        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Refresh the certificate list
                displayUserCertificates();
            } else {
                alert(`Error: ${data.error}`); // Show a user-friendly error
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the certificate.');
        });
    }
}
let currentlyEditingCertificateId = null; // Global variable to store editing ID
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
    const certificateFormError = document.getElementById("certificateFormError");
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
     certificateFormError.textContent = ""; // Clear previous errors

    // Create a FormData object
    const formData = new FormData();
    formData.append("certificate_id", currentlyEditingCertificateId); // Include certificate ID
    formData.append("name", inputName);
    formData.append("date", inputDate);
    formData.append("signature", inputSignature);
    formData.append("details", inputDetails);
    formData.append("template_id", selectedTemplateId);

    fetch('api/update_certificate.php', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            displayUserCertificates(); // Refresh the certificate list
            form.reset();
             // Change the "Update" button back to "Create"
            document.getElementById('createButton').textContent = 'Create Certificate';
            document.getElementById('createButton').onclick = null;
            createButton.addEventListener("click", displayCertificate); // Re-bind for create. VERY IMPORTANT
            currentlyEditingCertificateId = null; // Reset editing ID

        } else {
           certificateFormError.textContent = data.error;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        certificateFormError.textContent = 'An error occurred. Please try again.';
    });
}

// Function to show the dashboard
function showDashboard() {
   // Hide other sections (e.g., certificate creation form)
    document.getElementById('createMain').classList.add('hidden');
    document.getElementById('Templates').classList.add('hidden'); // Hide templates
     // Show the dashboard section
    const dashboardSection = document.getElementById('dashboardSection');
        dashboardSection.classList.remove('hidden');
    displayUserCertificates(); // Display the user's certificates
}
//Smooth Scrolling
function scrollToSection(sectionId) {
    const section = document.querySelector(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus(); // Check login on page load

    // Add event listener for dashboard link (if it exists)
    const dashboardLink = document.getElementById('dashboardLink');
    if (dashboardLink) {
        dashboardLink.addEventListener('click', function(event) {
            event.preventDefault();
            showDashboard(); // Show the dashboard
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
                    img.src = template.thumbnail_image;
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
});
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
    certPreview.style.borderRadius = 'var(--border-radius)'; //Consistent

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
    certDate.style.left = '30.5%';
    certDate.style.transform = 'translate(-50%, -50%)';
    certDate.style.color = '#05294a';
    certDate.style.fontSize = '0.8rem'; //  fixed size.

    const certSignature = document.createElement('p');
    certSignature.textContent = cert.signature;
    certSignature.style.position = 'absolute';
    certSignature.style.bottom = '23%';
    certSignature.style.right = '30.5%';
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

// Use a flag to track if certificates are currently being loaded
let isLoadingCertificates = false;

// Function to handle displaying user's certificates (Dashboard)
function displayUserCertificates(sortBy = 'issue_date', sortOrder = 'desc', filterBy = '', filterValue = '', limit = 10, offset = 0) {
    // Prevent multiple simultaneous calls to this function
    if (isLoadingCertificates) {
        return;
    }
    
    isLoadingCertificates = true;
    
    const container = document.getElementById('userCertificates');
    if (!container) {
        console.error('Certificate container not found!');
        isLoadingCertificates = false;
        return;
    }
    
    container.innerHTML = ''; // Clear previous certificates
    container.classList.add('loading'); // Add loading class (optional)

    // Construct the URL with query parameters
    let url = `api/get_certificates.php?sort_by=${sortBy}&sort_order=${sortOrder}&limit=${limit}&offset=${offset}`;
    if (filterBy && filterValue) {
        url += `&filter_by=${filterBy}&filter_value=${filterValue}`;
    }

    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        container.classList.remove('loading'); // Remove loading class
        if (data.success) {
            if (data.data.length === 0) {
                container.innerHTML = '<p>No certificates found.</p>';
                return;
            }

            // Create a document fragment for better performance
            const fragment = document.createDocumentFragment();
            
            // Directly use the data from get_certificates.php
            data.data.forEach(cert => {
                const certElement = displaySingleCertificate(cert); // Create the HTML
                fragment.appendChild(certElement); // Append to fragment instead of directly to container
            });
            
            // Append fragment to container in one operation
            container.appendChild(fragment);

            // --- Pagination Logic ---
            const totalCertificates = data.total;
            const totalPages = Math.ceil(totalCertificates / limit);
            const currentPage = Math.floor(offset / limit) + 1;

            // Create pagination controls
            const paginationDiv = document.createElement('div');
            // paginationDiv.innerHTML = '<br>'
            paginationDiv.classList.add('pagination');
            
            

            if (currentPage > 1) {
                const prevButton = document.createElement('button');
                prevButton.textContent = 'Previous';
                prevButton.addEventListener('click', () => {
                    displayUserCertificates(sortBy, sortOrder, filterBy, filterValue, limit, offset - limit);
                });
                paginationDiv.appendChild(prevButton);
            }

            const pageInfo = document.createElement('span');
            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
            paginationDiv.appendChild(pageInfo);
            
            if (currentPage < totalPages) {
                const nextButton = document.createElement('button');
                nextButton.textContent = 'Next';
                nextButton.addEventListener('click', () => {
                    displayUserCertificates(sortBy, sortOrder, filterBy, filterValue, limit, offset + limit);
                });
                paginationDiv.appendChild(nextButton);
            }
           // container.appendChild(paginationDiv); // Add pagination to the container
           const paginationContainer = document.getElementById('paginationContainer');
            if (paginationContainer) {
                paginationContainer.innerHTML = ''; // Clear existing pagination
                paginationContainer.appendChild(paginationDiv);
            }
        } else {
            console.error('Error fetching certificates:', data.error);
            container.innerHTML = `<p>Error: ${data.error}</p>`; // Show error
        }
    })
    .catch(error => {
        console.error('Network error fetching certificates:', error);
        container.innerHTML = '<p>Error: Failed to load certificates.</p>';
    })
    .finally(() => {
        isLoadingCertificates = false; // Reset the loading flag
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
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
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

function editCertificate(certificateId) {
    // Redirect to create.html with the certificate ID as a query parameter
    window.location.href = `create.html?edit=${certificateId}`;
}

// Check login status and then either show dashboard or login/signup
function checkLoginStatus() {
    fetch('api/check_login.php')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.loggedIn) {
            // Show the dashboard if logged in
            showUserProfile(data.userName);  // Show user info.
            
            // We'll load certificates only once in DOMContentLoaded
        } else {
            // Redirect to index.html if not logged in
            window.location.href = 'index.html';
        }
    })
    .catch(error => {
        console.error('Error checking login status:', error);
        // Show an error message to the user
        const container = document.getElementById('userCertificates');
        if (container) {
            container.innerHTML = '<p>Error: Failed to check login status. Please try again later.</p>';
        }
    });
}

// Function to show the user profile (and hide login/signup)
function showUserProfile(userName) {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const userProfile = document.getElementById('userProfile');

    if (loginBtn) loginBtn.style.display = 'none';
    if (signupBtn) signupBtn.style.display = 'none';
    if (userProfile) userProfile.classList.remove('hidden');

    const usernameDisplay = document.getElementById('usernameDisplay');
    if (usernameDisplay) {
        usernameDisplay.textContent = userName || "User";
    }
}

function handleLogout() {
    // Send a request to the logout API
    fetch('api/logout.php')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Redirect to the home page
            window.location.href = 'index.html';
        } else {
            console.error('Logout failed:', data.error);
            alert('Logout failed: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Network error during logout:', error);
        alert('Network error during logout. Please try again.');
    });
}

// Initialize all dashboard functionality
function initDashboard() {
    // Get references to the filter elements
    const sortSelect = document.getElementById('sort-select');
    const filterInput = document.getElementById('filter-input');
    const filterBySelect = document.getElementById('filter-by-select');

    // Load saved filter settings from localStorage, or use defaults
    const savedSortBy = localStorage.getItem('sortBy') || 'issue_date';
    const savedSortOrder = localStorage.getItem('sortOrder') || 'desc';
    const savedFilterBy = localStorage.getItem('filterBy') || '';
    const savedFilterValue = localStorage.getItem('filterValue') || '';

    // Set initial values of the filter elements
    if (sortSelect) sortSelect.value = `${savedSortBy}-${savedSortOrder}`;
    if (filterBySelect) filterBySelect.value = savedFilterBy;
    if (filterInput) filterInput.value = savedFilterValue;

    // Add event listener for dashboard link
    const dashboardLink = document.getElementById('dashboardLink');
    if (dashboardLink) {
        dashboardLink.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            // No need to redirect, we're already here
        });
    }
    
    // Add event listener for logout link
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (event) => {
            event.preventDefault();
            handleLogout();
        });
    }
    
    // Event listeners for sort/filter changes
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const sortBy = sortSelect.value.split('-')[0];
            const sortOrder = sortSelect.value.split('-')[1];
            // Save to localStorage
            localStorage.setItem('sortBy', sortBy);
            localStorage.setItem('sortOrder', sortOrder);
            displayUserCertificates(sortBy, sortOrder, filterBySelect ? filterBySelect.value : '', filterInput ? filterInput.value : '');
        });
    }

    if (filterInput && filterBySelect) {
        // Use debounce for input to avoid too many requests
        let timeoutId;
        filterInput.addEventListener('input', () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                const sortBy = sortSelect ? sortSelect.value.split('-')[0] : 'issue_date';
                const sortOrder = sortSelect ? sortSelect.value.split('-')[1] : 'desc';
                // Save to localStorage
                localStorage.setItem('filterBy', filterBySelect.value);
                localStorage.setItem('filterValue', filterInput.value);
                displayUserCertificates(sortBy, sortOrder, filterBySelect.value, filterInput.value);
            }, 300); // 300ms debounce
        });

        filterBySelect.addEventListener('change', () => {
            const sortBy = sortSelect ? sortSelect.value.split('-')[0] : 'issue_date';
            const sortOrder = sortSelect ? sortSelect.value.split('-')[1] : 'desc';
            // Save to localStorage
            localStorage.setItem('filterBy', filterBySelect.value);
            localStorage.setItem('filterValue', filterInput.value); //Save value
            displayUserCertificates(sortBy, sortOrder, filterBySelect.value, filterInput.value);
        });
    }
    
    // Display certificates with saved or default filters
    displayUserCertificates(savedSortBy, savedSortOrder, savedFilterBy, savedFilterValue);
}

// Call checkLoginStatus on page load
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus(); // Check login on page load
    
    // Initialize dashboard only if we're on the dashboard page
    if (document.getElementById('userCertificates')) {
        initDashboard();
    }
});
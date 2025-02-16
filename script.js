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

document.addEventListener('DOMContentLoaded', function () {
    checkLoginStatus(); // Check login status on page load

    // Add event listener for dashboard link
    const dashboardLink = document.getElementById('dashboardLink');
    if (dashboardLink) {
        dashboardLink.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
              window.location.href = 'create.html'; // Redirect to Dashboard
        });
    }
});



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

//Smooth Scrolling
function scrollToSection(sectionId) {
    const section = document.querySelector(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}
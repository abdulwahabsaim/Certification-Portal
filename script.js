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
            alert("Logout failed: " + (data.error || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Network error during logout:', error);
        alert('Network error during logout. Please try again.');
    });
}

// Show User Profile and Hide Login/Signup
function showUserProfile(userName) {
    // Hide login/signup buttons
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('signupBtn').style.display = 'none';
    document.getElementById('loginBtnHero').style.display = 'none';
    document.getElementById('signupBtnHero').style.display = 'none';
    
    // Optionally, hide the entire authButtonsHero span
    const authButtonsHero = document.getElementById('authButtonsHero');
    if (authButtonsHero) {
        authButtonsHero.style.display = 'none';
    }
    
    // Show user profile
    document.getElementById('userProfile').classList.remove('hidden');
    document.getElementById('usernameDisplay').textContent = userName || "User";
    
    // Show create button in hero section
    const createNowBtn = document.getElementById('createNowBtn');
    if (createNowBtn) {
        createNowBtn.classList.remove('hidden');
        createNowBtn.style.display = 'inline-block'; // Ensure it's visible
    }
}

// Function to check login status on page load
function checkLoginStatus() {
    fetch('api/check_login.php')
    .then(response => response.json())
    .then(data => {
        if (data.loggedIn) {
            showUserProfile(data.userName); // Pass username
        } else {
            // Show login/signup buttons if not logged in.  These are *already* visible by default.
            document.getElementById('loginBtn').style.display = 'inline-block';
            document.getElementById('signupBtn').style.display = 'inline-block';
            document.getElementById('loginBtnHero').style.display = 'inline-block';
            document.getElementById('signupBtnHero').style.display = 'inline-block';

        }
    })
    .catch(error => console.error('Error checking login status:', error));
}
//Smooth Scrolling
function scrollToSection(sectionId) {
    const section = document.querySelector(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}
document.addEventListener('DOMContentLoaded', function () {
    checkLoginStatus(); // Check login status on page load

    // Add event listener for dashboard link (if it exists)
    const dashboardLink = document.getElementById('dashboardLink');
    if (dashboardLink) {
        dashboardLink.addEventListener('click', function(event) {
            event.preventDefault();
              window.location.href = 'dashboard.html'; // Redirect to Dashboard
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
});
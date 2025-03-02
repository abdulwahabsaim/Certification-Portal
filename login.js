const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Function to handle the sign-in form submission
function handleSignIn(event) {
  event.preventDefault(); // Prevent default form submission

  const email = document.querySelector('.sign-in input[type="email"]').value;
  const password = document.querySelector('.sign-in input[type="password"]').value;
  const loginErrorDiv = document.getElementById('loginError'); // Get the error div
  loginErrorDiv.textContent = ''; // Clear any previous errors

  fetch('api/login.php', { // Correct path to your login API
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Redirect to create.html on successful login
      window.location.href = data.redirect; // Use the redirect URL
    } else {
      // Display error message (you might want a dedicated error <div>)
      // alert(data.error); // Or use a better way to display errors
      loginErrorDiv.textContent = data.error;
    }
  })
  .catch(error => {
    console.error('Error:', error);
     loginErrorDiv.textContent = 'An error occurred during login.';
  });
}

// Function to handle the sign-up form submission
function handleSignUp(event) {
    event.preventDefault();
    const name = document.querySelector('.sign-up input[type="text"]').value;
    const email = document.querySelector('.sign-up input[type="email"]').value;
    const password = document.querySelector('.sign-up input[type="password"]').value;
    const signupErrorDiv = document.getElementById('signupError'); // Get error div for signup
    signupErrorDiv.textContent = ''; // Clear any previous errors

     // Basic client-side validation (you should add more robust validation)
    if (!name || !email || !password) {
        signupErrorDiv.textContent = "Please fill in all fields.";
        return; // Stop if validation fails
    }

    // Validate email format (client-side)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      signupErrorDiv.textContent = "Please enter a valid email address.";
      return; // Stop if invalid email
    }


    fetch('api/register.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    })
    .then(response => response.json()) // This is correct
    .then(data => {
        if (data.success) {
          // Redirect after successful registration
          window.location.href = data.redirect; // Use server-provided redirect.
        } else {
          // Display error message
          signupErrorDiv.textContent = data.error; // Set error message
        }
    })
    .catch(error => {
        console.error('Error:', error);
        signupErrorDiv.textContent = 'An error occurred during registration.';
    });
}


// Add event listeners to the forms
document.querySelector('.sign-in form').addEventListener('submit', handleSignIn);
document.querySelector('.sign-up form').addEventListener('submit', handleSignUp);
// Function to check URL parameters and show the appropriate panel
function checkURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    if (action === 'signup') {
        // Show signup panel
        container.classList.add("active");
    } else {
        // Show login panel (default)
        container.classList.remove("active");
    }
}

// Run the function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    checkURLParameters();
});
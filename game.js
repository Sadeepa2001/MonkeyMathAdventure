// Function to generate falling bananas
function generateBananas() {
  const container = document.getElementById('banana-rain-container');
  const bananaCount = 20; // Number of falling bananas

  for (let i = 0; i < bananaCount; i++) {
    // Create a new banana element
    const banana = document.createElement('img');
    banana.src = 'images/banana.png'; // Path to your banana image (make sure it's a PNG with a transparent background)
    banana.alt = 'Banana';
    banana.classList.add('banana');

    // Position the banana randomly on the screen
    banana.style.left = `${Math.random() * 100}vw`; // Random horizontal position
    banana.style.animationDuration = `${Math.random() * 3 + 4}s`; // Random fall speed (4 to 7 seconds)

    // Append the banana to the container
    container.appendChild(banana);
  }
}

// Generate bananas when the page loads
window.onload = generateBananas;


// Login Form submission
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();  // Prevent page reload
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  if (username && password) {
    // Normally, here you'd authenticate against a backend (e.g., API call)
    // For now, we're assuming a successful login
    alert(`Logged in as ${username}`);
    
    // Redirect to the home page after successful login
    window.location.href = 'home.html';
  } else {
    alert('Please fill in both fields.');
  }
});

// Register Form submission
document.getElementById('register-form').addEventListener('submit', function(event) {
  event.preventDefault();  // Prevent page reload
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const email = document.getElementById('email').value;
  
  if (password === confirmPassword) {
    // Normally, you'd save the user info to the database here (backend call)
    alert('Account created successfully!');
    
    // Redirect to login page after successful registration
    window.location.href = 'login.html';
  } else {
    alert('Passwords do not match.');
  }
});

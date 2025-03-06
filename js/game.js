document.addEventListener('DOMContentLoaded', function () {
  // Login and Register Forms
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  // Register Form Handling
  if (registerForm) {
    registerForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      const email = document.getElementById('email').value;

      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify({ username, password, email }));
      alert('Account created successfully! Please log in.');
      window.location.href = 'login.html';
    });
  }

  // Login Form Handling
  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      // Retrieve stored user info
      const storedUser = JSON.parse(localStorage.getItem('user'));

      if (storedUser && storedUser.username === username && storedUser.password === password) {
        alert(`Welcome, ${username}!`);
        window.location.href = 'home.html';
      } else {
        alert('Invalid username or password.');
      }
    });
  }

  // Banana Rain Animation (Only on Home Page)
  if (document.body.classList.contains('home-page')) {
    function generateBananas() {
      for (let i = 0; i < 10; i++) {
        const banana = document.createElement('img');
        banana.src = 'images/banana.png';
        banana.classList.add('banana');
        banana.style.left = Math.random() * window.innerWidth + 'px';
        banana.style.animationDuration = (Math.random() * 2 + 2) + 's';
        document.body.appendChild(banana);

        // Remove banana after animation
        setTimeout(() => banana.remove(), 3000);
      }
    }

    setInterval(generateBananas, 2000);
  }
});
// Redirect to respective pages when buttons are clicked
document.getElementById('start-game').addEventListener('click', function() {
  window.location.href = 'start-game.html';  // Redirect to Start Game page
});

document.getElementById('about').addEventListener('click', function() {
  window.location.href = 'about.html';  // Redirect to About page
});

document.getElementById('leaderboard').addEventListener('click', function() {
  window.location.href = 'leaderboard.html';  // Redirect to Leaderboard page
});


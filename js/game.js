import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  googleProvider,
  signInWithPopup,
} from "./firebase-config.js";

  // 🔹 Token Validation on Page Load
auth.onAuthStateChanged((user) => {
  if (!user && !window.location.pathname.includes("login.html") && !window.location.pathname.includes("register.html")) {
    // Redirect to login page if the user is not logged in and trying to access a protected page
    window.location.href = "login.html";
  } else if (user && (window.location.pathname.includes("login.html") || window.location.pathname.includes("register.html"))) {
    // Redirect to home page if the user is already logged in and trying to access login/register pages
    window.location.href = "home.html";
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  // 🔹 Register User
  if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      if (password !== confirmPassword) {
        alert("⚠️ Passwords do not match.");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get the Firebase ID token
        const idToken = await user.getIdToken();

        // Save the token to local storage
        localStorage.setItem("authToken", idToken);

        alert("✅ Registration Successful!");
        window.location.href = "login.html";
      } catch (error) {
        alert("❌ Registration Failed: " + error.message);
      }
    });
  }

  // 🔹 Login User
  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get the Firebase ID token
        const idToken = await user.getIdToken();

        // Save the token to local storage
        localStorage.setItem("authToken", idToken);

        alert("✅ Login Successful!");
        window.location.href = "home.html"; // ✅ Redirect to home page after login
      } catch (error) {
        alert("❌ Login Failed: " + error.message);
      }
    });
  }

  // 🔹 Google Sign-In
  const googleSignInButton = document.getElementById("google-sign-in");
  if (googleSignInButton) {
    googleSignInButton.addEventListener("click", async () => {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        // Get the Firebase ID token
        const idToken = await user.getIdToken();

        // Save the token to local storage
        localStorage.setItem("authToken", idToken);

        alert("✅ Google Sign-In Successful!");
        window.location.href = "home.html"; // Redirect to home page after successful sign-in
      } catch (error) {
        console.error("Google Sign-In Error:", error);
        alert("❌ Google Sign-In Failed: " + error.message);
      }
    });
  }

  // Audio Elements
  const backgroundMusic = document.getElementById("background-music");

  // Play background music when the game starts
  backgroundMusic.play();

  // Mute/Unmute Button
  const muteButton = document.getElementById("mute-button");
  muteButton.addEventListener("click", function () {
      if (backgroundMusic.muted) {
          backgroundMusic.muted = false;
          muteButton.textContent = "🔊";
      } else {
          backgroundMusic.muted = true;
          muteButton.textContent = "🔈 ";
      }
  });

  // 🔹 Fix Navigation Buttons
  const startGameButton = document.getElementById("start-game");
  const aboutButton = document.getElementById("about");
  const leaderboardButton = document.getElementById("leaderboard");

  if (startGameButton) {
    startGameButton.addEventListener("click", function () {
      window.location.href = "level-selection.html"; // ✅ Start Game Page
    });
  }

  if (aboutButton) {
    aboutButton.addEventListener("click", function () {
      window.location.href = "about.html"; // ✅ About Page
    });
  }

  if (leaderboardButton) {
    leaderboardButton.addEventListener("click", function () {
      window.location.href = "leaderboard.html"; // ✅ Leaderboard Page
    });
  }

  // 🔹 Banana Animation (Only on Home Page)
  if (document.body.classList.contains("home-page")) {
    function generateBananas() {
      for (let i = 0; i < 10; i++) {
        const banana = document.createElement("img");
        banana.src = "images/banana.png";
        banana.classList.add("banana");
        banana.style.left = Math.random() * window.innerWidth + "px";
        banana.style.animationDuration = Math.random() * 3 + 2 + "s";
        document.body.appendChild(banana);

        setTimeout(() => banana.remove(), 5000);
      }
    }
    setInterval(generateBananas, 2000);
  }

  // 🔹 Navigation for Icon Buttons
  document.getElementById("login-btn")?.addEventListener("click", () => {
    window.location.href = "login.html";
  });

  document.getElementById("register-btn")?.addEventListener("click", () => {
    window.location.href = "register.html";
  });

  document.getElementById("profile-btn")?.addEventListener("click", () => {
    window.location.href = "profile.html";
  });
});
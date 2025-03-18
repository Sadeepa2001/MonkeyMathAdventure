import { auth } from "./firebase-config.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", function () {
  const auth = getAuth();

  // Check if a user is logged in
  onAuthStateChanged(auth, (user) => {
    if (user) {
      document.getElementById("user-email").textContent = user.email;
      loadGameHistory(user.uid);
    } else {
      alert("You are not logged in!");
      window.location.href = "login.html";
    }
  });

  // Logout Button
  document.getElementById("logout-btn").addEventListener("click", function () {
    signOut(auth)
      .then(() => {
        // Remove the token from local storage
        localStorage.removeItem("authToken");

        alert("Logged out successfully!");
        window.location.href = "login.html"; // Redirect to the login page
      })
      .catch((error) => {
        alert("Error logging out: " + error.message);
      });
  });
});

// Function to load game history (Mock Data for now)
function loadGameHistory(userId) {
  const historyTable = document.querySelector("#game-history tbody");
  historyTable.innerHTML = ""; // Clear old data

  // TODO: Fetch actual game history from Firebase
  const gameHistory = [
    { level: "Easy", score: 100, date: "2025-03-10" },
    { level: "Medium", score: 80, date: "2025-03-09" },
    { level: "Hard", score: 50, date: "2025-03-08" }
  ];

  gameHistory.forEach((game) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${game.level}</td>
      <td>${game.score}</td>
      <td>${game.date}</td>
    `;
    historyTable.appendChild(row);
  });
}

import { auth, db } from "./firebase-config.js";
import { collection, query, where, getDocs, orderBy, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", function () {
  const auth = getAuth();

  // Check if a user is logged in
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("User is logged in:", user.uid); // Debugging log

      // 🔹 Fetch the username from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        document.getElementById("user-email").textContent = userData.username; // Display username instead of email
        console.log("User Data:", userData); // Debugging log
      } else {
        console.warn("No user data found in Firestore!");
        document.getElementById("user-email").textContent = "Unknown User";
      }

      loadGameHistory(user.uid); // Load game history for the logged-in user
    } else {
      alert("You are not logged in!");
      window.location.href = "login.html";
    }
  });
});

// 🔹 Logout Button
document.getElementById("logout-btn")?.addEventListener("click", () => {
  signOut(auth).then(() => {
    localStorage.removeItem("authToken"); // ✅ Clear token on logout
    window.location.href = "login.html";
  }).catch((error) => {
    console.error("Logout Error:", error);
  });
});

// 🔹 Function to Load Game History
async function loadGameHistory(userId) {
  const historyTable = document.querySelector("#game-history tbody");
  historyTable.innerHTML = ""; // Clear old data

  try {
    console.log("Fetching game history for:", userId); // Debugging log

    // Fetch game history for the logged-in user
    const scoresQuery = query(
      collection(db, "scores"),
      where("userId", "==", userId), // Use userId instead of email
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(scoresQuery);

    if (querySnapshot.empty) {
      historyTable.innerHTML = "<tr><td colspan='3'>No game history available.</td></tr>";
      return;
    }

    // Populate the table with game history
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log("Game History Document:", data); // Debugging log
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.level}</td>
        <td>${data.score}</td>
        <td>${new Date(data.timestamp.seconds * 1000).toLocaleString()}</td>
      `;
      historyTable.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading game history:", error);
    alert("Failed to load game history. Please try again later.");
  }
}

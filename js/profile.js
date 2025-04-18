import { auth, db } from "./firebase-config.js";
import { collection, query, where, getDocs, orderBy, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", function () {
    const auth = getAuth();

    // Check if a user is logged in
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log("User is logged in:", user.uid);

            // Fetch the username from Firestore
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const usernameElement = document.getElementById("user-email"); 
                if (usernameElement) {
                    // Display the stored username (already first name for Google users)
                    usernameElement.textContent = userData.username;
                }
            } else {
                // For Google users without a doc, create one with first name
                const firstName = user.displayName ? user.displayName.split(' ')[0] : user.email.split('@')[0];
                await setDoc(doc(db, "users", user.uid), {
                    username: firstName,
                    email: user.email,
                    createdAt: new Date()
                });
                
                const usernameElement = document.getElementById("user-email");
                if (usernameElement) {
                    usernameElement.textContent = firstName;
                }
            }

            loadGameHistory(user.uid);
        } else {
            alert("You are not logged in!");
            window.location.href = "login.html";
        }
    });

    // Logout Button
    document.getElementById("logout-btn")?.addEventListener("click", () => {
        signOut(auth).then(() => {
            localStorage.removeItem("authToken");
            window.location.href = "login.html";
        }).catch((error) => {
            console.error("Logout Error:", error);
        });
    });

    // Function to Load Game History
    async function loadGameHistory(userId) {
        const historyTable = document.querySelector("#game-history tbody");
        if (!historyTable) {
          console.error("❌ History table not found in DOM.");
          return;
      }
      historyTable.innerHTML = "<tr><td colspan='3'>Loading history...</td></tr>";

        try {
            console.log("Fetching game history for:", userId);

            const scoresQuery = query(
                collection(db, "scores"),
                where("userId", "==", userId),
                orderBy("timestamp", "desc")
            );
            const querySnapshot = await getDocs(scoresQuery);

            if (querySnapshot.empty) {
                historyTable.innerHTML = "<tr><td colspan='3'>No game history available.</td></tr>";
                return;
            }
            historyTable.innerHTML = ""; // Clear loading message
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const row = document.createElement("tr");
                row.innerHTML = `
                        <td class="${data.level || ''}">${data.level || "N/A"}</td>
                        <td>${data.score || 0}</td>
                        <td>${data.timestamp?.toDate?.().toLocaleString() || "N/A"}</td>
                        `;
                historyTable.appendChild(row);
            });
        } catch (error) {
            console.error("Error loading game history:", error);
            historyTable.innerHTML = "<tr><td colspan='3'>Failed to load game history.</td></tr>";
        }
    }
});

// this code by my own knowledge and experience.
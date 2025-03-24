import { db } from "./firebase-config.js";
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  doc,
  getDoc  // <-- Add this import
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", async function () {
    const leaderboardTable = document.querySelector("#leaderboard tbody");

    try {
        // Show loading state
        leaderboardTable.innerHTML = "<tr><td colspan='4'>Loading leaderboard...</td></tr>";

        // Create scores query
        const scoresQuery = query(
            collection(db, "scores"),
            orderBy("score", "desc"),
            limit(10)
        );

        const scoresSnapshot = await getDocs(scoresQuery);
        leaderboardTable.innerHTML = ""; // Clear loading

        if (scoresSnapshot.empty) {
            leaderboardTable.innerHTML = "<tr><td colspan='4'>No scores yet! Be the first!</td></tr>";
            return;
        }

        // Process results
        let rank = 1;
        for (const doc of scoresSnapshot.docs) {
            const data = doc.data();
            console.log("Score data:", data); // Debug log

            const row = document.createElement("tr");
            
            row.innerHTML = `
                <td>${rank <= 3 ? ['🥇','🥈','🥉'][rank-1] : rank}</td>
                <td>${data.username || 'Unknown'}</td>
                <td>${data.level || 'N/A'}</td>
                <td>${data.score || 0}</td>
            `;
            leaderboardTable.appendChild(row);
            rank++;
        }

     } catch (error) {
        console.error("Leaderboard error:", error);
        leaderboardTable.innerHTML = `
            <tr><td colspan="4">Error loading leaderboard</td></tr>
        `;
    }
});
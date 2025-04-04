import { db } from "./firebase-config.js";
import { 
    collection, 
    getDocs, 
    query, 
    orderBy, 
    limit,
    where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Load all three leaderboards simultaneously
        await Promise.all([
            loadLeaderboard("easy", "easy-leaderboard"),
            loadLeaderboard("medium", "medium-leaderboard"),
            loadLeaderboard("hard", "hard-leaderboard")
        ]);
    } catch (error) {
        console.error("Error loading leaderboards:", error);
        document.querySelectorAll("table tbody").forEach(tbody => {
            tbody.innerHTML = "<tr><td colspan='3'>Error loading data</td></tr>";
        });
    }
});

async function loadLeaderboard(level, tableId) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    tableBody.innerHTML = "<tr><td colspan='3'>Loading...</td></tr>";

    try {
        const scoresQuery = query(
            collection(db, "scores"),
            where("level", "==", level),
            orderBy("score", "desc"),
            limit(10)
        );

        const scoresSnapshot = await getDocs(scoresQuery);
        tableBody.innerHTML = "";

        if (scoresSnapshot.empty) {
            tableBody.innerHTML = "<tr><td colspan='3'>No scores yet!</td></tr>";
            return;
        }

        let rank = 1;
        scoresSnapshot.forEach((doc) => {
            const data = doc.data();
            const row = document.createElement("tr");
            
            // Add medal class to top 3 rows
            let rankClass = "";
            if (rank === 1) rankClass = "gold";
            else if (rank === 2) rankClass = "silver";
            else if (rank === 3) rankClass = "bronze";

            row.innerHTML = `
                <td class="${rankClass}">${rank <= 3 ? ['🥇','🥈','🥉'][rank-1] : rank}</td>
                <td>${data.username || 'Unknown'}</td>
                <td>${data.score || 0}</td>
            `;
            tableBody.appendChild(row);
            rank++;
        });

    } catch (error) {
        console.error(`Error loading ${level} leaderboard:`, error);
        tableBody.innerHTML = "<tr><td colspan='3'>Error loading data</td></tr>";
    }
}

//this code by my own knowledge and get some AI support
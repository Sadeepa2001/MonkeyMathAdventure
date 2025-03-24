import { db } from "./firebase-config.js";
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async function () {
  const leaderboardTable = document.querySelector("#leaderboard tbody");

  // Fetch scores from Firestore
  const scoresQuery = query(collection(db, "scores"), orderBy("score", "desc"));
  const querySnapshot = await getDocs(scoresQuery);

  // Clear the table
  leaderboardTable.innerHTML = "";

  // Populate the table with scores
  querySnapshot.forEach((doc, index) => {
    const data = doc.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${data.email}</td>
      <td>${data.level}</td>
      <td>${data.score}</td>
      
    `;
    leaderboardTable.appendChild(row);
  });
});
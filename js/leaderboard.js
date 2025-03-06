// Simulated leaderboard data
const leaderboardData = [
    { rank: 1, player: "Player1", score: 1000 },
    { rank: 2, player: "Player2", score: 850 },
    { rank: 3, player: "Player3", score: 720 },
];

// Function to display leaderboard
function displayLeaderboard() {
    const tbody = document.querySelector("#leaderboard-table tbody");
    tbody.innerHTML = ""; // Clear any existing data

    leaderboardData.forEach((entry) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${entry.rank}</td><td>${entry.player}</td><td>${entry.score}</td>`;
        tbody.appendChild(row);
    });
}

// Load leaderboard when page loads
window.onload = displayLeaderboard;

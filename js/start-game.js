import { auth, db } from "./firebase-config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Function to save the user's score to Firestore
async function saveScore(email, level, score) {
    const user = auth.currentUser;
    if (!user) {
        console.error("User not logged in.");
        return;
    }

    try {
        await addDoc(collection(db, "scores"), {
            userId: user.uid, // Add the user's UID
            email: email,
            level: level,
            score: score,
            timestamp: new Date()
        });
        console.log("Score saved successfully!", { email, level, score });
    } catch (error) {
        console.error("Error saving score:", error);
    }
}

// Define gameLevel and score in a broader scope
let gameLevel;
let score = 0; // Initialize score

function endGame(won) {
    const user = auth.currentUser;
    if (!user) {
        console.error("User not logged in.");
        return;
    }

    const email = user.email;
    const message = won ? `🎉 Congratulations! You won with a score of ${score}!` : `❌ Game Over! Your score is ${score}. Try again.`;
    alert(message);

    // Save the score to Firestore
    saveScore(email, gameLevel, score);

    // Redirect to level selection page
    window.location.href = "level-selection.html";
}

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    gameLevel = urlParams.get("level") || "easy"; // Default to easy if no level is selected

    const levelDisplay = document.getElementById("selected-level");
    if (levelDisplay) {
        levelDisplay.textContent = `Level: ${gameLevel.toUpperCase()}`;
    }

    // Game settings based on level
    let timeLimit, lives;
    switch (gameLevel) {
        case "easy":
            timeLimit = 60; // 60 seconds
            lives = 5;
            break;
        case "medium":
            timeLimit = 40; // 40 seconds
            lives = 3;
            break;
        case "hard":
            timeLimit = 25; // 25 seconds
            lives = 2;
            break;
        default:
            timeLimit = 60;
            lives = 5;
    }

    let remainingTime = timeLimit;
    let remainingLives = lives;
    let correctAnswer;
    let timerInterval;

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

    // Update UI elements
    const timerDisplay = document.getElementById("timer");
    timerDisplay.textContent = `⏳ Timer: ${remainingTime}s`;

    const livesDisplay = document.getElementById("lives");
    livesDisplay.textContent = `❤️ Lives: ${remainingLives}`;

    const scoreDisplay = document.getElementById("score");
    scoreDisplay.textContent = `⭐ Score: ${score}`;

    // Function to start the countdown timer
    function startTimer() {
        clearInterval(timerInterval); // Clear any existing interval
        remainingTime = timeLimit; // Reset remaining time
        timerDisplay.textContent = `⏳ Timer: ${remainingTime}s`;

        timerInterval = setInterval(() => {
            remainingTime--;
            timerDisplay.textContent = `⏳ Timer: ${remainingTime}s`;

            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                endGame(false);
            }
        }, 1000);
    }

    fetchBananaQuestion();

    const submitButton = document.getElementById("submit-answer");
    const userInput = document.getElementById("user-answer");
    const feedback = document.getElementById("feedback");

    submitButton.addEventListener("click", function () {
        const userAnswer = parseInt(userInput.value.trim());

        if (isNaN(userAnswer)) {
            feedback.textContent = "⚠️ Please enter a valid number!";
            feedback.style.color = "orange";
            return;
        }

        if (userAnswer === correctAnswer) {
            feedback.textContent = "🎉 Correct! Well done!";
            feedback.style.color = "green";
            score += 10; // Increment score
            scoreDisplay.textContent = `⭐ Score: ${score}`; // Update score display

            if (score >= 100) {
                clearInterval(timerInterval);
                endGame(true);
                return;
            }

            setTimeout(() => {
                feedback.textContent = "";
                userInput.value = "";
                fetchBananaQuestion();
            }, 2000);
        } else {
            feedback.textContent = "❌ Wrong answer! Try again.";
            feedback.style.color = "red";
            remainingLives--;
            livesDisplay.textContent = `❤️ Lives: ${remainingLives}`;

            if (remainingLives === 0) {
                clearInterval(timerInterval);
                endGame(false);
            }
        }
    });

    // Fetch a new math question from the API
    async function fetchBananaQuestion() {
        try {
            const response = await fetch("http://localhost:5000/banana-api");

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("API Response:", data);

            const questionImage = document.getElementById("question-image");

            if (questionImage && data.question && data.solution !== undefined) {
                questionImage.src = data.question;
                correctAnswer = parseInt(data.solution);
                startTimer(); 
            } else {
                console.error("Invalid response from API");
                displayError("Failed to load question. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching question:", error);
            displayError("Failed to load question. Check your internet or proxy server.");
        }
    }

    // Function to show an error message
    function displayError(message) {
        const feedback = document.getElementById("feedback");
        if (feedback) {
            feedback.textContent = message;
            feedback.style.color = "red";
        }
    }

    // Update Calendar
    async function updateCalendar() {
        const calendarDisplay = document.getElementById("calendar-date");
        if (!calendarDisplay) {
            console.error("Element with ID 'calendar-date' not found.");
            return;
        }

        try {
            const response = await fetch("https://www.timeapi.io/api/Time/current/zone?timeZone=UTC");
            if (!response.ok) {
                throw new Error("Failed to fetch date");
            }
            const data = await response.json();
            console.log("Calendar Data:", data); // Debugging statement
            const currentDate = `${data.day}-${data.month}-${data.year}`;
            calendarDisplay.textContent = `📅 ${currentDate}`;
        } catch (error) {
            console.error("Failed to fetch calendar date:", error);
            calendarDisplay.textContent = "Error loading date";
        }
    }

    // Update World Clock
    async function updateWorldClock() {
        const clockDisplay = document.getElementById("world-clock");
        if (!clockDisplay) {
            console.error("Element with ID 'world-clock' not found.");
            return;
        }

        // Get the user's local time zone dynamically
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        try {
            const response = await fetch(`https://www.timeapi.io/api/Time/current/zone?timeZone=${timeZone}`);
            if (!response.ok) {
                throw new Error("Failed to fetch time");
            }
            const data = await response.json();
            console.log("World Clock Data:", data); // Debugging statement

            // Ensure all time components are two digits
            const hour = String(data.hour).padStart(2, "0");
            const minute = String(data.minute).padStart(2, "0");
            const second = String(data.seconds).padStart(2, "0");

            const currentTime = `${hour}:${minute}:${second}`;
            clockDisplay.textContent = `🕒 ${currentTime}`;
        } catch (error) {
            console.error("Failed to fetch world time:", error);
            clockDisplay.textContent = "Error loading time";
        }
    }

    updateWorldClock();
    updateCalendar();
    setInterval(updateWorldClock, 1000); // Update time every second
});
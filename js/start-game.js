document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const gameLevel = urlParams.get("level") || "easy"; // Default to easy if no level is selected

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
    let score = 0; // Initialize score
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

    function endGame(won) {
        alert(won ? `🎉 Congratulations! You won with a score of ${score}!` : `❌ Game Over! Your score is ${score}. Try again.`);
        window.location.href = "level-selection.html";
    }

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

    // Function to update world clock in real time
    function updateWorldClock() {
        const clockDisplay = document.getElementById("world-clock");
        setInterval(() => {
            const now = new Date();
            clockDisplay.textContent = `🕒 ${now.toLocaleTimeString()}`;
        }, 1000);
    }

    // Function to update calendar in real time
    function updateCalendar() {
        const calendarElement = document.getElementById("calendar");
        if (calendarElement) {
            const now = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            calendarElement.textContent = `📅 ${now.toLocaleDateString(undefined, options)}`;
        }
    }

    // Start world clock and calendar updates
    updateWorldClock();
    updateCalendar();
});
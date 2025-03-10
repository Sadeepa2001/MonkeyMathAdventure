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

    // Update UI elements
    const timerDisplay = document.getElementById("timer");
    timerDisplay.textContent = `⏳ Timer: ${remainingTime}s`;

    const livesDisplay = document.getElementById("lives");
    livesDisplay.textContent = `❤️ Lives: ${remainingLives}`;

    const scoreDisplay = document.getElementById("score");
    scoreDisplay.textContent = `⭐ Score: ${score}`;

    // Start countdown timer
    const timerInterval = setInterval(() => {
        remainingTime--;
        timerDisplay.textContent = `⏳ Timer: ${remainingTime}s`;

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            endGame(false);
        }
    }, 1000);

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
});
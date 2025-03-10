document.addEventListener("DOMContentLoaded", function () {
    fetchBananaQuestion();

    const submitButton = document.getElementById("submit-answer");
    const userInput = document.getElementById("user-answer");
    const feedback = document.getElementById("feedback");

    if (!submitButton || !userInput || !feedback) {
        console.error("❌ Missing required elements in HTML. Check IDs.");
        return;
    }

    submitButton.addEventListener("click", function () {
        const userAnswer = parseInt(userInput.value.trim());

        if (isNaN(userAnswer)) {
            feedback.textContent = "⚠️ Please enter a valid number!";
            feedback.style.color = "orange";
            return;
        }

        if (userAnswer === correctAnswer) {
            handleCorrectAnswer();
        } else {
            handleIncorrectAnswer();
        }
    });
});

// Global variables
let difficulty = "Easy";
let timeLimit;
let lives;
let score = 0;
let correctAnswer;
let timer;

// Set difficulty settings
function setDifficulty(level) {
    difficulty = level;

    if (level === "Easy") {
        timeLimit = 30;
        lives = 5;
    } else if (level === "Medium") {
        timeLimit = 20;
        lives = 3;
    } else if (level === "Hard") {
        timeLimit = 10;
        lives = 1;
    }

    document.getElementById("lives").textContent = `Lives: ${lives}`;
    document.getElementById("score").textContent = `Score: ${score}`;
    fetchBananaQuestion();
}

// Fetch question from API
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
            startTimer(); // Start timer when question appears
        } else {
            console.error("Invalid response from API");
            displayError("Failed to load question. Please try again.");
        }
    } catch (error) {
        console.error("Error fetching question:", error);
        displayError("Failed to load question. Check your internet or proxy server.");
    }
}

// Start countdown timer
function startTimer() {
    let timeLeft = timeLimit;
    document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;

    clearInterval(timer); // Stop previous timer
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            handleIncorrectAnswer();
        }
    }, 1000);
}

// Handle correct answer
function handleCorrectAnswer() {
    score += 10;
    document.getElementById("score").textContent = `Score: ${score}`;
    document.getElementById("feedback").textContent = "🎉 Correct! Well done!";
    document.getElementById("feedback").style.color = "green";

    // Monkey celebrates
    document.getElementById("monkey").classList.add("celebrate");
    setTimeout(() => {
        document.getElementById("monkey").classList.remove("celebrate");
    }, 1500);

    setTimeout(() => {
        document.getElementById("feedback").textContent = "";
        document.getElementById("user-answer").value = "";
        fetchBananaQuestion();
    }, 1500);
}

// Handle incorrect answer
function handleIncorrectAnswer() {
    lives--;
    document.getElementById("lives").textContent = `Lives: ${lives}`;
    document.getElementById("feedback").textContent = "❌ Wrong answer! Try again.";
    document.getElementById("feedback").style.color = "red";

    if (lives <= 0) {
        alert("Game Over! Try Again.");
        location.reload(); // Restart game
    } else {
        setTimeout(() => {
            document.getElementById("feedback").textContent = "";
            document.getElementById("user-answer").value = "";
            fetchBananaQuestion();
        }, 1500);
    }
}

// Show error message
function displayError(message) {
    const feedback = document.getElementById("feedback");
    if (feedback) {
        feedback.textContent = message;
        feedback.style.color = "red";
    }
}

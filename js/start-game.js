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
            feedback.textContent = "🎉 Correct! Well done!";
            feedback.style.color = "green";

            setTimeout(() => {
                feedback.textContent = "";
                userInput.value = "";
                fetchBananaQuestion();
            }, 1500);
        } else {
            feedback.textContent = "❌ Wrong answer! Try again.";
            feedback.style.color = "red";
        }
    });
});

// Global variable to store the correct answer
let correctAnswer;

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

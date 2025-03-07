document.addEventListener("DOMContentLoaded", function () {
    fetchBananaQuestion();

    document.getElementById("submit-answer").addEventListener("click", function () {
        const userAnswer = parseInt(document.getElementById("user-answer").value.trim());
        const feedback = document.getElementById("feedback");

        if (!userAnswer && userAnswer !== 0) {
            feedback.textContent = "⚠️ Please enter a valid number!";
            feedback.style.color = "orange";
            return;
        }

        // Check the answer
        if (userAnswer === correctAnswer) {
            feedback.textContent = "🎉 Correct! Well done!";
            feedback.style.color = "green";

            // Wait for 1.5 seconds, then load a new question
            setTimeout(() => {
                feedback.textContent = ""; // Clear feedback
                document.getElementById("user-answer").value = ""; // Clear input
                fetchBananaQuestion(); // Load next question
            }, 1500);
        } else {
            feedback.textContent = "❌ Wrong answer! Try again.";
            feedback.style.color = "red";
        }
    });
});

// Global variable to store the correct answer
let correctAnswer;

// Function to fetch a math question from the Banana API
async function fetchBananaQuestion() {
    try {
        const response = await fetch("https://cors-anywhere.herokuapp.com/http://marcconrad.com/uob/banana/api.php?out=json");
        const data = await response.json();
        
        console.log("API Response:", data); // Debugging - Check API Response

        if (data.question && data.solution !== undefined) {
            document.getElementById("question-image").src = data.question;
            correctAnswer = parseInt(data.solution); // Store the correct answer
        } else {
            console.error("Invalid response from API");
        }
    } catch (error) {
        console.error("Error fetching question:", error);
    }
}

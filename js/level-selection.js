document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".level-button");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const selectedLevel = this.getAttribute("data-level");
            window.location.href = `start-game.html?level=${selectedLevel}`;
        });
    });
});

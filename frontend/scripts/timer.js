
let time = 1500; // 25 minutes
let timerInterval = null;
let isRunning = false;

const display = document.getElementById("time-display");
const sessionLabel = document.getElementById("session-label");

function updateDisplay() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  display.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

document.getElementById("start-btn").onclick = () => {
  if (!isRunning) {
    isRunning = true;
    timerInterval = setInterval(() => {
      time--;
      updateDisplay();

      if (time <= 0) {
        clearInterval(timerInterval);
        isRunning = false;

        // Send session to backend
        fetch("/api/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ duration: 25, category: "Focus" })
        });

        alert("Session complete!");
      }
    }, 1000);
  }
};

document.getElementById("pause-btn").onclick = () => {
  clearInterval(timerInterval);
  isRunning = false;
};

document.getElementById("reset-btn").onclick = () => {
  clearInterval(timerInterval);
  isRunning = false;
  time = 1500;
  updateDisplay();
};

updateDisplay();
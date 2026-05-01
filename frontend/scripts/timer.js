// ===============================
// CONFIG
// ===============================
const MIN_REST = 5; // minimum rest time in minutes
const REST_RATIO = 0.2; // 20% of work time

// ===============================
// TIMER STATE
// ===============================
let workMinutes = 25;
let secondsLeft = workMinutes * 60;
let timerInterval = null;
let isWorking = true;

// ===============================
// DOM ELEMENTS
// ===============================
const timerDisplay = document.getElementById("timer-display");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const resetBtn = document.getElementById("reset-btn");

// ===============================
// MAIN TIMER FUNCTIONS
// ===============================
function updateDisplay() {
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, "0")}`;
}

function startTimer() {
  if (timerInterval) return;

  timerInterval = setInterval(() => {
    secondsLeft--;

    updateDisplay();

    if (secondsLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;

      if (isWorking) {
        const restTime = calculateRestTime(workMinutes);
        alert(`Great job! You earned a ${restTime}-minute break.`);
        startRestTimer(restTime);
      } else {
        alert("Break over! Ready for another session?");
        resetTimer();
      }
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  stopTimer();
  isWorking = true;
  secondsLeft = workMinutes * 60;
  updateDisplay();
}

// ===============================
// REST TIMER
// ===============================
function calculateRestTime(workMinutes) {
  return Math.max(MIN_REST, Math.floor(workMinutes * REST_RATIO));
}

function startRestTimer(restMinutes) {
  isWorking = false;
  secondsLeft = restMinutes * 60;
  updateDisplay();
  startTimer();
}

// ===============================
// EVENT LISTENERS
// ===============================
startBtn.addEventListener("click", startTimer);
stopBtn.addEventListener("click", stopTimer);
resetBtn.addEventListener("click", resetTimer);

// Initialize display
updateDisplay();

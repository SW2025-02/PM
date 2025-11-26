// app/javascript/timer.js
let timerRunning = false;
let paused = false;
let elapsed = 0;
let timerInterval;

function updateTimer() {
  const hours = String(Math.floor(elapsed / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
  const seconds = String(elapsed % 60).padStart(2, "0");
  document.getElementById("timer").textContent = `${hours}:${minutes}:${seconds}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const startStop = document.getElementById("startStopBtn");
  const pauseResume = document.getElementById("pauseResumeBtn");

  startStop.addEventListener("click", () => {
    if (!timerRunning) {
      timerRunning = true;
      timerInterval = setInterval(() => {
        if (!paused) {
          elapsed++;
          updateTimer();
        }
      }, 1000);
    } else {
      timerRunning = false;
      clearInterval(timerInterval);
    }
  });

  pauseResume.addEventListener("click", () => {
    paused = !paused;
  });
});

/* global fetch */

let timerInterval = null;
let elapsedSeconds = 0;
let isRunning = false;

const csrfToken =
  document.querySelector('meta[name="csrf-token"]').content;

// ----------------------
// 時間フォーマット
// ----------------------
function formatTime(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function updateTimerDisplay() {
  document.getElementById("timer").textContent = formatTime(elapsedSeconds);
}

function startLocalTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    elapsedSeconds++;
    updateTimerDisplay();
  }, 1000);
}

function stopLocalTimer() {
  clearInterval(timerInterval);
}

// ----------------------
// START（開始）
// ----------------------
function startTimer() {
  fetch("/stopwatch/start", {
    method: "POST",
    headers: { "X-CSRF-Token": csrfToken }
  })
    .then(res => res.json())
    .then(() => {
      isRunning = true;
      startLocalTimer();
    });
}

// ----------------------
// PAUSE（一時停止）
// ----------------------
function pauseTimer() {
  fetch("/stopwatch/pause", {
    method: "POST",
    headers: { "X-CSRF-Token": csrfToken }
  });
  isRunning = false;
  stopLocalTimer();
}

// ----------------------
// RESUME（再開）
// ----------------------
function resumeTimer() {
  fetch("/stopwatch/resume", {
    method: "POST",
    headers: { "X-CSRF-Token": csrfToken }
  })
    .then(res => res.json())
    .then(() => {
      isRunning = true;
      startLocalTimer();
    });
}

// ----------------------
// FINISH（終了＆登録）
// ----------------------
function finishTimer() {
  const subject = document.querySelector(".subject-select").value;
  const memo = document.querySelector(".memo-box").value;

  fetch("/stopwatch/finish", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken
    },
    body: JSON.stringify({ subject, memo })
  })
    .then(res => res.json())
    .then(data => {
      stopLocalTimer();
      elapsedSeconds = 0;
      isRunning = false;
      updateTimerDisplay();
      appendRecord(data.record);
    });
}

// ----------------------
// ボタンイベント
// ----------------------
document.addEventListener("turbo:load", () => {
  document.getElementById("startStopBtn").onclick = () => {
    if (!isRunning && elapsedSeconds === 0) {
      startTimer();
    } else {
      finishTimer();
    }
  };

  document.getElementById("pauseResumeBtn").onclick = () => {
    if (isRunning) {
      pauseTimer();
    } else {
      resumeTimer();
    }
  };
});

// ----------------------
// 登録内容を追加表示
// ----------------------
function appendRecord(record) {
  const box = document.querySelector(".record-box");
  const p = document.createElement("p");
  p.innerHTML = `<strong>${record.subject}</strong>：${record.memo}（${record.time_spent}）`;
  box.appendChild(p);
}

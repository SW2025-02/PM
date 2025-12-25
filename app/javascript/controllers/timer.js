/* global fetch */

let timerInterval = null;
let elapsedSeconds = 0;
let isRunning = false;

// CSRFトークン（Rails必須）
const csrfToken = document.querySelector("meta[name='csrf-token']").content;

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
  const timer = document.getElementById("timer");
  if (timer) timer.textContent = formatTime(elapsedSeconds);
}

// ----------------------
// ローカルタイマー制御
// ----------------------
function startLocalTimer() {
  timerInterval = setInterval(() => {
    elapsedSeconds++;
    updateTimerDisplay();
  }, 1000);
}

function stopLocalTimer() {
  clearInterval(timerInterval);
}

// ----------------------
// START
// ----------------------
document.getElementById("startStopBtn").addEventListener("click", () => {
  if (isRunning) return;

  const subjectId = document.querySelector(".subject-select").value;

  fetch("/stopwatch/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken
    },
    body: JSON.stringify({ subject_id: subjectId })
  })
    .then(() => {
      elapsedSeconds = 0;
      updateTimerDisplay();
      isRunning = true;
      startLocalTimer();
    });
});

// ----------------------
// PAUSE / RESUME
// ----------------------
document.getElementById("pauseResumeBtn").addEventListener("click", () => {
  if (isRunning) {
    // PAUSE
    fetch("/stopwatch/pause", {
      method: "POST",
      headers: { "X-CSRF-Token": csrfToken }
    });

    stopLocalTimer();
    isRunning = false;
  } else {
    // RESUME
    fetch("/stopwatch/resume", {
      method: "POST",
      headers: { "X-CSRF-Token": csrfToken }
    })
      .then(() => fetch("/stopwatch/status"))
      .then(res => res.json())
      .then(data => {
        elapsedSeconds = data.elapsed_seconds;
        updateTimerDisplay();
        isRunning = true;
        startLocalTimer();
      });
  }
});

// ----------------------
// FINISH（登録）
// ----------------------
document.getElementById("saveBtn").addEventListener("click", () => {
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
      // タイマー初期化
      stopLocalTimer();
      elapsedSeconds = 0;
      isRunning = false;
      updateTimerDisplay();

      // 画面に即反映
      appendRecord(data.record);
    });
});

// ----------------------
// 画面ロード時：statusで復元
// ----------------------
window.addEventListener("DOMContentLoaded", () => {
  fetch("/stopwatch/status")
    .then(res => {
      if (!res.ok) return null;
      return res.json();
    })
    .then(data => {
      if (!data) return;

      elapsedSeconds = data.elapsed_seconds || 0;
      updateTimerDisplay();

      if (data.running) {
        isRunning = true;
        startLocalTimer();
      }
    });
});

// ----------------------
// StudyRecord を1件追加表示
// ----------------------
function appendRecord(record) {
  const box = document.querySelector(".record-box");
  if (!box) return;

  const p = document.createElement("p");
  p.innerHTML = `<strong>${record.subject}</strong>：${record.memo}（${record.time_spent}）`;
  box.appendChild(p);
}

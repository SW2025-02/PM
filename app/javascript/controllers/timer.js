/* global fetch */
let timerInterval = null;
let elapsedSeconds = 0;
let isRunning = false;

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

// ----------------------
// START / STOP
// ----------------------
document.getElementById("startStopBtn").addEventListener("click", () => {
  if (!isRunning) {
    // --- start ---
    fetch("/stopwatch/start", { method: "POST" })
      .then(res => res.json())
      .then(data => {
        elapsedSeconds = data.elapsed_seconds;
        isRunning = true;

        timerInterval = setInterval(() => {
          elapsedSeconds++;
          updateTimerDisplay();
        }, 1000);
      });
  } else {
    // --- stop（＝pauseと同じ） ---
    fetch("/stopwatch/pause", { method: "POST" });
    clearInterval(timerInterval);
    isRunning = false;
  }
});

// ----------------------
// PAUSE / RESUME
// ----------------------
document.getElementById("pauseResumeBtn").addEventListener("click", () => {
  if (isRunning) {
    // pause
    fetch("/stopwatch/pause", { method: "POST" });
    clearInterval(timerInterval);
    isRunning = false;
  } else {
    // resume
    fetch("/stopwatch/resume", { method: "POST" })
      .then(res => res.json())
      .then(data => {
        elapsedSeconds = data.elapsed_seconds;
        updateTimerDisplay();

        isRunning = true;

        timerInterval = setInterval(() => {
          elapsedSeconds++;
          updateTimerDisplay();
        }, 1000);
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
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ subject: subject, memo: memo })
  })
    .then(res => res.json())
    .then(data => {
      // タイマーリセット
      clearInterval(timerInterval);
      elapsedSeconds = 0;
      isRunning = false;
      updateTimerDisplay();

      // ページ更新なしで登録内容を追加
      appendRecord(data.record);
    });
});

// ----------------------
// 画面ロード時：statusで復元
// ----------------------
window.addEventListener("DOMContentLoaded", () => {
  fetch("/stopwatch/status")
    .then(res => res.json())
    .then(data => {
      elapsedSeconds = data.elapsed_seconds || 0;
      updateTimerDisplay();

      if (data.is_running) {
        isRunning = true;
        timerInterval = setInterval(() => {
          elapsedSeconds++;
          updateTimerDisplay();
        }, 1000);
      }
    });
});

// ----------------------
// StudyRecord を一つ追加表示
// ----------------------
function appendRecord(record) {
  const box = document.querySelector(".record-box");

  const p = document.createElement("p");
  p.innerHTML = `<strong>${record.subject}</strong>：${record.memo}（${record.time_spent}）`;

  box.appendChild(p);
}

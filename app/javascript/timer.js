console.log("🔥 timer.js loaded")

document.addEventListener("turbo:load", () => {
  console.log("🔥 turbo:load fired")
  
  const timerDisplay = document.getElementById("timer")
  const startStopBtn = document.getElementById("startStopBtn")
  const pauseResumeBtn = document.getElementById("pauseResumeBtn")

  if (!timerDisplay || !startStopBtn || !pauseResumeBtn) {
    console.warn("⚠️ 必要な要素が見つかりません")
    return
  }

  // 🔴 二重バインド防止
  if (startStopBtn.dataset.bound === "true") return
  startStopBtn.dataset.bound = "true"
  pauseResumeBtn.dataset.bound = "true"

  const subjectSelect = document.querySelector(".subject-select")
  const memoBox = document.querySelector(".memo-box")



  let pollingTimer = null
  let isRunning = false
  let isPaused = false

  /* ------------------------------
     CSRF
  ------------------------------ */
  function csrfToken() {
    return document
      .querySelector("meta[name='csrf-token']")
      ?.getAttribute("content")
  }

  /* ------------------------------
     表示更新
  ------------------------------ */
  function updateDisplay(seconds) {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0")
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0")
    const s = String(seconds % 60).padStart(2, "0")
    timerDisplay.textContent = `${h}:${m}:${s}`
  }

  /* ------------------------------
     status 取得
  ------------------------------ */
  async function fetchStatus() {
    const res = await fetch("/stopwatch/status")
    if (!res.ok) return

    const data = await res.json()
    updateDisplay(data.elapsed_seconds)

    isRunning = data.running
    isPaused = !data.running && data.elapsed_seconds > 0

    updateButtons()

    if (isRunning) {
      startPolling()
    } else {
      stopPolling()
    }
  }

  /* ------------------------------
     polling
  ------------------------------ */
  function startPolling() {
    if (pollingTimer) return
    pollingTimer = setInterval(fetchStatus, 1000)
  }

  function stopPolling() {
    clearInterval(pollingTimer)
    pollingTimer = null
  }

  /* ------------------------------
     ボタン表示制御
  ------------------------------ */
  function updateButtons() {
    startStopBtn.textContent = isRunning ? "終了" : "開始"
    pauseResumeBtn.textContent = isPaused ? "再開" : "停止"

    pauseResumeBtn.disabled = !isRunning && !isPaused
  }

  /* ------------------------------
     スタート / 終了
  ------------------------------ */
  startStopBtn.addEventListener("click", async () => {
    if (!isRunning && !isPaused) {
      // START
      const res = await fetch("/stopwatch/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken()
        },
        body: JSON.stringify({
          subject: subjectSelect?.value
        })
      })

      if (res.ok) {
        isRunning = true
        startPolling()
      }
    } else {
      // FINISH
      const res = await fetch("/stopwatch/finish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken()
        },
        body: JSON.stringify({
          subject: subjectSelect?.value,
          memo: memoBox?.value
        })
      })

      if (res.ok) {
        stopPolling()
        isRunning = false
        isPaused = false
        updateDisplay(0)
      }
    }

    updateButtons()
  })

  /* ------------------------------
     停止 / 再開
  ------------------------------ */
  pauseResumeBtn.addEventListener("click", async () => {
    if (isRunning) {
      // PAUSE
      await fetch("/stopwatch/pause", {
        method: "POST",
        headers: { "X-CSRF-Token": csrfToken() }
      })
      isRunning = false
      isPaused = true
    } else if (isPaused) {
      // RESUME
      await fetch("/stopwatch/resume", {
        method: "POST",
        headers: { "X-CSRF-Token": csrfToken() }
      })
      isRunning = true
      isPaused = false
    }

    updateButtons()
    fetchStatus()
  })

  /* ------------------------------
     初期化（リロード耐性）
  ------------------------------ */
  fetchStatus()
})

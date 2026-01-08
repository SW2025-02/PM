console.log("🔥 timer.js loaded")

document.addEventListener("turbo:load", () => {
  console.log("🔥 turbo:load fired")
  
  const timerDisplay = document.getElementById("timer")
  const startStopBtn = document.getElementById("startStopBtn")
  const pauseResumeBtn = document.getElementById("pauseResumeBtn")

  if (!timerDisplay || !startStopBtn || !pauseResumeBtn) {
    return
  }

  // 🔴 二重バインド防止
  if (startStopBtn.dataset.bound === "true") return
  startStopBtn.dataset.bound = "true"
  pauseResumeBtn.dataset.bound = "true"

  const subjectSelect = document.querySelector(".subject-select")
  const memoBox = document.querySelector(".memo-box")
  
  const recordDate = document.getElementById("record-date")?.value
  console.log("📅 recordDate:", recordDate)

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
  if (isRunning || isPaused) {
    startStopBtn.textContent = "終了"
  } else {
    startStopBtn.textContent = "開始"
  }

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
        memo: memoBox?.value,
        date: recordDate
      })
    })
    
    if (res.ok) {
      const data = await res.json()
    
      console.log("✅ finished:", data)
    
      // 🧹 画面クリア
      stopPolling()
      isRunning = false
      isPaused = false
    
      updateDisplay(0)
    
      if (subjectSelect) subjectSelect.value = "数学"
      if (memoBox) memoBox.value = ""
    
      updateButtons()
      
      const recordsBox = document.getElementById("records")
      if (recordsBox) {
        // 「NotFound: Motivation」があれば消す
        const noRecords = document.getElementById("no-records")
        if (noRecords) noRecords.remove()
      
        const p = document.createElement("p")
        p.innerHTML = `
          <strong>${data.record.subject}</strong>
          ${data.record.memo ?? ""}
          （${data.record.time_spent} 秒）
        `
        recordsBox.appendChild(p)
      }
    }
   }
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
  
    /* ------------------------------
     削除処理
  ------------------------------ */
  if (document.body.dataset.deleteBound === "true") return
  document.body.dataset.deleteBound = "true"
  
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".delete-record-btn")
    if (!btn) return

    const recordId = btn.dataset.id
    if (!recordId) return

    if (!confirm("この記録を削除しますか？")) return

    const res = await fetch(`/study_records/${recordId}`, {
      method: "DELETE",
      headers: {
        "X-CSRF-Token": csrfToken(),
        "Accept": "application/json"
      }
    })

    if (!res.ok) {
      alert("削除に失敗しました")
      return
    }

    // DOM から削除
    const recordRow = btn.closest("p")
    if (recordRow) recordRow.remove()

    // 全部消えたら NotFound 表示
    const recordsBox = document.getElementById("records")
    if (recordsBox && recordsBox.children.length === 0) {
      const p = document.createElement("p")
      p.id = "no-records"
      p.textContent = "NotFound: Motivation"
      recordsBox.appendChild(p)
    }
  })

})

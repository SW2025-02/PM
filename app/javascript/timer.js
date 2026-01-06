console.log("🔥 timer.js 読み込まれた")

document.addEventListener("DOMContentLoaded", () => {
  console.log("🔥 DOMContentLoaded 発火")

  const startBtn = document.getElementById("start-btn")
  const stopBtn  = document.getElementById("stop-btn")
  const resetBtn = document.getElementById("reset-btn")
  const display  = document.getElementById("timer-display")

  if (!startBtn || !stopBtn || !resetBtn || !display) {
    console.warn("⚠️ タイマー用の要素が見つかりません")
    return
  }

  console.log("✅ ボタン取得成功")

  let timer = null
  let seconds = 0

  function updateDisplay() {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0")
    const sec = String(seconds % 60).padStart(2, "0")
    display.textContent = `${min}:${sec}`
  }

  startBtn.addEventListener("click", () => {
    console.log("▶️ start クリック")
    if (timer) return

    timer = setInterval(() => {
      seconds++
      updateDisplay()
    }, 1000)
  })

  stopBtn.addEventListener("click", () => {
    console.log("⏸ stop クリック")
    clearInterval(timer)
    timer = null
  })

  resetBtn.addEventListener("click", () => {
    console.log("🔁 reset クリック")
    clearInterval(timer)
    timer = null
    seconds = 0
    updateDisplay()
  })

  updateDisplay()
})


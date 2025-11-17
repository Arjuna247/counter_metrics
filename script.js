// Frontend: collects metrics and sends to backend
let clickCount = 0;
let lastClickTime = null;
let pressStartTime = null;
let lastDurationMs = null;

const btn = document.getElementById("trackBtn");
const countDisplay = document.getElementById("clickCount");
const intervalDisplay = document.getElementById("lastInterval");
const durationDisplay = document.getElementById("lastDuration");
const timestampDisplay = document.getElementById("lastTimestamp");

btn.addEventListener("mousedown", () => {
  pressStartTime = Date.now();
});

btn.addEventListener("mouseup", () => {
  // calculate duration on mouseup to get hold time
  if (pressStartTime != null) {
    lastDurationMs = Date.now() - pressStartTime;
    durationDisplay.textContent = lastDurationMs;
  }
});

btn.addEventListener("click", () => {
  // update counters and derived metrics
  clickCount++;
  countDisplay.textContent = clickCount;

  const now = Date.now();

  // interval (null for first click)
  const interval = lastClickTime ? now - lastClickTime : null;
  lastClickTime = now;
  intervalDisplay.textContent = interval || 0;

  // ensure we have duration either from mouseup or compute straightforwardly
  const duration = typeof lastDurationMs === "number" ? lastDurationMs : 0;
  durationDisplay.textContent = duration;

  // formatted timestamp for UI: dd/mm/yyyy, h:mm:ss am/pm (en-IN)
  const formattedTimestamp = new Date(now).toLocaleString("en-IN", {
    hour12: true,
  });
  timestampDisplay.textContent = formattedTimestamp;

  // prepare payload for backend
  const payload = {
    count: clickCount,
    interval: typeof interval === "number" ? interval : null,
    duration: typeof duration === "number" ? duration : null,
    timestamp: now
  };

  // send to backend
  fetch("http://localhost:3000/button-metrics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok: " + res.status);
      return res.json();
    })
    .then((data) => {
      // optional: you can log response or handle status
      // console.log("Backend response:", data);
    })
    .catch((err) => {
      console.error("Fetch error:", err);
    });

  // reset pressStartTime so next press is clean
  pressStartTime = null;
  // keep lastDurationMs around for sanity (will be overwritten on next mouseup)
});
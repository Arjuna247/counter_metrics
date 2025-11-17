// Frontend: collects metrics and sends to backend
let clickCount = 0;
let lastClickTime = null;
let pressStartTime = null;
let lastDuration = 0;

// Get backend URL from environment or default to Docker hostname
const BACKEND_URL = window.BACKEND_URL || "http://localhost:3002";

// DOM elements with null checks
const btn = document.getElementById("trackBtn");
const countDisplay = document.getElementById("clickCount");
const intervalDisplay = document.getElementById("lastInterval");
const durationDisplay = document.getElementById("lastDuration");
const timestampDisplay = document.getElementById("lastTimestamp");

// Ensure all elements exist before adding listeners
if (!btn || !countDisplay || !intervalDisplay || !durationDisplay || !timestampDisplay) {
  console.error("Required DOM elements not found!");
} else {
  btn.addEventListener("mousedown", () => {
    pressStartTime = Date.now();
  });

  btn.addEventListener("mouseup", () => {
    // Calculate and store duration on mouseup
    if (pressStartTime !== null) {
      lastDuration = Date.now() - pressStartTime;
      durationDisplay.textContent = lastDuration;
    }
  });

  btn.addEventListener("click", () => {
    clickCount++;
    countDisplay.textContent = clickCount;

    const now = Date.now();

    // Calculate interval (0 for first click)
    const interval = lastClickTime ? now - lastClickTime : 0;
    lastClickTime = now;
    intervalDisplay.textContent = interval;

    // Timestamp display
    const formattedTimestamp = new Date(now).toLocaleString("en-IN", {
      hour12: true,
    });
    timestampDisplay.textContent = formattedTimestamp;

    // Payload for backend (use stored duration from mouseup)
    const payload = {
      count: clickCount,
      interval: interval,
      duration: lastDuration,
      timestamp: now,
    };

    // Send to backend with proper error handling
    fetch(`${BACKEND_URL}/button-metrics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Metrics sent successfully:", data);
      })
      .catch((err) => {
        console.error("Failed to send metrics:", err);
      });

    // Reset for next click
    pressStartTime = null;
    lastDuration = 0;
  });
}
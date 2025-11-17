const express = require("express");
const cors = require("cors");
const client = require("prom-client");

const app = express();

// CORS configuration - restrict to known origins in production
const corsOptions = {
  origin: process.env.NODE_ENV === "production"
    ? ["http://localhost:5500", "http://frontend:5500"]
    : "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1kb" })); // Limit payload size

// --------------------------------------
// PROMETHEUS SETUP
// --------------------------------------

const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Counter: total number of clicks
const buttonClickCount = new client.Counter({
  name: "button_click_count_total",
  help: "Total number of user clicks"
});

// Gauge: interval between clicks
const buttonClickInterval = new client.Gauge({
  name: "button_click_interval_ms",
  help: "Interval between consecutive clicks (ms)"
});

// Gauge: button press duration
const buttonClickDuration = new client.Gauge({
  name: "button_click_duration_ms",
  help: "Button press duration (ms)"
});

// Register all custom metrics
register.registerMetric(buttonClickCount);
register.registerMetric(buttonClickInterval);
register.registerMetric(buttonClickDuration);

// --------------------------------------
// ENDPOINT TO RECEIVE METRICS FROM FRONTEND
// --------------------------------------

// Validation helper
function validateMetrics(data) {
  const errors = [];

  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Invalid request body"] };
  }

  const { count, interval, duration, timestamp } = data;

  // Validate count
  if (typeof count !== "number" || !Number.isInteger(count) || count < 1) {
    errors.push("count must be a positive integer");
  }

  // Validate interval
  if (typeof interval !== "number" || isNaN(interval) || interval < 0) {
    errors.push("interval must be a non-negative number");
  } else if (interval > 3600000) { // 1 hour max
    errors.push("interval exceeds maximum allowed value (1 hour)");
  }

  // Validate duration
  if (typeof duration !== "number" || isNaN(duration) || duration < 0) {
    errors.push("duration must be a non-negative number");
  } else if (duration > 60000) { // 1 minute max press duration
    errors.push("duration exceeds maximum allowed value (1 minute)");
  }

  // Validate timestamp
  if (typeof timestamp !== "number" || isNaN(timestamp) || timestamp <= 0) {
    errors.push("timestamp must be a valid Unix timestamp");
  } else {
    const now = Date.now();
    const timeDiff = Math.abs(now - timestamp);
    if (timeDiff > 300000) { // 5 minutes tolerance
      errors.push("timestamp is too far from current time");
    }
  }

  return { valid: errors.length === 0, errors };
}

app.post("/button-metrics", (req, res) => {
  try {
    const { count, interval, duration, timestamp } = req.body;

    // Validate input
    const validation = validateMetrics(req.body);
    if (!validation.valid) {
      console.warn("Invalid metrics received:", validation.errors);
      return res.status(400).json({
        success: false,
        error: "Invalid metrics data",
        details: validation.errors
      });
    }

    // Increment click counter per click event
    buttonClickCount.inc();

    // Update gauges
    buttonClickInterval.set(interval);
    buttonClickDuration.set(duration);

    // Format timestamp for logs
    const formattedTime = new Date(timestamp).toLocaleString("en-IN", {
      hour12: true
    });

    console.log(`\n–––– Button Event Received ––––`);
    console.log(`Press Duration (ms): ${duration}`);
    console.log(`Click Interval (ms): ${interval}`);
    console.log(`Click Count (frontend): ${count}`);
    console.log(`Timestamp: ${formattedTime}`);

    res.json({ success: true, message: "Metrics received" });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// --------------------------------------
// PROMETHEUS METRICS ENDPOINT
// --------------------------------------

app.get("/metrics", async (req, res) => {
  try {
    res.setHeader("Content-Type", register.contentType);
    res.send(await register.metrics());
  } catch (err) {
    res.status(500).send("Error collecting metrics");
  }
});

// --------------------------------------
// START SERVER
// --------------------------------------

const PORT = 3001;  // Change from 3003 to 3001
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});

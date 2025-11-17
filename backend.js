const express = require("express");
const cors = require("cors");
const client = require("prom-client");

const app = express();
app.use(cors());
app.use(express.json());

// Prometheus setup
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Metrics definitions
const buttonClickCount = new client.Counter({
  name: "button_click_count_total",
  help: "Total number of user clicks"
});

const buttonClickInterval = new client.Gauge({
  name: "button_click_interval_ms",
  help: "Interval between consecutive clicks (ms)"
});

const buttonClickDuration = new client.Gauge({
  name: "button_click_duration_ms",
  help: "Button press duration (ms)"
});

register.registerMetric(buttonClickCount);
register.registerMetric(buttonClickInterval);
register.registerMetric(buttonClickDuration);

// POST route to receive metrics
app.post("/button-metrics", (req, res) => {
  try {
    const { count, interval, duration, timestamp } = req.body;

    // increment counter (one per click)
    buttonClickCount.inc();

    // Only set gauge when value is a valid number
    if (typeof interval === "number" && !isNaN(interval)) {
      buttonClickInterval.set(interval);
    }
    if (typeof duration === "number" && !isNaN(duration)) {
      buttonClickDuration.set(duration);
    }

    // Format timestamp nicely for console (en-IN with AM/PM)
    const formattedTime = new Date(Number(timestamp)).toLocaleString("en-IN", {
      hour12: true
    });

    // Print clean output in terminal
    console.log(`\nPress Duration (ms): ${duration}`);
    console.log(`Click Interval (ms): ${interval}`);
    console.log(`Button count: ${count}`);
    console.log(`Timestamp: ${formattedTime}`);

    res.json({ success: true, message: "Metrics received" });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Prometheus scrape endpoint
app.get("/metrics", async (req, res) => {
  try {
    res.setHeader("Content-Type", register.contentType);
    res.send(await register.metrics());
  } catch (err) {
    res.status(500).send("Error collecting metrics");
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
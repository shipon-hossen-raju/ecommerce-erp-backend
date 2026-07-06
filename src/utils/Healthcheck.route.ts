// ── Health Check Route ──────────────────────────────────────────────
// GET /health_check
// Returns server diagnostics as JSON.
// Add to your Express app: app.use(healthCheckRouter);

import express from "express";
import os from "os";
import path from "path";
import config from "../config";

const router = express.Router();

// ── Helpers ──────────────────────────────────────────────────────────

/** Format raw seconds into "Xd Xh Xm" */
function formatUptime(seconds = 0) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return [d && `${d}d`, h && `${h}h`, `${m}m`].filter(Boolean).join(" ");
}

/** Return the first non-internal IPv4 address, or fallback. */
function getLocalIP() {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name] ?? []) {
      if (iface.family === "IPv4" && !iface.internal) return iface.address;
    }
  }
  return "127.0.0.1";
}

/** Memory stats in GB + percentage used. */
function getMemoryStats() {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  const pct = Math.round((used / total) * 100);

  const toGB = (bytes: number) => (bytes / 1024 ** 3).toFixed(2);
  return {
    memory: `${toGB(used)} GB / ${toGB(total)} GB`,
    memPercent: pct, // 0–100 — used by the frontend progress bar
  };
}

// ── Route ────────────────────────────────────────────────────────────

router.get("/health_check", (req, res) => {
  try {
    const { memory, memPercent } = getMemoryStats();

    const payload = {
      // Core status
      system: "Online",
      api: "Running",
      environment: process.env.NODE_ENV ?? "development",

      // Timing
      uptime: formatUptime(os.uptime()),
      timestamp: new Date().toISOString(),

      // Memory (includes % for the frontend bar)
      memory,
      memPercent,

      // Network
      ip: getLocalIP(),

      // Project info
      projectName: "Mini ERP Backend",
    };

    // Cache-busting headers so browsers always fetch fresh data
    res.set("Cache-Control", "no-store");
    res.json(payload);
  } catch (err: any) {
    // Something went wrong building the payload — return a degraded status
    console.error("[health_check] Error:", err);
    res.status(500).json({
      system: "Degraded",
      api: "Error",
      environment: config.isDev ? "Development" : "Production",
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// ── Static files ─────────────────────────────────────────────────────

// Serve the public folder (index.html lives here)
router.use(express.static(path.resolve("./src/public")));

export const healthCheckRouter = router;

import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { router as authRoutes } from "./routes/auth";
import { router as projectRoutes } from "./routes/projects";
import { router as musicRoutes } from "./routes/music";
import { router as adminRoutes } from "./routes/admin";
import { router as feedbackRoutes } from "./routes/feedback";
import { router as paymentRoutes } from "./routes/payments";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "WindHarmony Server Running";
    res.json({ message: ping, timestamp: new Date().toISOString() });
  });

  // API Routes
  app.get("/api/demo", handleDemo);
  app.use("/api/auth", authRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/music", musicRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/feedback", feedbackRoutes);
  app.use("/api/payments", paymentRoutes);

  // Error handling middleware
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Server error:", err);
    res.status(500).json({
      error: "Internal server error",
      message: err.message,
      timestamp: new Date().toISOString(),
    });
  });

  // 404 handler for API routes only
  app.use("/api/*", (req, res) => {
    res.status(404).json({
      error: "API endpoint not found",
      path: req.originalUrl,
      timestamp: new Date().toISOString(),
    });
  });

  // For non-API routes, let the frontend handle routing (SPA fallback)
  // This allows React Router to handle client-side routing

  return app;
}

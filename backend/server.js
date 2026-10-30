import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import heroSectionRoutes from "./routes/heroSectionRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import contactInfoRoutes from "./routes/contactInfoRoutes.js";
import whyLoomstoneRoutes from "./routes/whyLoomstoneRoutes.js";

import { ensureDefaultAdmin } from "./controllers/authController.js";

const app = express();

// Allowed origins for CORS (Frontend, CMS, and local dev ports)
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CMS_URL,
  "http://localhost:3000",
  "http://localhost:3010",
  "http://localhost:3005",
  "https://localhost:3000",
  "https://localhost:3010",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/hero-section", heroSectionRoutes);
app.use("/api/products", productRoutes);
app.use("/api/contact-info", contactInfoRoutes);
app.use("/api/why-loomstone", whyLoomstoneRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Loomstone CMS API running", status: "ok" });
});

const PORT = process.env.PORT || 4000;

// Connect database, ensure default admin exists, then start server
connectDB().then(async () => {
  try {
    await ensureDefaultAdmin();
  } catch (err) {
    console.error("[AUTH] Error initializing default admin:", err.message);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

export default app;

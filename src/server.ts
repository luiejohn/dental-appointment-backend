import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth";
import dentistRoutes from "./routes/dentists";
import appointmentRoutes from "./routes/appointments";
import { requireAuth } from "./middleware/auth.middleware";
import { errorHandler } from "./middleware/error.middleware";
import { query } from "./db";

const app = express();
app.set("trust proxy", 1);
app.use(helmet());

const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  `http://localhost:3000`,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (incomingOrigin, callback) => {
      if (!incomingOrigin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(incomingOrigin)) {
        return callback(null, true);
      }
      return callback(
        new Error(
          `CORS policy violation: Origin ${incomingOrigin} not allowed`
        ),
        false
      );
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(
  rateLimit({
    windowMs: 60_000,
    max: 100,
  })
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/dentists", dentistRoutes);
app.use("/api/appointments", requireAuth, appointmentRoutes);

app.use(errorHandler);

(async () => {
  try {
    const res = await query("SELECT NOW()");
    console.log("DB connected:", res.rows[0]);
  } catch (err) {
    console.error("DB error:", err);
    process.exit(1);
  }
})();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

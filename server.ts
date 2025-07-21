import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { json } from "body-parser";
import { errorHandler } from "./middleware/error.middleware";
import authRoutes from "./routes/auth";
import apptRoutes from "./routes/appointments";

const app = express();

// Global middleware
app.use(helmet());
app.use(cors({ origin: /* your front-end URL */ }));
app.use(json());
app.use(rateLimit({ windowMs: 60_000, max: 100 })); // 100 req/min

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", apptRoutes);

// Error handler (must come last)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

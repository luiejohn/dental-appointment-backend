import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
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
app.use("/api/auth", authRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Auth server running on http://localhost:${PORT}`);
});

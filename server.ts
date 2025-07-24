import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { json } from "body-parser";
import { errorHandler } from "./src/middleware/error.middleware";
import authRoutes from "./src/routes/auth";
import apptRoutes from "./src/routes/appointments";

const app = express();

const allowedOrigins = [process.env.FRONTEND_URL!, process.env.CLOUDFRONT_URL!];

app.use(
  cors({
    origin: (incomingOrigin, callback) => {
      if (!incomingOrigin) return callback(null, true);

      if (allowedOrigins.includes(incomingOrigin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS: Unauthorized origin ${incomingOrigin}`),
        false
      );
    },
    credentials: true,
  })
);

app.use(helmet());
app.use(json());
app.use(rateLimit({ windowMs: 60_000, max: 100 }));

app.use("/api/auth", authRoutes);
app.use("/api/appointments", apptRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

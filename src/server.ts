import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import swaggerUi from "swagger-ui-express";

import authRoutes from "./routes/auth";
import dentistRoutes from "./routes/dentists";
import appointmentRoutes from "./routes/appointments";
import { requireAuth } from "./middleware/auth.middleware";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
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

app.use("/api/auth", authRoutes);
app.use("/api/dentists", dentistRoutes);
app.use("/api/appointments", requireAuth, appointmentRoutes);

const specPath = path.join(__dirname, "./docs/openapi.yaml");
const openapiSpec = yaml.load(fs.readFileSync(specPath, "utf8"));
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(openapiSpec as Record<string, unknown>, { explorer: true })
);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📖 Swagger UI available at http://localhost:${PORT}/api/docs`);
});

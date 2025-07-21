import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import appointmentController from "../controller/appointment.controller";

const router = Router();
router.use(requireAuth);
router.use("/", appointmentController);
export default router;

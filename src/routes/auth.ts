import { Router } from "express";
import authRouter from "../controller/auth.controller";

const router = Router();
router.use("/", authRouter);
export default router;

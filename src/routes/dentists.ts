import { Router } from "express";
import dentistController from "../controller/dentist.controller";

const router = Router();

router.use("/", dentistController);

export default router;

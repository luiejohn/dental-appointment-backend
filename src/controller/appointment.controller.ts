import { Router, Response, NextFunction } from "express";
import AppointmentService from "../services/appointment.service";
import { AuthRequest } from "../middleware/auth.middleware";

const appointmentRouter = Router();
const svc = AppointmentService;

appointmentRouter.post(
  "/",
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { dentistId, startTs, endTs } = req.body;

      const appt = await svc.book(req.userId!, dentistId, startTs, endTs);

      res.status(201).json(appt);
    } catch (err) {
      next(err);
    }
  }
);

appointmentRouter.get(
  "/",
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const list = await svc.list(req.userId!);
      res.json(list);
    } catch (err) {
      next(err);
    }
  }
);

appointmentRouter.get("/availability", async (req: AuthRequest, res, next) => {
  try {
    const { dentistId, date } = req.query as {
      dentistId: string;
      date: string;
    };

    if (!dentistId || !date) {
      return res.status(400).json({ error: "dentistId & date are required" });
    }

    const slots = await AppointmentService.availability(dentistId, date);

    res.json(slots);
  } catch (err) {
    next(err);
  }
});

appointmentRouter.put(
  "/:id",
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { startTs, endTs } = req.body;

      const updated = await svc.reschedule(
        req.userId!,
        req.params.id,
        startTs,
        endTs
      );

      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

appointmentRouter.delete(
  "/:id",
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await svc.cancel(req.userId!, req.params.id);

      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

export default appointmentRouter;

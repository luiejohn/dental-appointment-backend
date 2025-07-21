import { Router, Request, Response, NextFunction } from "express";
import DentistService from "../services/dentist.service";
import { requireAuth } from "../middleware/auth.middleware";

const dentistRouter = Router();
const svc = DentistService;

dentistRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const list = await svc.listDentists();
      res.json(list);
    } catch (err) {
      next(err);
    }
  }
);

dentistRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dentist = await svc.getDentist(req.params.id);
      res.json(dentist);
    } catch (err) {
      next(err);
    }
  }
);

dentistRouter.post(
  "/",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, specialization, profilePhotoUrl } = req.body;
      const dentist = await svc.createDentist({
        name,
        specialization,
        profilePhotoUrl,
      });
      res.status(201).json(dentist);
    } catch (err) {
      next(err);
    }
  }
);

dentistRouter.put(
  "/:id",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const updated = await svc.updateDentist(req.params.id, data);
      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

dentistRouter.delete(
  "/:id",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await svc.deleteDentist(req.params.id);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);

export default dentistRouter;

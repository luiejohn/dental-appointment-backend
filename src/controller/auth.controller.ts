import { Router, Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service";
import { requireAuth, AuthRequest } from "../middleware/auth.middleware";

const authRouter = Router();

authRouter.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = await AuthService.register(req.body);
      res.status(201).json(dto);
    } catch (err) {
      next(err);
    }
  }
);

authRouter.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const token = await AuthService.login(email, password);
      res.json({ token });
    } catch (err) {
      next(err);
    }
  }
);

authRouter.get(
  "/me",
  requireAuth,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const profile = await AuthService.getProfile(req.userId!);
      res.json(profile);
    } catch (err) {
      next(err);
    }
  }
);

export default authRouter;

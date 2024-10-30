import { Router, Request, Response, NextFunction } from "express";

import userController from "../controllers/userController";

const userRouter = Router();

userRouter.post("/", userController.updateSession, userController.syncProfile, (_req: Request, _res: Response, next: NextFunction) => {

  return next();

})

export default userRouter;
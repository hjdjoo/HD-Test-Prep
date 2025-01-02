import { Router, Request, Response, NextFunction } from "express";

import mailController from "../controllers/mailController";

const mailRouter = Router();

mailRouter.post("/send/:id",
  mailController.savePdf,
  mailController.sendEmail,
  (req: Request, res: Response, next: NextFunction) => {



  })

export default mailRouter;
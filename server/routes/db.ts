import { Request, Response, Router } from "express";
import dbController from "../controllers/dbController";
import userController from "../controllers/userController";
const dbRouter = Router();

dbRouter.get("/questions/",
  userController.updateSession,
  dbController.getQuestions,
  dbController.snakeToCamel,
  (_req: Request, res: Response) => {

    const { clientData } = res.locals;

    res.status(200).json(clientData);

  })

dbRouter.get("/categories",
  userController.updateSession,
  dbController.getCategories,
  dbController.snakeToCamel,
  (_req: Request, res: Response) => {

    const { clientData } = res.locals;

    res.status(200).json(clientData);
  })
dbRouter.get("/problemTypes",
  userController.updateSession,
  dbController.getProblemTypes,
  dbController.snakeToCamel,
  (_req: Request, res: Response) => {

    const { clientData } = res.locals;

    res.status(200).json(clientData);
  })

dbRouter.post("/")

export default dbRouter;
import { Request, Response, Router } from "express";
import dbController from "../controllers/dbController";

const dbRouter = Router();

dbRouter.get("/questions/",
  dbController.getQuestions,
  dbController.snakeToCamel,
  (_req: Request, res: Response) => {

    const { clientData } = res.locals;

    res.status(200).json(clientData);

  })

dbRouter.post("/")

export default dbRouter;
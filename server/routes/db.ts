import { Request, Response, Router } from "express";
import dbController from "../controllers/dbController";
// import userController from "../controllers/userController";
const dbRouter = Router();

dbRouter.get("/questions/",
  dbController.getQuestions,
  dbController.snakeToCamel,
  (_req: Request, res: Response) => {

    const { clientData } = res.locals;

    res.status(200).json(clientData);

  })

dbRouter.get("/categories",
  dbController.getCategories,
  dbController.snakeToCamel,
  (_req: Request, res: Response) => {

    const { clientData } = res.locals;

    res.status(200).json(clientData);
  })

dbRouter.get("/problemTypes",
  dbController.getProblemTypes,
  dbController.snakeToCamel,
  (_req: Request, res: Response) => {

    const { clientData } = res.locals;

    res.status(200).json(clientData);
  })

dbRouter.get("/tags",
  dbController.getTags,
  dbController.createTagsObj,
  (_req: Request, res: Response) => {

    const { clientData } = res.locals;

    res.status(200).json(clientData);

  }
)

dbRouter.post("/tags",
  dbController.addTag,
  (_req: Request, res: Response) => {

    const { clientData } = res.locals;
    res.status(200).json(clientData);

  })

dbRouter.post("/feedback",
  dbController.addNewTags,
  dbController.addFeedbackImage,
  dbController.addFeedback,
  (_req: Request, res: Response) => {

    const { clientData } = res.locals;
    res.status(200).json(clientData);

  }
);

export default dbRouter;
import { Request, Response, NextFunction } from "express";

interface IdbController {
  [middleware: string]: (req: Request, res: Response, next: NextFunction) => void
}

const dbController: IdbController = {};

// dbController.uploadFiles = async (req: Request, res: Response, next: NextFunction) => {


// }


export default dbController;
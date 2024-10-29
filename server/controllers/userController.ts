import { Request, Response, NextFunction } from "express";

import createClient from "#root/utils/supabase/server";
console.log("entered userController")

interface UserController {
  [middleware: string]: (req: Request, res: Response, next: NextFunction) => void
}

const userController: UserController = {};

userController.syncProfile = async (req: Request, res: Response, next: NextFunction) => {

  console.log(req.cookies);
  const supabase = createClient(req, res);

  const { data, error } = await supabase
    .auth
    .getUser();

  console.log(data, error);


  return next();

}

userController.initProfile = (req: Request, res: Response, next: NextFunction) => {


}

// userController.signUp = (req: Request, res: Response, next: NextFunction) => {


// }

// userController.signInWithEmail = (req: Request, res: Response, next: NextFunction) => {


// }

// userController.signInWithOauth = (req: Request, res: Response, next: NextFunction) => {


// }


export default userController;
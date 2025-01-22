import { Request, Response, NextFunction } from "express";
import createClient from "@/utils/supabase/server";
import createServiceClient from "@/utils/supabase/service";

// import HMACSH

import { type User } from "@supabase/supabase-js";
import { ServerError } from "../_types/server-types";
// import createSupabase from "@/utils/supabase/server";

console.log("entered userController");

interface UserController {
  [middleware: string]: (req: Request, res: Response, next: NextFunction) => void
}

const userController: UserController = {};


userController.checkTokens = async (req: Request, _res: Response, next: NextFunction) => {
  try {

    // check if there are tokens in cookies. If not, check the body.
    const { cookies } = req;
    // console.log("cookies", cookies);
    if (cookies.accessToken && cookies.refreshToken) {
      console.log("tokens detected in cookies. Continuing..")
      return next();
    }


  }
  catch (e) {

    console.error(e);

    const error: ServerError = {
      log: "userController: Error while checking tokens",
      status: 401,
      message: {
        error: `${e}`
      }
    }

    return next(error);

  }

}


userController.getUser = async (req: Request, res: Response, next: NextFunction) => {

  console.log("getting user...")

  try {
    // console.log(req.cookies);
    const supabase = createClient({ req, res });

    const { data: authData, error: authError } = await supabase
      .auth
      .getUser();

    if (authError) {
      throw new Error(`Couldn't get user from DB. ${authError.message}`)
    }
    // console.log(authData, error);

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("uid", authData.user.id)
      .single();

    if (profileError) {
      throw new Error(`Error while querying database for authorization: ${profileError.message}`)
    }

    if (!profileData) {
      console.log(`No user found in profiles database. Initializing profile.`);
      res.locals.user = authData.user;
      // should go to initProfile
      return next();
    }

    console.log("user found!")

    return res.status(200).json(profileData);

  } catch (e) {
    console.error(e);


    const error: ServerError = {
      log: "userController: Error while getting profile data",
      status: 500,
      message: {
        error: `${e}`
      }
    }

    return next(error);

    // return res.status(500).json("couldn't get profile data")

  }

}


userController.initProfile = async (_req: Request, res: Response, next: NextFunction) => {

  console.log("initializing profile...")

  try {

    const supabase = createServiceClient();

    // console.log(res.locals.user);
    const user = res.locals.user as User;

    const query = {
      role: "student",
      uid: user.id,
      name: user.user_metadata.full_name,
      email: user.email
    };

    const { data, error } = await supabase
      .from("profiles")
      .upsert(query)
      .select();

    if (!data) {
      throw new Error(`Couldn't initialize profile. ${error.message}`)
    }

    res.status(200).json("profile created");

  } catch (e) {

    const error: ServerError = {
      log: "userController: Error while initializing profile",
      status: 401,
      message: {
        error: `${e}`
      }
    }

    return next(error);

    // res.status(500).json(`Server error while initializing profile. ${e}`)

  }

}

// userController.signUp = (req: Request, res: Response, next: NextFunction) => {


// }

// userController.signInWithEmail = (req: Request, res: Response, next: NextFunction) => {


// }

// userController.signInWithOauth = (req: Request, res: Response, next: NextFunction) => {


// }


export default userController;
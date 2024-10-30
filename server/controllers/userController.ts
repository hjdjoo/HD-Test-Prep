import { Request, Response, NextFunction } from "express";

import createClient from "#root/utils/supabase/server";
console.log("entered userController")

interface UserController {
  [middleware: string]: (req: Request, res: Response, next: NextFunction) => void
}

const userController: UserController = {};

userController.syncProfile = async (req: Request, res: Response, next: NextFunction) => {

  try {
    // console.log(req.cookies);
    const { accessToken } = req.body;

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
      .eq("uid", authData.user.id);



    return next();
  } catch (e) {
    console.error(e);
    res.status(500).json("couldn't sync profile data")

  }

}

userController.updateSession = async (req: Request, res: Response, next: NextFunction) => {

  try {
    // console.log(req.body);
    const supabase = createClient({ req, res });

    const { accessToken, refreshToken } = req.body;

    if (!accessToken || !refreshToken) {
      res.status(401);
      return next();
    }
    // console.log(accessToken, refreshToken);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
      sameSite: "strict"
    })
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
      sameSite: "strict"
    })

    const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })

    if (error) {
      throw new Error(`error setting server session: ${error.message}`)
    }
    console.log("Server Supabase session set")

    return next();
  } catch (e) {
    console.error(e);
    res.status(500).json("Something went wrong while updating session")
  }

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
import { Request, Response, NextFunction } from "express";
import createClient from "@/utils/supabase/server";
import createServiceClient from "@/utils/supabase/service";

// import HMACSH

import { type User } from "@supabase/supabase-js";
// import createSupabase from "@/utils/supabase/server";

console.log("entered userController");

interface UserController {
  [middleware: string]: (req: Request, res: Response, next: NextFunction) => void
}

const userController: UserController = {};


userController.checkTokens = async (req: Request, res: Response, next: NextFunction) => {

  // first, check the body of the request (this means a "SIGNED_IN" event was triggered and this should be a new session.)
  const { accessToken, refreshToken } = req.body;

  if (accessToken && refreshToken) {
    console.log("auth tokens found in request body. saving to cookies...")
    // We set the request cookies for the supabase client to set session.
    req.cookies.accessToken = accessToken;
    req.cookies.refreshToken = refreshToken;
    // And update the response cookies for storage.
    res.cookie("accessToken", accessToken);
    res.cookie("refreshToken", refreshToken);
    return next();
  }

  // If there's nothing in the body, then use tokens from the cookies.
  const { cookies } = req;
  if (cookies.accessToken && cookies.refreshToken) {
    console.log("tokens detected in cookies. Continuing..")
    return next();
  }

  return res.status(401).json("No auth tokens found.")

  // Code below should no longer be needed since updating the cookie flow.
  // let authToken = "";

  // Object.keys(cookies).forEach((key) => {
  //   if (key.startsWith("sb-") && key.includes("auth-token")) {
  //     authToken = authToken.concat(cookies[key]);
  //   }
  // })

  // // if we were able to get something from the auth token, check it for the access and refresh tokens and set it to the request cookies.
  // if (authToken) {
  //   authToken = authToken.replace("base64-", "");

  //   const decoded = Buffer.from(authToken, "base64").toString("utf-8");

  //   const tokenData = JSON.parse(decoded);

  //   console.log(tokenData.access_token)

  //   if (!tokenData.access_token || !tokenData.refresh_token) {
  //     return res.status(401).json("no auth tokens detected");
  //   }

  //   req.cookies.accessToken = tokenData.access_token;
  //   req.cookies.refreshToken = tokenData.refresh_token;

  //   return next();
  // } else {
  //   return res.status(401).json("no auth tokens detected");
  // }

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
    return res.status(500).json("couldn't get profile data")

  }

}


userController.initProfile = async (req: Request, res: Response, _next: NextFunction) => {

  console.log("initializing profile...")

  try {

    const supabase = createServiceClient({ req, res });

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

    res.status(500).json(`Server error while initializing profile. ${e}`)

  }

}

// userController.signUp = (req: Request, res: Response, next: NextFunction) => {


// }

// userController.signInWithEmail = (req: Request, res: Response, next: NextFunction) => {


// }

// userController.signInWithOauth = (req: Request, res: Response, next: NextFunction) => {


// }


export default userController;
import { Request, Response, NextFunction } from "express";
import { Tables } from "@/database.types";
import { camelCase, snakeCase } from "change-case/keys";
import { CamelCasedProperties, SnakeCasedProperties } from "type-fest";

import { NewProfileForm } from "@/src/pages/admin/components/Admin.AddProfileForm"

import createSupabase from "@/utils/supabase/server";

import { ServerError } from "../_types/server-types";

const profileController:
  { [middleware: string]: (req: Request, res: Response, next: NextFunction) => void } = {};

export type DbStudentData = Tables<"profiles">
export type DbInstructorData = Tables<"tutors">

profileController.getStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supabase = createSupabase({ req, res });

    const { data, error } = await supabase
      .from("profiles")
      .select();

    if (error) {
      console.error(error);
      console.error(error.details);
      throw new Error(error.message);
    }

    console.log(data);

    const clientData = data.map(row => {
      return camelCase(row) as CamelCasedProperties<typeof row>
    })

    res.locals.clientData = clientData;

    return next();

  } catch (e) {

    const error: ServerError = {
      log: "profileController: Error while getting student profiles",
      status: 500,
      message: {
        error: `${e}`
      }
    }

    return next(error);
  }
};

profileController.getInstructors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supabase = createSupabase({ req, res });

    const { data, error } = await supabase
      .from("tutors")
      .select("*");

    if (error) {
      console.error(error);
      console.error(error.details);
      throw new Error(error.message);
    }

    const clientData = data.map(row => {
      return camelCase(row) as CamelCasedProperties<typeof row>
    })

    res.locals.clientData = clientData;

    return next();


  } catch (e) {

    const error: ServerError = {
      log: "profileController: Error while getting instructor profiles",
      status: 500,
      message: {
        error: `${e}`
      }
    }

    return next(error);

  }
}

profileController.addProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { firstName, lastName, fullName, email, role }: NewProfileForm = req.body;

    if (!role) {
      throw new Error("No role detected; no user added.")
    }

    // console.log(query);
    const query = {
      first_name: firstName,
      last_name: lastName,
      name: fullName,
      email: email,
      role: role
    }

    const supabase = createSupabase({ req, res });

    const { error } = await supabase
      .from("profiles")
      .insert(query);

    if (error) {
      console.error(error);
      console.error(error.details);
      throw new Error(error.message);
    }

    return next();

  } catch (e) {

    const error: ServerError = {
      log: "profileController: Error while adding profile to DB",
      status: 500,
      message: {
        error: `${e}`
      }
    }
    return next(error);
  }
}

profileController.addInstructor = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { name, email }: { name: string, email: string } = req.body;

    const supabase = createSupabase({ req, res });

    const { error } = await supabase
      .from("tutors")
      .insert({ name: name, email: email });

    if (error) {
      console.error(error);
      console.error(error.details);
      throw new Error(error.message);
    }

    return next();

  } catch (e) {

    const error: ServerError = {
      log: "profileController: Error while adding instructor to DB",
      status: 500,
      message: {
        error: `${e}`
      }
    }
    return next(error);
  }
}

profileController.linkInstructor = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { studentId, instructorId }: { studentId: number, instructorId: number } = req.body;

    const supabase = createSupabase({ req, res });

    const { error } = await supabase
      .from("profiles")
      .update({ "instructor_id": instructorId })
      .eq("id", studentId)

    if (error) {
      console.error(error);
      console.error(error.details);
      throw new Error(error.message);
    }

    return next();

  } catch (e) {

    const error: ServerError = {
      log: "profileController: Error while linking instructor to student profile",
      status: 500,
      message: {
        error: `${e}`
      }
    }
    return next(error);
  }
}

export default profileController;
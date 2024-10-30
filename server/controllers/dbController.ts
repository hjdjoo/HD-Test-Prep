import { Request, Response, NextFunction } from "express";
import { camelCase } from "change-case/keys"
// import createSupabase from "@/utils/supabase/client.ts"
import createSupabase from "#root/utils/supabase/server"
import { Database } from "@/database.types";
import { CamelCasedProperties } from "type-fest"

interface DbController {
  [middleware: string]: (req: Request, res: Response, next: NextFunction) => void
}

type DbQuestionData = Database["public"]["Tables"]["math_problems"]["Row"]

const dbController: DbController = {};

// dbController.uploadFiles = async (req: Request, res: Response, next: NextFunction) => {

// }

dbController.getQuestions = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const supabase = createSupabase({ req, res });

    const { data, error } = await supabase
      .from("math_problems")
      .select("*");

    if (!data) {
      throw new Error(`Error while querying database from controller: ${error.message}`)
    }
    if (!data.length) {
      throw new Error(`No data returned from Database. Have you checked RLS policies?`)
    }

    res.locals.dbData = data
    return next();

  } catch (e) {
    res.status(500).json(`${e}`);
  }

}

dbController.snakeToCamel = (_req: Request, res: Response, next: NextFunction) => {

  const dbData = res.locals.dbData as DbQuestionData[]

  const clientData = dbData.map(row => {

    return camelCase(row) as CamelCasedProperties<typeof row>

  });

  delete res.locals.dbData;

  res.locals.clientData = clientData;

  // console.log("dbController.snakeToCamel/res.locals: ", res.locals);

  return next();
}


export default dbController;
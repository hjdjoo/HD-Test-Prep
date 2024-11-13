import { Request, Response, NextFunction } from "express";
import { camelCase } from "change-case/keys"
// import createSupabase from "@/utils/supabase/client.ts"
import createSupabase from "@/utils/supabase/server"
import { Database } from "@/database.types";
import { CamelCasedProperties } from "type-fest"

console.log("entered DB controller")

interface DbController {
  [middleware: string]: (req: Request, res: Response, next: NextFunction) => void
}

type DbQuestionData = Database["public"]["Tables"]["math_problems"]["Row"]

type DbTagsData = Database["public"]["Tables"]["tags"]["Row"]

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

dbController.getCategories = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const supabase = createSupabase({ req, res });

    const { data, error } = await supabase
      .from("categories")
      .select("*");

    if (!data) {
      throw new Error(`Error while querying database from controller: ${error.message}`)
    }
    if (!data.length) {
      throw new Error(`No data returned from Database. Have you checked RLS policies?`)
    }
    // console.log("dbController.getCategories/data: ", data)

    res.locals.dbData = data
    return next();

  } catch (e) {
    res.status(500).json(`${e}`);
  }
}

dbController.getProblemTypes = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const supabase = createSupabase({ req, res });

    const { data, error } = await supabase
      .from("problem_types")
      .select("*");

    if (!data) {
      throw new Error(`Error while querying database from controller: ${error.message}`)
    }
    if (!data.length) {
      throw new Error(`No data returned from DB. Have you checked RLS policies?`)
    }
    // console.log("dbController.getProblemTypes/data: ", data)

    res.locals.dbData = data
    return next();

  } catch (e) {
    console.error("dbController/getProblemTypes/error: ", e);
    res.status(500).json(`${e}`);
  }
}

dbController.addTag = async (req: Request, res: Response, _next: NextFunction) => {

  try {

    const supabase = createSupabase({ req, res });

    const tag: { name: string } = req.body;

    console.log(tag);

    const { data, error } = await supabase
      .from("tags")
      .insert({ tag_name: tag.name })
      .select("id")
      .single();

    if (!data) {
      throw new Error(`${error.message}`)
    }

    res.status(200).json(data);


  } catch (e) {

    console.error(e);
    res.status(500).json(`Error while adding tag to DB: ${e}`);
  };

}

dbController.getTags = async (req: Request, res: Response, next: NextFunction) => {

  try {

    const supabase = createSupabase({ req, res });

    const { data, error } = await supabase
      .from("tags")
      .select("*")

    if (!data) {
      throw new Error(`${error.message}`)
    }

    if (!data.length) {
      throw new Error("No rows returned from DB. Have you checked RLS policies?")
    }

    // console.log("data: ", data)
    // console.log("error: ", error)

    res.locals.tagsData = data;

    return next();

  } catch (e) {
    console.error(e);
    res.status(500).json(`Error while getting tags from DB: ${e}`)
  }

}

dbController.snakeToCamel = (_req: Request, res: Response, next: NextFunction) => {

  const dbData = res.locals.dbData as DbQuestionData[]

  // console.log("before convert: ", typeof dbData[0].category)

  const clientData = dbData.map(row => {

    return camelCase(row) as CamelCasedProperties<typeof row>

  });

  delete res.locals.dbData;

  // console.log("after convert: ", typeof clientData[0].category)

  res.locals.clientData = clientData;

  // console.log("dbController.snakeToCamel/res.locals: ", res.locals);

  return next();
}

dbController.createTagsObj = (_req: Request, res: Response, next: NextFunction) => {

  const tagsData = res.locals.tagsData as DbTagsData[];

  const tagsObject: { [tag: string]: number } = {}

  tagsData.forEach(row => {
    tagsObject[row.tag_name] = row.id
  });

  delete res.locals.tagsData;

  res.locals.clientData = tagsObject;

  return next();

}


export default dbController;
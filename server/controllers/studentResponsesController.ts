import { Request, Response, NextFunction } from "express";
import { snakeCase, camelCase } from "change-case/keys"
// import createSupabase from "@/utils/supabase/client.ts"
import createSupabase from "@/utils/supabase/server"
import { SnakeCasedProperties, CamelCasedProperties } from "type-fest"
import type { StudentResponse } from "@/src/containers/question/QuestionContainer.tsx"

console.log("entering Student Response Controller")

interface StudentResponsesController {
  [middleware: string]: (req: Request, res: Response, next: NextFunction) => void
}

const studentResponsesController: StudentResponsesController = {};

studentResponsesController.getResponses = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { query } = req;

    const ids = query.ids as string

    console.log("studentResponsesController.getResponses/query: ", ids);
    if (!ids) {
      return res.status(500).json("No query parameters were detected")
    }
    if (!ids.length) {
      console.log("no ids to query")
      return next();
    }

    const dbQuery = ids.split(",");

    console.log(dbQuery);

    const supabase = createSupabase({ req, res });

    const { data, error } = await supabase
      .from("student_responses")
      .select("*")
      .in("id", dbQuery);

    if (error) {
      console.error(error);
      return res.status(500).json(`Error while getting student responses: ${error.message}`);
    }

    const clientData = data.map(row => {
      return camelCase(row) as CamelCasedProperties<typeof row>
    })

    res.locals.clientData = clientData;

    return next();


  } catch (e) {
    console.error(e);
    return res.status(500).json(`Something went wrong while getting responses: ${e}`)
  }
}

studentResponsesController.addStudentResponse = async (req: Request, res: Response, next: NextFunction) => {

  try {
    console.log("adding student response...")

    const { body: studentResponse }: { body: StudentResponse } = req;

    const supabase = createSupabase({ req, res })

    const query = snakeCase(studentResponse) as SnakeCasedProperties<typeof studentResponse>;

    const { data, error } = await supabase
      .from("student_responses")
      .insert(query)
      .select("id")
      .single();

    if (error) {
      console.error(error);
      throw new Error(`${error.message}`)
    }

    console.log("studentResController/addStudentResponse/data: ", data)

    res.locals.clientData = data;

    return next();

  } catch (e) {
    console.error(e);
    return res.status(500).json(`Something went wrong while adding student response to DB: ${e}`)

  }

}


export default studentResponsesController;

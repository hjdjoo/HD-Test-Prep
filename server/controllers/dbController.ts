import { Request, Response, NextFunction } from "express";
import { camelCase, snakeCase } from "change-case/keys"
// import createSupabase from "@/utils/supabase/client.ts"
import createSupabase from "@/utils/supabase/server"
import createServiceClient from "@/utils/supabase/service";
import { Database } from "@/database.types";
import { CamelCasedProperties, SnakeCasedProperties } from "type-fest"
import type { StudentResponse } from "@/src/containers/question/QuestionContainer.tsx"
import { decode } from "base64-arraybuffer";

// types from client
import type { FeedbackForm, ImageData } from "@/src/components/practice/Practice.feedback";
// import StudentResponse
import { Question } from "@/src/stores/questionStore";


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

dbController.addNewTags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { newTags, feedbackForm }: { newTags: string[], feedbackForm: FeedbackForm } = req.body;

    console.log("dbController/addNewTags/newTags: ", newTags);

    if (!newTags || !newTags.length) {
      return next();
    }

    const supabase = createSupabase({ req, res });

    const query = newTags.map(tag => {
      return { tag_name: tag }
    })

    const { data, error } = await supabase
      .from("tags")
      .insert(query)
      .select("id");

    if (error) {
      return res.status(500).json("Error while adding new tags to DB.")
    }

    if (!data.length) {
      return res.status(500).json("No rows returned from DB. Check RLS Policies")
    }

    console.log("tag data: ", data);

    const newTagIds = data.map(row => {
      return row.id;
    })

    feedbackForm.tags = feedbackForm.tags.concat(newTagIds);

    // console.log(feedbackForm.tags);
    console.log("request body feedback form: ", req.body.feedbackForm);

    return next();
  } catch (e) {
    console.error(e);
    return res.status(500).json(`${e}`);
  }

}

dbController.addFeedbackImage = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { feedbackForm, imageData }:
      { feedbackForm: FeedbackForm, imageData: ImageData } = req.body

    if (!imageData || !imageData.fileData || !feedbackForm) {
      return next();
    }

    const { fileName, fileData, fileType } = imageData;

    // console.log(decode(fileData));

    const ext = fileType.replace("image/", "");

    const fileNameFull = `${fileName}.${ext}`;

    const rawFileData = fileData.replace(/^(data.*base64,)/g, "");

    console.log(fileNameFull);

    const supabase = createSupabase({ req, res });

    const { error } = await supabase
      .storage
      .from("student_feedback_files")
      .upload(fileNameFull, decode(rawFileData), {
        contentType: fileType
      });

    if (error) {
      console.error(error);
      throw new Error(error.message);
    };

    return next();

  } catch (e) {
    console.error(e);
    return res.status(500).json("Something went wrong while adding image file to storage")
  }

}

dbController.addFeedback = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { feedbackForm, imageData }: { feedbackForm: FeedbackForm, imageData: ImageData } = req.body;

    if (!feedbackForm) {
      return res.status(500).json("No feedback form to upload");
    }

    const supabase = createSupabase({ req, res });

    const { fileName, fileType } = imageData;
    const ext = fileType.replace("image/", "");
    const fileNameFull = `${fileName}.${ext}`;

    const { data: urlData, error: urlError } = await supabase
      .storage
      .from("student_feedback_files")
      .createSignedUrl(fileNameFull, 60 * 60 * 24 * 365);

    if (urlError) {
      console.error(urlError);
      throw new Error(urlError.message);
    }

    feedbackForm.imageUrl = urlData.signedUrl;

    const dbQuery = snakeCase(feedbackForm) as SnakeCasedProperties<typeof feedbackForm>;


    const { data, error } = await supabase
      .from("question_feedback")
      .insert(dbQuery)
      .select("id")
      .single();

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    res.locals.clientData = { id: data.id }

    return next();
    // const supabase = createSupabase({ req, res });
  } catch (e) {
    console.error(e);
    return res.status(500).json("Something went wrong while adding feedback to DB.")
  }

}

dbController.updateQuestion = async (req: Request, res: Response, next: NextFunction) => {

  try {

    const supabase = createServiceClient();

    const { feedbackForm, question }: { feedbackForm: FeedbackForm, question: Question } = req.body

    const { tags } = feedbackForm;
    console.log("updateQuestion/tags: ", tags);

    const updatedTags = question.tags as { [key: string]: number };

    for (let tag of tags) {

      const tagString = String(tag);

      if (!updatedTags[tagString]) {
        updatedTags[tagString] = 1;
      } else {
        updatedTags[tagString] = updatedTags[tag] + 1;
      }

    };

    // question.tags = JSON.stringify(updatedTags);

    console.log("updated question: ", question);

    const dbQuery = snakeCase(question) as SnakeCasedProperties<typeof question>

    const { error } = await supabase
      .from("math_problems")
      .update(dbQuery)
      .eq("id", question.id)

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    res.locals.clientData.updatedQuestion = question;

    return next();

  } catch (e) {
    console.error(e);
    return res.status(500).json(`Something went wrong while updating question. ${e}`)
  }

}

dbController.addStudentResponse = async (req: Request, res: Response, _next: NextFunction) => {

  try {

    const { body: studentResponse }: { body: StudentResponse } = req;

    const supabase = createSupabase({ req, res })

    const query = snakeCase(studentResponse) as SnakeCasedProperties<typeof studentResponse>;

    const { error } = await supabase
      .from("student_responses")
      .insert(query)

    if (error) {
      console.error(error);
      throw new Error(`${error.message}`)
    }

    return res.status(200).json("Successfully added student response to DB.")


  } catch (e) {
    console.error(e);
    return res.status(500).json(`Something went wrong while adding student response to DB: ${e}`)

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
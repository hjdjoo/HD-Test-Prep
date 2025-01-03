import { Request, Response, NextFunction } from "express"
import * as nodemailer from "nodemailer";
import * as fs from "fs";
import path from "path";
import createSupabase from "@/utils/supabase/server";
import { decode } from "base64-arraybuffer";
import { ServerError } from "../_types/server-types";

const MG_DOMAIN = process.env.MG_DOMAIN!;
const MG_SENDING_API_KEY = process.env.MG_SENDING_API_KEY!;
const MG_SMTP_USER = process.env.MG_SMTP_USER!;
const MG_SMTP_PASSWORD = process.env.MG_SMTP_PASSWORD!;

const transport = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  auth: {
    user: MG_SMTP_USER,
    pass: MG_SMTP_PASSWORD
  }
})

interface MailController {
  [middleware: string]: (req: Request, res: Response, next: NextFunction) => void
}

const mailController: MailController = {};

mailController.extractPdf = async (req: Request, res: Response, next: NextFunction) => {
  try {

    console.log("extracting pdf...")

    const { id } = req.params;

    const data: Buffer[] = [];

    req.on("data", (chunk) => {
      data.push(chunk)
    })

    req.on("end", () => {

      const pdfBuffer = Buffer.concat(data);

      const base64Pdf = pdfBuffer.toString("base64");

      fs.writeFileSync(path.resolve("./", "server", "pdfs", `session-summary-${id}.pdf`), pdfBuffer);

      res.locals.clientData = {
        id: id,
        base64Pdf: base64Pdf
      }
      console.log("saved pdf to res.locals")

      return next();

    })

  } catch (e) {

    const error: ServerError = {
      log: "Something went wrong while extracting pdf.",
      status: 500,
      message: {
        error: `Middleware error occurred while extracting pdf. ${e}`
      }
    }

    return next(error);

  }
}


mailController.uploadPdf = async (req: Request, res: Response, next: NextFunction) => {

  try {

    console.log("uploading pdf..")

    const clientData = res.locals.clientData as
      { id: string, base64Pdf: string };

    const { id, base64Pdf } = clientData;

    const supabase = createSupabase({ req, res })

    const { error } = await supabase
      .storage
      .from("student_reports")
      .upload(`session_summary_${id}.pdf`,
        decode(base64Pdf),
        { contentType: "application/pdf" });

    if (error) {
      console.error(error.cause);
      console.error(error.message);
      throw new Error(error.message);
    }

    console.log("successfully uploaded file to db.");

    return next();

  } catch (e) {

    const error: ServerError = {
      log: "Something went wrong while uploading pdf.",
      status: 500,
      message: {
        error: `Middleware error occurred while uploading pdf to db. ${e}`
      }
    }

    return next(error);

  }
}

mailController.sendEmail = async (req: Request, res: Response, next: NextFunction) => {

  try {

    console.log("in sendEmail middleware");

    const supabase = createSupabase({ req, res });

    // const { data, error } = await supabase
    //   .from("profiles")
    //   .select()

    // const mailOptions = {
    //   from: "no-reply@hdprep.me",
    //   to: 
    // }

    // res.status(200).json("made it!")


  } catch (e) {

    const error: ServerError = {
      log: "Something went wrong while sending email.",
      status: 500,
      message: {
        error: `Middleware error occurred while sending email. ${e}`
      }
    }

    return next(error);

  }

}

export default mailController;
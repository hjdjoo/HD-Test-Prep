import { Request, Response, NextFunction } from "express"
import * as nodemailer from "nodemailer";
import * as fs from "fs";

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

mailController.savePdf = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { id } = req.params;


  } catch (e) {


  }
}


mailController.sendEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {





  } catch (e) {


  }

}

export default mailController;
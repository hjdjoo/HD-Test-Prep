import "dotenv/config"
import express, { Application, Request, Response } from "express";
import userRouter from "./routes/user";
import dbRouter from "./routes/db";
import cookieParser from "cookie-parser"

import userController from "./controllers/userController";

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET!

process.on('uncaughtException', function (err) {
  console.log(err);
});

const PORT = process.env.PORT || 3000;

const app: Application = express();

console.log("entered express server")

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(SUPABASE_JWT_SECRET))

app.use("/auth", userRouter);

app.use("/db", userController.checkTokens, dbRouter);

app.use("/*", (_req: Request, res: Response) => {

  res.status(404).json("Page was not found")

})

app.listen(PORT, () => {

  console.log(`Server listening on port ${PORT}`);

});
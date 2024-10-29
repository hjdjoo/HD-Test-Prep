import "dotenv/config"
import express, { Application, Request, Response } from "express";
// import * as path from "path";

import apiRouter from "./routes/api"
import userRouter from "./routes/user"

const PORT = process.env.PORT || 3000;

const app: Application = express();

console.log("entered express server")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/*", userRouter)

app.use("/api", apiRouter);

app.use("/*", (_req: Request, res: Response) => {

  res.status(404).json("Page was not found")

})

app.listen(PORT, () => {

  console.log(`Server listening on port ${PORT}`);

});
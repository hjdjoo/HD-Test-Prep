import "dotenv/config"
import express, { Application, Request, Response } from "express";
// import * as path from "path";

import dbRouter from "./routes/db";

const PORT = process.env.PORT || 3000;

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/db", dbRouter);

app.use("/api", (_req: Request, res: Response) => {

  res.status(200).json("Received")

})

app.use("/*", (_req: Request, res: Response) => {

  res.status(404).json("Page was not found")

})

app.listen(PORT, () => {

  console.log(`Server listening on port ${PORT}`);

});
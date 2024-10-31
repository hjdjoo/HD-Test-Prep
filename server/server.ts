import "dotenv/config"
import express, { Application, Request, Response } from "express";
// import cookie
// import * as path from "path";
import userRouter from "./routes/user";
import dbRouter from "./routes/db";

const PORT = process.env.PORT || 3000;

const app: Application = express();

console.log("entered express server")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", userRouter)

console.log('exited userRouter')
app.use("/db", dbRouter);


console.log('about to hit unknown route handler')
app.use("/*", (_req: Request, res: Response) => {

  res.status(404).json("Page was not found")

})

app.listen(PORT, () => {

  console.log(`Server listening on port ${PORT}`);

});
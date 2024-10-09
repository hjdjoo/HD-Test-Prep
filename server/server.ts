import "dotenv/config.js"
import express, { Application, Request, Response } from "express";

const PORT = process.env.VITE_PORT;

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded());

// app.use("/")

app.use("/*", (_req: Request, res: Response) => {

  res.status(404).json("Page was not found")

})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
});
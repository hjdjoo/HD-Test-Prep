import "dotenv/config"
import express, { Application, Request, Response } from "express";

const PORT = process.env.PORT;

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded());

app.use("/api", (_req: Request, res: Response) => {

  res.status(200).json("Received")
})

app.use("/*", (_req: Request, res: Response) => {

  res.status(404).json("Page was not found")

})

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
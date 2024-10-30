import { Router } from "express";
import dbRouter from "./db"
import userRouter from "./user";

console.log("entering api router...")
const router = Router();

router.use("/auth", userRouter);
router.use("/db", dbRouter);

export default router;
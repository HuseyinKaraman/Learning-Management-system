import express, { NextFunction, Request, Response } from "express";
import { PORT } from "./constants/environment.ts";
import config from "./config/index.ts";
import connectDB from "./config/db.config.ts";
import initializeRoutes from "./routes/index.ts";
const app = express();



app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  config(app);
  await connectDB();
  initializeRoutes(app);
});

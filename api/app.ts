import express, { NextFunction, Request, Response } from "express";
export const app = express();
import config from "./config/index.ts";

config(app);

// Routes
app.get("/healthcheck", (req:Request, res:Response, next:NextFunction) => {
    res.status(200).json({
        success: true,
        message: "Hello World!"
    })
})


app.all("*", (req:Request, res:Response, next:NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as any;
    err.status = 404;
    next(err);
}) 
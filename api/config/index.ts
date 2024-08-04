import express from "express";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import cors from "cors";
import {v2 as cloudinary} from "cloudinary";
import { PRODUCTION_SERVER_URL,DEVELOPMENT_SERVER_URL, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "../constants/environment.ts";


const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false
});

export default function (app: express.Application) {
    // cookie parser
    app.use(cookieParser());
    
    // cloudinary
    cloudinary.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET
    });

    // body parser
    app.use(express.json({limit: '50mb'}));
    app.use(express.urlencoded({limit: '50mb', extended: true}));
    
    // rate limiter
    app.use(limiter);

    // cors
    app.use(
        cors({
            origin: [
                `${PRODUCTION_SERVER_URL}`,
                `${DEVELOPMENT_SERVER_URL}`,
            ],
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'DELETE'],
            credentials: true,
        })
    );
}
import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors.middleware";
import  {CustomError} from "./errorHandler.middleware";
import { ACCESS_TOKEN_SECRET } from "../constants/environment";
import { verifyAccessToken } from "../utils/auth.utils";
import { redis } from "../config/redis";

// is user authenticated?
export const isAuthenticated = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;    

    if (!access_token) {
        return next(new CustomError("Please login to access this resource", 401));
    }

    const decoded = verifyAccessToken(access_token);

    if (!decoded) {
        return next(new CustomError("Please login to access this resource", 401));
    }

    const user = await redis.get(decoded.id);

    if (!user) {
        return next(new CustomError("Please login to access this resource", 401));
    }

    req.user = JSON.parse(user);

    next();
})


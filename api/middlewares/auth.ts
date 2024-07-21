import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors.middleware";
import  {CustomError} from "./errorHandler.middleware";
import { verifyAccessToken } from "../utils/auth.utils";
import { redis } from "../config/redis";
import { USER_ROLES } from "../constants/types";

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

// validate user role:
export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req?.user?.role || "" )) {
            return next(new CustomError(`Role : ${req.user?.role} is not allowed to access this resource`, 403));
        }
        next();
    }
}
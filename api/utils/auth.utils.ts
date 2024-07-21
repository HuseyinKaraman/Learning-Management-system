import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { IUser } from "../models/user.model";
import { ACCESS_TOKEN_EXPIRE, ACCESS_TOKEN_SECRET, ACTIVATION_SECRET, NODE_ENV, REFRESH_TOKEN_EXPIRE, REFRESH_TOKEN_SECRET } from "../constants/environment";
import { Response } from "express";
import { redis } from "../config/redis";


export const hashPassword= async (password:string)=>{
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

export const comparePassword= async (password:string, hash:string)=>{
    return await bcrypt.compare(password, hash);
}

interface IActivatinToken {
    token: string,
    activationCode: string
}

export const createActivationToken = (user: any):IActivatinToken => {
    const activationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const token = jwt.sign({
        user,activationCode
    }, ACTIVATION_SECRET as Secret, 
    { expiresIn: "5m" });
    return { token, activationCode };
}

export const verifyActivationToken = (activation_token:string) => {
    const user = jwt.verify(
        activation_token,
        ACTIVATION_SECRET as Secret
    ) as {user:IUser, activationCode:string};

    return user;
}


const signAccessToken = (id: string) => {
    return jwt.sign({ id: id }, ACCESS_TOKEN_SECRET || "", { expiresIn: "15m" });
}

const signRefreshToken = (id: string) => {
    return jwt.sign({ id }, ACCESS_TOKEN_SECRET || "", { expiresIn: "7d" });
}

export const verifyAccessToken = (access_token:string) => {
    return jwt.verify(access_token, ACCESS_TOKEN_SECRET as string) as JwtPayload;
}

export const verifyRefreshToken = (refresh_token:string) => {
    return jwt.verify(refresh_token, REFRESH_TOKEN_SECRET as string) as JwtPayload;
}


interface ITokenOptions {
   expires: Date,
   maxAge: number;
   httpOnly: boolean;
   sameSite: "lax" | "none" | "strict" | undefined;
   secure?: boolean;
}

export const sendToken = (user: IUser, statusCode: number, res:Response) => {
    const accessToken = signAccessToken(user._id as string);
    const refreshToken = signRefreshToken(user._id as string);
    
    // upload session to redis
    redis.set(user._id as string, JSON.stringify(user) as string);


    // parse environment variables to integrates with fallback values
    const accessTokenExpire = parseInt(ACCESS_TOKEN_EXPIRE || "300", 10);
    const refreshTokenExpire = parseInt(REFRESH_TOKEN_EXPIRE || "1200", 10);

    // options for cookies
    const accessTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + accessTokenExpire * 1000),
        maxAge: accessTokenExpire * 1000,
        httpOnly: true,
        sameSite: "lax",
    }

    const refreshTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + refreshTokenExpire * 1000),
        maxAge: refreshTokenExpire * 1000,
        httpOnly: true,
        sameSite: "lax",
    }

    // only set secure to true in production
    if (NODE_ENV === "production") {
        accessTokenOptions.secure = true;
    }

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);
    res.status(statusCode).json({
        success: true,
        user,
        accessToken,
    });
}
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user.model";
import { CustomError } from "../middlewares/errorHandler.middleware";
import { CatchAsyncError } from "../middlewares/catchAsyncErrors.middleware";
import { comparePassword, createActivationToken, hashPassword, sendToken, verifyActivationToken } from "../utils/auth.utils";
import {sendEmail} from "../services/email.service"
import { redis } from "../config/redis";


// register user
interface IRegistationBody {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password } = req.body;

      const isEmailExist = await User.findOne({ email });
      if (isEmailExist) {
        return next(new CustomError("Email already exists", 400));
      }

      const user: IRegistationBody = {
        username,
        email,
        password
      };

      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode

      const data = {user:{username:user?.username}, activationCode}

      try {
        await sendEmail ({
            email: user.email,
            subject:"Activate your account",
            template:"activation.mail.ejs",
            data
        })
      } catch (error:any) {
        return next(new CustomError(error?.message, 500));
      }
      
      res.status(201).json({
        success: true,
        message: `Please check your email ${user.email} to activate your account`,
        activationToken: activationToken.token
      });
    } 
    catch (error: any) {
        return next(new CustomError(error?.message, 500));
    }
  }
);


interface IActivationRequest {
  activation_token: string;
  activation_code: string;
} 

// activate user
export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {activation_token, activation_code} = req.body as IActivationRequest;
      
      const newUser: {user: IUser, activationCode: string} = verifyActivationToken(activation_token);
      
      if (newUser.activationCode !== activation_code) {
        return next(new CustomError("Invalid activation code", 400));
      } 

      const {username, email, password} = newUser.user;
      
      const isEmailExist = await User.findOne({ email });
      if (isEmailExist) {
        return next(new CustomError("Email already exists", 400));
      }
      
      const hashedPassword = await hashPassword(password);

      const user = await User.create({
        username,
        email,
        password: hashedPassword
      });

      res.status(201).json({
        success: true,
        message: "Account has been activated",
      });

    } catch (error: any) {
      return next(new CustomError(error?.message, 500));
    }
  }
)

interface ILoginRequest {
  email: string;
  password: string;
}

// login user
export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
   try {
    const { email, password } = req.body as ILoginRequest;
    if (!email || !password) {
      return next(new CustomError("Please enter email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new CustomError("Invalid email or password", 401));
    }

    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) {
      return next(new CustomError("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
   }catch (error: any) {
    return next(new CustomError(error?.message, 500));
   }
  }
)


// logout user
export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.cookie("access_token", "", {expires: new Date(Date.now()),httpOnly: true})
        res.cookie("refresh_token", "", {expires: new Date(Date.now()),httpOnly: true})

        const userId = req.user?._id as string
        redis.del(userId);

        res.status(200).json({
          success: true,
          message: "Logged out successfully",
        });
    } catch (error: any) {
      return next(new CustomError(error?.message, 500));
    }
  }
)
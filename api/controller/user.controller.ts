import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { CustomError } from "../middlewares/errorHandler.middleware";
import { CatchAsyncError } from "../middlewares/catchAsyncErrors.middleware";
import { createActivationToken } from "../utils/auth.utils";
import {sendEmail} from "../services/email.service"


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

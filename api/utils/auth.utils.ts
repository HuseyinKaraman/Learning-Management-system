import jwt, { Secret } from "jsonwebtoken";
import { ACTIVATION_SECRET } from "../constants/environment";
import { IUser } from "../models/user.model";

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
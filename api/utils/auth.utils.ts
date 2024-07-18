import jwt, { Secret } from "jsonwebtoken";
import { ACTIVATION_SECRET } from "../constants/environment";

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
import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT;
export const API_URL = process.env.API_URL;
export const API_PREFIX = process.env.API_PREFIX;
export const NODE_ENV = process.env.NODE_ENV; 
export const PRODUCTION_SERVER_URL = process.env.PRODUCTION_SERVER_URL;
export const DEVELOPMENT_SERVER_URL = process.env.DEVELOPMENT_SERVER_URL;
export const DATABASE_URL:string = process.env.DATABASE_URL || '';
export const REDIS_URL: string = process.env.REDIS_URL || '';
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const RESET_PASSWORD_SECRET = process.env.RESET_PASSWORD_SECRET;
export const SENDER_EMAIL = process.env.SENDER_EMAIL;
export const SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD;
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
export const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
export const STORE_OWNER_PHONE_NUMBER = process.env.STORE_OWNER_PHONE_NUMBER;
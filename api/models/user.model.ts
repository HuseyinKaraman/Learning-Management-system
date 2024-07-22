import mongoose, { Document, Model, Schema } from "mongoose";
import { USER_ROLES } from "../constants/types";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    avatar: {
        public_id: string;
        url: string;
    },
    role: string;
    isVerified: boolean;
    courses: Array<{courseId: string}>;
    comparePassword(password: string): Promise<boolean>;
}


const userSchema: Schema<IUser> = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: {
            validator: (value: string) => {
                return emailRegexPattern.test(value);
            },
            message: "Please enter a valid email"
        }
    },
    password: {
        type: String,
        minLength: [6, "Password must be at least 6 characters"],
    },
    avatar: {
        public_id: String,
        url: String
    }, 
    role: {
        type: String,
        enum: USER_ROLES,
        default: USER_ROLES.USER
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    courses: [{
        courseId: String
    }]
}, {
    timestamps: true
});


const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;

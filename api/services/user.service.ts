import User from "../models/user.model";

// get user by id
export const getUserById = async (id: string) => {
    const user = await User.findById(id).select("-password");
    return user;
}
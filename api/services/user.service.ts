import { redis } from "../config/redis";

// get user by id
export const getUserById = async (id: string) => {
    const userJson = await redis.get(id);
    if (!userJson) {
        return null;
    }
    return JSON.parse(userJson)
}
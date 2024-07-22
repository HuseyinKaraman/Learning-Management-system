import { Router } from "express";
import { activateUser, getUserInfo, loginUser, logoutUser, registrationUser, updateAccessToken } from "../controller/user.controller";
import { isAuthenticated } from "../middlewares/auth";

const router = Router();

/**
 * @swagger
 * tags:
 *  name: User
 *  description: User api routes
 */

router.post("/registration", registrationUser);

router.post("/activate-user", activateUser);

router.post("/login", loginUser);

router.get("/logout", isAuthenticated, logoutUser);

router.get("/refresh", updateAccessToken);

router.get("/me", isAuthenticated, getUserInfo);

export default router;
import { Router } from "express";
import { activateUser, loginUser, logoutUser, registrationUser } from "../controller/user.controller";
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



export default router;
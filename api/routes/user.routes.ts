import { Router } from "express";
import { activateUser, registrationUser } from "../controller/user.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *  name: User
 *  description: User api routes
 */

router.post("/registration", registrationUser);

router.post("/activate-user", activateUser);


export default router;
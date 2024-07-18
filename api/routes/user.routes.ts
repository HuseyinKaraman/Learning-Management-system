import { Router } from "express";
import {registrationUser} from "../controller/user.controller"


const router = Router();

/**
 * @swagger
 * tags:
 *  name: User
 *  description: User api routes
 */


router.post("/registration", registrationUser);



export default router;
import {Request, Response, NextFunction, Application, Router } from "express";
import { API_PREFIX } from "../constants/environment";
import { CustomError, globalErrorHandler } from "../middlewares/errorHandler.middleware";

const initializeRoutes = (app: Application) => {
  /**
     * @swagger
     * /healthcheck:
     *  get:
     *     tags:
     *     - Healthcheck
     *     description: Responds if the app is up and running
     *     responses:
     *       200:
     *         description: App is up and running
     */
  // Routes
  app.get("/healthcheck", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      success: true,
      message: "Hello World!"
    });
  });

  const routes: Router = Router();

  app.use(`${API_PREFIX}`, routes);

  app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const errorMessage= `Route ${req.originalUrl} not found`;
    const error = new CustomError(errorMessage.trim(), 404);
    next(error);
  });

  app.use(globalErrorHandler);
};

export default initializeRoutes;

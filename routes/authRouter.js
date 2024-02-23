import express from "express";
import { schemasUser } from "../models/usersModels.js";
import validateBody from "../middlewares/validateBody.js";
import {
  getCurrent,
  login,
  logout,
  register,
  updateSubscription,
} from "../controllers/authControllers.js";
import { authenticate } from "../middlewares/authenticate.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(schemasUser.registerSchema),
  register
);
authRouter.post("/login", validateBody(schemasUser.loginSchema), login);
authRouter.post("/logout", authenticate, logout);
authRouter.get("/current", authenticate, getCurrent);
authRouter.patch(
  "/",
  authenticate,
  validateBody(schemasUser.subscriptionSchema),
  updateSubscription
);

export default authRouter;

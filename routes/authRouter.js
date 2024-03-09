import express from 'express';
import { schemasUser } from '../models/usersModels.js';
import validateBody from '../middlewares/validateBody.js';
import {
  getCurrent,
  login,
  logout,
  register,
  updateAvatar,
  updateSubscription,
  verifyEmail,
  resendVerifyEmail,
} from '../controllers/authControllers.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';

const authRouter = express.Router();

authRouter.get('/verify/:verificationToken', verifyEmail);
authRouter.post(
  '/verify',
  validateBody(schemasUser.verificationTokenSchema),
  resendVerifyEmail
);
authRouter.post(
  '/register',
  validateBody(schemasUser.registerSchema),
  register
);
authRouter.post('/login', validateBody(schemasUser.loginSchema), login);
authRouter.post('/logout', authenticate, logout);
authRouter.get('/current', authenticate, getCurrent);
authRouter.patch(
  '/',
  authenticate,
  validateBody(schemasUser.subscriptionSchema),
  updateSubscription
);
authRouter.patch(
  '/avatars',
  authenticate,
  upload.single('avatar'),
  updateAvatar
);

export default authRouter;

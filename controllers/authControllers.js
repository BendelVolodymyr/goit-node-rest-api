import HttpError from '../middlewares/HttpError.js';
import {
  createUser,
  loginUser,
  logoutUser,
  resendVerificationEmail,
  upAvatar,
  upSubscription,
  verificationEmail,
} from '../services/authServices.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import Jimp from 'jimp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

export const register = async (req, res, next) => {
  try {
    const result = await createUser(req.body);

    if (result) {
      const { email, subscription } = result;
      const resultNewUser = { user: { email, subscription } };
      res.status(201).json(resultNewUser);
    } else {
      throw HttpError(404);
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const resultUser = await loginUser(req.body);

    if (resultUser) {
      res.json(resultUser);
    } else {
      throw HttpError(404);
    }
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
};

export const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await logoutUser(_id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const result = await upSubscription(_id, req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { path: tmpUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);
    const image = await Jimp.read(tmpUpload);
    await image.resize(250, 250).writeAsync(resultUpload);
    const avatarURL = path.join('avatars', filename);
    await upAvatar(_id, avatarURL);
    res.status(200).json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    await verificationEmail(verificationToken);

    res.status(200).json({ message: 'Verification successful' });
  } catch (error) {
    next(error);
  }
};

export const resendVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    await resendVerificationEmail(email);

    res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
    next(error);
  }
};

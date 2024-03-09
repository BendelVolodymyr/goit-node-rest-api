import { User } from '../models/usersModels.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import gravatar from 'gravatar';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '../middlewares/sendEmail.js';
import HttpError from '../middlewares/HttpError.js';

const { SECRET_KEY, BASE_URL_HOST } = process.env;

async function createUser(data) {
  const { email, password } = data;

  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = uuidv4();
  const newUser = await User.create({
    ...data,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
  const verifyEmail = {
    to: email,
    subject: 'Confirm Email Address',
    html: `
    <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #333333;">Email Confirmation</h2>
      <p style="color: #666666; line-height: 1.6;">Hello ${email},</p>
      <p style="color: #666666; line-height: 1.6;">To confirm your email address, please click the link below:</p>
      <a href="${BASE_URL_HOST}/users/verify/${verificationToken}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; transition: background-color 0.3s ease;">Confirm Email Address</a>
      <p style="color: #666666; line-height: 1.6;">If you did not request this, please disregard this email.</p>
    </div>
  `,
  };

  await sendEmail(verifyEmail);

  return newUser;
}

async function loginUser(data) {
  const { email, password } = data;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  if (!user.verify) {
    throw HttpError(401, 'Email not verify');
  }
  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '10h' });
  const result = {
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  };
  await User.findByIdAndUpdate(user.id, { token });
  return result;
}

async function logoutUser(_id) {
  await User.findByIdAndUpdate(_id, { token: null });
}

async function upSubscription(_id, data) {
  const { subscription } = data;
  const result = await User.findByIdAndUpdate(
    _id,
    { subscription },
    { new: true }
  ).select('subscription email');
  return result;
}

async function upAvatar(id, avatarURL) {
  await User.findByIdAndUpdate(id, { avatarURL });
}

async function verificationEmail(verificationToken) {
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, 'User not found');
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
}

async function resendVerificationEmail(email) {
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, 'Email not found');
  }

  if (user.verify || user.verificationToken === '') {
    throw HttpError(400, 'Verification has already been passed');
  }

  const verifyEmail = {
    to: email,
    subject: 'Confirm Email Address',
    html: `
    <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #333333;">Email Confirmation</h2>
      <p style="color: #666666; line-height: 1.6;">Hello ${email},</p>
      <p style="color: #666666; line-height: 1.6;">To confirm your email address, please click the link below:</p>
      <a href="${BASE_URL_HOST}/users/verify/${user.verificationToken}" style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; transition: background-color 0.3s ease;">Confirm Email Address</a>
      <p style="color: #666666; line-height: 1.6;">If you did not request this, please disregard this email.</p>
    </div>
  `,
  };

  await sendEmail(verifyEmail);
}

export {
  createUser,
  loginUser,
  logoutUser,
  upSubscription,
  upAvatar,
  verificationEmail,
  resendVerificationEmail,
};

import { User } from "../models/usersModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import gravatar from "gravatar";

const { SECRET_KEY } = process.env;

async function createUser(data) {
  const { email, password } = data;

  const hashPassword = await bcrypt.hash(password, 10);
  const user = await User.findOne({ email });
  const avatarURL = gravatar.url(email);
  if (user) {
    return 409;
  }

  const newUser = await User.create({
    ...data,
    password: hashPassword,
    avatarURL,
  });
  return newUser;
}

async function loginUser(data) {
  const { email, password } = data;
  const user = await User.findOne({ email });

  if (!user) {
    return 401;
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    return 401;
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "10h" });
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
  const result = await User.findByIdAndUpdate(_id, data, { new: true }).select(
    "subscription email"
  );
  return result;
}

async function upAvatar(id, avatarURL) {
  await User.findByIdAndUpdate(id, { avatarURL });
}

export { createUser, loginUser, logoutUser, upSubscription, upAvatar };

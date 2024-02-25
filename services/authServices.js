import { User } from "../models/usersModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import HttpError from "../middlewares/HttpError.js";

const { SECRET_KEY } = process.env;

async function createUser(data) {
  const { email, password } = data;

  const hashPassword = await bcrypt.hash(password, 10);
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const newUser = await User.create({ ...data, password: hashPassword });
  return newUser;
}

async function loginUser(data) {
  const { email, password } = data;
  const user = await User.findOne({ email });
  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!user && !passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
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
  const { subscription } = data;
  const result = await User.findByIdAndUpdate(
    _id,
    { subscription },
    { new: true }
  ).select("subscription email");
  return result;
}

export { createUser, loginUser, logoutUser, upSubscription };
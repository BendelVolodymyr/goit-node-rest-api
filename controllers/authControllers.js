import {
  createUser,
  loginUser,
  logoutUser,
  upSubscription,
} from "../services/authServices.js";

export const register = async (req, res, next) => {
  try {
    const result = await createUser(req.body);
    const { email, subscription } = result;
    const resultNewUser = { user: { email, subscription } };
    res.status(201).json(resultNewUser);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const resultUser = await loginUser(req.body);
    res.json(resultUser);
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

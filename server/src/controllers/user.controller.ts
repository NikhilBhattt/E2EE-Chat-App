import type { Request, Response } from "express";
import User from "../models/user.model.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.ts";
import asyncHandler from "../utils/asyncHandler.ts";
import BlackListToken from "../models/blacklisttoken.model.ts";
import { stat } from "node:fs";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, password, publicKey } = req.body;

  if (!username || !password || !publicKey) {
    return res.status(400).json({
      status: "error",
      message: "Username, password and public key are required",
    });
  }

  const userExists = await User.findOne({ username });

  if (userExists) {
    return res
      .status(400)
      .json({ status: "error", message: "Username already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    password: hashedPassword,
    publicKey,
  });

  const token = jwt.sign({ username }, config.JWT_SECRET, {
    expiresIn: "1d",
  });

  const { password: _password, ...userWithoutPassword } = user.toObject();

  return res
    .status(201)
    .json({ status: "success", data: userWithoutPassword, token });
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ status: "error", message: "Username and password are required" });
  }

  const user = await User.findOne({ username }).select("+password").lean();

  if (!user) {
    return res.status(404).json({ status: "error", message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res
      .status(401)
      .json({ status: "error", message: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, config.JWT_SECRET, {
    expiresIn: "1d",
  });

  const { password: _password, ...userWithoutPassword } = user;
  return res
    .status(200)
    .json({ status: "success", data: userWithoutPassword, token });
});

interface AuthRequest extends Request {
  user?: object | string;
  token?: string;
}
const getUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  return res.status(200).json({ status: "success", data: req.user });
});

const logoutUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  await BlackListToken.create({ token: req.token as string });

  delete req.user;
  return res.status(200).json({ status: "success", message: "Logged Out" });
});

export { registerUser, loginUser, getUserProfile, logoutUser };

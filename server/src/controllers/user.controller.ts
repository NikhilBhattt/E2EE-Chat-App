import type { Request, Response } from "express";
import User from "../models/user.model.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.ts";
import asyncHandler from "../utils/asyncHandler.ts";
import BlackListToken from "../models/blacklisttoken.model.ts";

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

  const token = jwt.sign({ id: user._id, username }, config.JWT_SECRET, {
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

  const token = jwt.sign({ id: user._id, username }, config.JWT_SECRET, {
    expiresIn: "1d",
  });

  const { password: _password, ...userWithoutPassword } = user;
  return res
    .status(200)
    .json({ status: "success", data: userWithoutPassword, token });
});

interface AuthRequest extends Request {
  user?: { username: string };
  token: string;
}
const getUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  return res.status(200).json({ status: "success", user: req.user });
});

const logoutUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  await BlackListToken.create({ token: req.token as string });

  delete req.user;
  return res.status(200).json({ status: "success", message: "Logged Out" });
});

const searchUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { username } = req.query;

  if (typeof username !== "string") {
    return res.status(400).json({
      status: "error",
      message: "Username query parameter is required",
    });
  }

  const filter: Record<string, any> = {
    username: { $regex: username, $options: "i" },
  };

  if (req.user?.username) {
    filter.username.$ne = req.user.username;
  }

  const users = await User.find(filter);

  if (!users.length) {
    return res.status(404).json({ status: "error", message: "User not found" });
  }

  return res.status(200).json({ status: "success", users });
});

export { registerUser, loginUser, getUserProfile, logoutUser, searchUser };

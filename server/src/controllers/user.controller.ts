import type { Request, Response } from "express";
import User from "../models/user.model.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.ts";

const registerUser = async (req: Request, res: Response) => {
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

  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });

  return res.status(201).json({ status: "success", data: user, token });
};

const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ status: "error", message: "Username and password are required" });
  }

  const user = await User.findOne({ username });

  if (!user) {
    return res
      .status(404)
      .json({ status: "error", message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res
      .status(401)
      .json({ status: "error", message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });

  return res.status(200).json({ status: "success", data: user, token });
};

export { registerUser, loginUser };

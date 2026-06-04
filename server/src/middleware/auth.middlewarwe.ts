import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config.ts";
import BlackListToken from "../models/blacklisttoken.model.ts";

interface AuthRequest extends Request {
  user?: object | string;
  token?: string;
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const headers = req.headers.authorization;

  if (!headers || !headers.startsWith("Bearer ")) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  const token = headers.split(" ")[1];

  if (!token) {
    return res.status(401).json({ status: "error", message: "Unauthorized" });
  }

  try {
    const isBlackListed = await BlackListToken.findOne({ token });

    if (isBlackListed) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid Token" });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
    }

    req.user = decoded;
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ status: "error", message: "Invalid token" });
  }
};

export default authMiddleware;

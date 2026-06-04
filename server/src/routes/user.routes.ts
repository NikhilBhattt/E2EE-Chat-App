import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
} from "../controllers/user.controller.ts";
import authMiddleware from "../middleware/auth.middlewarwe.ts";

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", authMiddleware, logoutUser);

router.get("/me", authMiddleware, getUserProfile);

export default router;

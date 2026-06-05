import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
  searchUser,
} from "../controllers/user.controller.ts";
import authMiddleware from "../middleware/auth.middlewarwe.ts";

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", authMiddleware, logoutUser);

router.get("/me", authMiddleware, getUserProfile);

router.post("/validate", authMiddleware, (req, res) => {
  return res.status(200).json({ status: "success" });
});

router.get("/search", authMiddleware, searchUser);

export default router;

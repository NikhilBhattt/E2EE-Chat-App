import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
  searchUser,
  getUserPublicKey,
} from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middlewarwe.js";

const router = Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", authMiddleware, logoutUser);

router.get("/me", authMiddleware, getUserProfile);

router.post("/validate", authMiddleware, (req, res) => {
  return res.status(200).json({ status: "success" });
});

router.get("/search", authMiddleware, searchUser);

router.get("/:id/public-key", authMiddleware, getUserPublicKey);

export default router;

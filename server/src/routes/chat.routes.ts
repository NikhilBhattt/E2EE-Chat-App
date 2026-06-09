import { Router } from "express";
import { accessChat, fetchChat } from "../controllers/chat.controller.js";
import authMiddleware from "../middleware/auth.middlewarwe.js";

const router = Router();

router.get("/", authMiddleware, fetchChat);

router.post("/", authMiddleware, accessChat);

export default router;

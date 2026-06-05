import { Router } from "express";
import { accessChat, fetchChat } from "../controllers/chat.controller.ts";
import authMiddleware from "../middleware/auth.middlewarwe.ts";

const router = Router();

router.get("/", authMiddleware, fetchChat);

router.post("/", authMiddleware, accessChat);

export default router;

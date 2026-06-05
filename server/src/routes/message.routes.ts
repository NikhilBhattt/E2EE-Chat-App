import { Router } from "express";
import authMiddleware from "../middleware/auth.middlewarwe.ts";
import { createMessage } from "../controllers/message.controller.ts";

const router = Router();

router.get("/", authMiddleware, createMessage);

export default router;

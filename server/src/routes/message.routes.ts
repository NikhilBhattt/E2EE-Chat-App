import { Router } from "express";
import authMiddleware from "../middleware/auth.middlewarwe.ts";
import {
  createMessage,
  fetchUserMessages,
} from "../controllers/message.controller.ts";

const router = Router();

router.post("/", authMiddleware, createMessage);

router.get("/all", authMiddleware, fetchUserMessages);

export default router;

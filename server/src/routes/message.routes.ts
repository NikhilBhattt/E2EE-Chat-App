import { Router } from "express";
import authMiddleware from "../middleware/auth.middlewarwe.js";
import {
  createMessage,
  fetchUserMessages,
} from "../controllers/message.controller.js";

const router = Router();

router.post("/", authMiddleware, createMessage);

router.get("/all", authMiddleware, fetchUserMessages);

export default router;

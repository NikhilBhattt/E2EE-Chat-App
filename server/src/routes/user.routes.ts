import { Router } from "express";
import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.ts";
import { registerUser, loginUser } from "../controllers/user.controller.ts";

const router = Router();

router.post("/register", asyncHandler(registerUser));

router.post("/login", asyncHandler(loginUser));

export default router;

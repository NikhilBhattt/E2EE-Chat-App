import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.ts";
import Message from "../models/message.model.ts";

interface AuthRequest extends Request {
  user: { id: string; username: string };
  token: string;
}

const createMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { content, recieverId } = req.body;

  const msg = await Message.create({
    sender: req.user.id,
    receiver: recieverId,
    content,
  });

  
  
});

export { createMessage };

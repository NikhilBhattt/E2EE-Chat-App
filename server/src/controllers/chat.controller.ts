import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import Chat from "../models/chat.model.js";

interface AuthRequest extends Request {
  user: { id: string; username: string };
  token: string;
}

const accessChat = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    return res
      .status(400)
      .json({ status: "error", message: "userId not found" });
  }

  const chat = await Chat.findOne({
    users: { $all: [req.user.id, userId] },
  })
    .populate("users")
    .populate("latestMessage");

  if (chat) {
    return res.status(200).json({ status: "success", chat });
  }

  const createdChat = await Chat.create({ users: [req.user.id, userId] });

  const fullChat = await Chat.findOne({ _id: createdChat._id })
    .populate("users")
    .populate("latestMessage");

  return res.status(200).json({ status: "success", chat: fullChat });
});

const fetchChat = asyncHandler(async (req: AuthRequest, res: Response) => {
  const chats = await Chat.find({
    users: { $elemMatch: { $eq: req.user.id } },
  }).populate(["users", "latestMessage"]);

  return res.status(200).json({ status: "success", chats });
});

export { accessChat, fetchChat };

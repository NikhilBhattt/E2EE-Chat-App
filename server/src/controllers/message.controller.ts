import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";

interface AuthRequest extends Request {
  user: { id: string; username: string };
  token: string;
}

const createMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { cipherText, iv, recieverId } = req.body;

  const msg = await Message.create({
    sender: req.user.id,
    reciever: recieverId,
    cipherText,
    iv,
  });

  await Chat.findOneAndUpdate(
    {
      users: { $all: [req.user.id, recieverId] },
    },
    {
      $set: {
        latestMessage: msg,
      },
    },
  );

  res.status(200).json({
    status: "success",
    message: msg,
  });
});

const fetchUserMessages = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const messages = await Message.find({
      $or: [{ sender: req.user.id }, { reciever: req.user.id }],
    })
      .select("sender reciever cipherText iv createdAt")
      .lean();

    return res.status(200).json({ status: 200, messages });
  },
);

export { createMessage, fetchUserMessages };

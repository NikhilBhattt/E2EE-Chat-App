import { Schema, model } from "mongoose";

const chatSchema = new Schema(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true },
);

const Chat = model("Chat", chatSchema);

export default Chat;

import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required:true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Message = model("Message", messageSchema);

export default Message;

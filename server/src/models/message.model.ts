import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required:true,
    },
    reciever: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cipherText: {
      type: String,
      required: true,
    },
    iv: {
      type: String,
      requird: true
    }
  },
  { timestamps: true },
);

const Message = model("Message", messageSchema);

export default Message;

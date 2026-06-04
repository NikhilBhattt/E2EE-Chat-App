import { Schema, model } from "mongoose";

const BlackListTokenSchema = new Schema({
  token: String,
});

const BlackListToken = model("BlackListToken", BlackListTokenSchema);

export default BlackListToken;

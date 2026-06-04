import { connect } from "mongoose";
import config from "../config/config.ts";

const connectDB = async () => {
  try {
    await connect(config.MONGODB_URI as string);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

/**
 * Custom imports
 */
import config from "./config/config.js";
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import messageRoutes from "./routes/message.routes.js";
import connectDB from "./db/connection.js";

/***
 * Database connection
 */
await connectDB();

/**
 * Express app initialization
 */
const app = express();

/**
 * Middlewares
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  }),
);

/**
 * Routes
 */
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

export default app;

import { configDotenv } from "dotenv";
configDotenv();
import express from "express";
import cors from "cors";

/**
 * Custom imports
 */
import config from "./config/config.ts";
import userRoutes from "./routes/user.routes.ts";
import connectDB from "./db/connection.ts";

/***
 * Database connection
 */
connectDB();

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

export default app;

import config from "./config/config.ts";
import { Server, type Server as SocketIOServer } from "socket.io";
import type { Server as HTTPServer } from "http";

/**
 * Initialize Socket.IO
 */
export const initializeSocketIO = (server: HTTPServer): SocketIOServer => {
  const io = new Server(server, {
    cors: {
      origin: config.CORS_ORIGIN,
      methods: ["GET", "POST", "UPDATE", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected! Id: ", socket.id);

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected! Id: ", socket.id);
    });

    socket.on("message", (data) => {
      io.emit("message", data);
    });
  });

  return io;
};

import config from "./config/config.ts";
import { Server, type Server as SocketIOServer, type Socket } from "socket.io";
import type { Server as HTTPServer } from "http";

interface User {
  _id: string;
  [key: string]: any;
}

interface Chat {
  users: User[];
  [key: string]: any;
}

interface Message {
  reciever: string; // kept original spelling
  [key: string]: any;
}

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

  io.on("connection", (socket: Socket) => {
    console.log("🟢 User connected! Id: ", socket.id);

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected! Id: ", socket.id);
    });

    socket.on("join-chat", (roomId: string) => {
      socket.join(roomId);
      console.log("User joined room: ", roomId);
    });

    socket.on(
      "new-message",
      ({ chat, newMessage }: { chat: Chat; newMessage: Message }) => {
        // broadcast to all sockets in the chat room except the sender
        socket.to(chat._id).emit("message-recieve", {chat, newMessage});
      },
    );
  });

  return io;
};

const config = {
  PORT: process.env.PORT || 3000,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/e2ee-chat-app",
  JWT_SECRET: "nj45354j0an"
};

export default config;

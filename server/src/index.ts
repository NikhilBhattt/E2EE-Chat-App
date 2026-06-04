/**
 * Modules imports
 */
import app from "./app.ts";
import { createServer } from "http";

/**
 * Custom imports
 */
import config from "./config/config.ts";
import { initializeSocketIO } from "./socketio.ts";

/**
 * Raw HTTP Server
 */
const server = createServer(app);

/**
 * Initialize Socket.IO
 */
initializeSocketIO(server);

/**
 * Server starts listening
 */
server.listen(config.PORT, () => {
  console.log(`Server running on PORT ${config.PORT}`);
});

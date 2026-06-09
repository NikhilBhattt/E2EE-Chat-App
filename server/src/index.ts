/**
 * Modules imports
 */
import app from "./app.js";
import { createServer } from "http";

/**
 * Custom imports
 */
import config from "./config/config.js";
import { initializeSocketIO } from "./socketio.js";

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

import { io } from "socket.io-client";
import { toast } from "react-toastify";

let globalSocket = null;

export const getSocket = () => {
  if (!globalSocket || !globalSocket.connected) {
    globalSocket = io("http://localhost:5000", { // Match server port
      transports: ["websocket", "polling"],
      forceNew: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    globalSocket.on("connect", () => {
      console.log("Socket connected:", globalSocket.id);
      // toast.success("Connected to server", { autoClose: 3000 });
    });

    globalSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      // toast.error(`Socket connection failed: ${error.message}`, { autoClose: 5000 });
    });

    globalSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      // toast.warn(`Socket disconnected: ${reason}`, { autoClose: 5000 });
    });
  }
  return globalSocket;
};

export const disconnectSocket = () => {
  if (globalSocket) {
    globalSocket.disconnect();
    globalSocket = null;
  }
};
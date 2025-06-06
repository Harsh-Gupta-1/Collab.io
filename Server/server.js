import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import roomRoutes from "./routes/roomRoutes.js";
import executeRoutes from "./routes/executeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";  
import dashboardRoutes from "./routes/dashboardRoutes.js";
import socketHandler from "./sockets/socketHandler.js";

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

socketHandler(io);

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/rooms", roomRoutes);
app.use("/api/execute", executeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard/rooms", dashboardRoutes);
app.get("/", (req, res) => {
  res.send("Backend Running!!!!");
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running!!!!`);
});

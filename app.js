import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { config } from "dotenv";

config();
const PORT = process.env.PORT;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user is connected with server using id:", socket.id);

  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);
    io.to(roomId).emit("user-connected", username);
  });
});

// Middlewares
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Server is working");
});

server.listen(PORT, () => {
  console.log("Server is running on port :", PORT);
});

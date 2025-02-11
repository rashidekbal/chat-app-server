import express from "express";
import http from "http";
import mysql from "mysql2";
import { Server } from "socket.io";
import "dotenv/config";
import cors from "cors";

let app = express();
let server = http.createServer(app);
let io = new Server(server, {
  cors: { origin: "*" },
  transports: ["websocket", "polling"],
});

server.listen(process.env.PORT || 8000, () => {
  console.log(`server is running on port ${process.env.PORT || 8000}`);
});

app.use(express.json());
app.use(cors({ origin: "*" }));

io.on("connection", (user) => {
  console.log("user connected");

  user.on("disconnect", () => {
    console.log("user disconnected ");
  });
});

import express from "express";
import http from "http";
import mysql from "mysql2";
import { Server } from "socket.io";
import "dotenv/config";
import cors from "cors";

let app = express();
let server = http.createServer(app);
export let io = new Server(server, {
  cors: { origin: "*", credentials: true },
  transports: ["websocket", "polling"],
});
let onlineUsers = [];
//add new online user
function add_new_online_users(id, socket) {
  onlineUsers.push({
    imgSrc:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrLWKNduCw_8jK8-lg0p1K1t6X3ATRkhOkDg&s",
    id: id,
    Name: "PERSON-" + id[3] + id[4],
    placeHolder: "something",
  });

  socket.broadcast.emit("updateUserList", onlineUsers);
}
//remove disconneted user
function remove_disconneted_user(id, socket) {
  onlineUsers = onlineUsers.filter((item) => {
    return item.id != id;
  });
  socket.broadcast.emit("updateUserList", onlineUsers);
}
app.use(express.json());
app.use(cors({ origin: "*" }));

io.on("connection", (user) => {
  user.emit("welcome", onlineUsers);
  console.log(`new user with user id ${user.id} is connected`);
  add_new_online_users(user.id, user);

  user.on("disconnect", () => {
    console.log(`user of id ${user.id} just got disconnected `);
    remove_disconneted_user(user.id, user);
    user.broadcast.emit("removeUserdata", { id: user.id });
  });
  user.on("Messagep2pFromClient", (data) => {
    io.to(data.id).emit("Messagep2pFromServer", { msg: data.msg, id: user.id });
  });
});
server.listen(process.env.PORT || 8000, () => {
  console.log(`server is running on port ${process.env.PORT || 8000}`);
});

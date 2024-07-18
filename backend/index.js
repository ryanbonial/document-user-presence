import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.get("/", (req, res) => {
  res.send("<h1>Nothing to see here</h1>");
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  io.emit("user-connected", { id: socket.id });

  socket.on("element-focus", (msg) => {
    msg.id = socket.id;
    console.log("message: ", JSON.stringify(msg));
    io.emit("element-focus", msg);
  });

  socket.on("element-blur", (msg) => {
    msg.id = socket.id;
    console.log("message: ", JSON.stringify(msg));
    io.emit("element-blur", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    io.emit("user-disconnected", { id: socket.id });
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});

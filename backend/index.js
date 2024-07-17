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
  console.log("a user connected");

  socket.on("element-focus", (msg) => {
    console.log("message: ", JSON.stringify(msg));
    io.emit("element-focus", msg);
  });

  socket.on("element-blur", (msg) => {
    console.log("message: ", JSON.stringify(msg));
    io.emit("element-blur", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});

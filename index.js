import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import rabbitMessageReceiver from "./rabbitmq.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  path: "/ws",
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("onHelpRequest", (data) => {
    io.emit("readHelpRequest", data);
  });

  rabbitMessageReceiver(
    function (msg) {
      io.emit("readOrderStatusUpdate", msg);
    },
    function (_) {
      io.emit("readOrderAdded");
    }
  );
});

server.listen(5500, () => {
  console.log("server running at port 5500");
});

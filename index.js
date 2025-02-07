import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import rabbitMessageReceiver from "./rabbitmq.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  path: "/ws",
  cors: {
    origin: "*",
  }
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("onHelpRequest", (data) => {
    io.emit("readHelpRequest", data);
  });

  socket.on("onReadyToPay", (data) => {
    io.emit("readReadyToPay", data);
  });

  rabbitMessageReceiver(
    function (msg) {
      io.emit("readOrderStatusUpdate", msg);
    },
    function (_) {
      io.emit("readOrderAdded");
    },

    function(msg){
      io.emit("readUpdateMenuItemStatus", msg);
    }
  );
});

server.listen(5500, () => {
  console.log("server running at port 5500");
});

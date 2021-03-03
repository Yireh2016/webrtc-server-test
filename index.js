const express = require("express");
const Datastore = require("nedb");

const app = express();
let db = {};
db = new Datastore();
const http = require("http").Server(app);
const allowedOrigins = {
  origin: "*",
};
const io = require("socket.io")(http, {
  cors: allowedOrigins,
});

const cors = require("cors");

app.use(cors(allowedOrigins));

const port = 8080;

app.get("/", (_, res) => {
  res.send("hello world");
});

io.on("connection", (socket) => {
  console.log("New client connected", { socketID: socket.id });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

http.listen(port, function () {
  console.log("listening on *: ", port);
});

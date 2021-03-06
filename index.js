const express = require("express");
const Datastore = require("nedb");
const app = express();
const http = require("http").Server(app);
const allowedOrigins = {
  origin: "*",
};
const io = require("socket.io")(http, {
  cors: allowedOrigins,
});
const cors = require("cors");
const onConnectionController = require("./src/websocket/controllers/onConnection");

let db = {};
db = new Datastore();
const port = 8080;

app.use(cors(allowedOrigins));

app.get("/", (_, res) => {
  res.send("hello world");
});

io.on("connection", (socket) => onConnectionController({ io, socket, db }));

http.listen(port, function () {
  console.log("listening on *: ", port);
});

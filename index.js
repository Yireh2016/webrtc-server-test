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
  console.log("New client connected", {
    socketID: socket.id,
    query: socket.handshake.query,
  });

  const user_id = socket.handshake.query.id;
  const doc = {
    socket_id: socket.id,
    user_id,
  };

  db.insert(doc);

  db.find({}, function (err, doc) {
    // doc is the document Mars
    // If no document is found, doc is null
    console.log({ err, doc }, "todos");
    io.emit("user-list", doc);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");

    db.remove({ user_id }, {}, function (err, numRemoved) {
      console.log({ numRemoved });
      // numRemoved = 1
    });

    db.find({}, function (err, doc) {
      // doc is the document Mars
      // If no document is found, doc is null
      console.log({ err, doc }, "todos");
      io.emit("user-list", doc);
    });
  });
});

http.listen(port, function () {
  console.log("listening on *: ", port);
});

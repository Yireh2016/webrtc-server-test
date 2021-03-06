const { USER_LIST } = require("../constants/websockets/events");

const onDisconnectController = ({ db, io, user_id }) => {
  console.log("Client disconnected");

  db.remove({ user_id }, {}, (...args) => {
    console.log("removing ", user_id, { args });
  });

  db.find({}, function (err, doc) {
    io.emit(USER_LIST, doc);
  });
};

module.exports = onDisconnectController;

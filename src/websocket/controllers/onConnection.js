const onDisconnectController = require("./onDisconnect");
const websocket = require("../constants/websockets/events");

const onConnectionController = ({ io, socket, db }) => {
  console.log("New client connected", {
    socketID: socket.id,
    query: socket.handshake.query,
  });

  const user_id = socket.handshake.query.id;

  db.find({ user_id }, function (err, doc) {
    if (doc.length === 0 || err) {
      const doc = {
        socket_id: socket.id,
        user_id,
      };

      db.insert(doc);

      db.find({}, function (err, doc) {
        io.emit(websocket.USER_LIST, doc);
      });
      io.to(socket.id).emit(websocket.USER_REGISTERED);

      return;
    }
    io.to(socket.id).emit(websocket.USER_ALREADY_EXIST);
  });

  socket.on(websocket.DISCONNECT, () =>
    onDisconnectController({ db, io, user_id })
  );
  socket.on(websocket.CALLER_DESCRIPTION_SENT, (...args) => {
    const { callerLocalDescription, callee, caller } = args[0];
    console.log("{ CALLER_DESCRIPTION_SENT }", {
      callerLocalDescription,
      callee,
      caller,
      args,
    });

    io.to(callee.socket_id).emit(websocket.INCOMMING_REMOTE_DESCRIPTION, {
      callerLocalDescription,
      caller,
      callee,
    });
  });

  socket.on(websocket.ANSWER_SENT, (...args) => {
    const { answer, callee, caller } = args[0];
    console.log("{ ANSWER_SENT }", { answer, callee, caller });
    io.to(caller.socket_id).emit(websocket.ASWER_RECEIVED, {
      answer,
      caller,
      callee,
    });
  });

  socket.on(websocket.SEND_CALLER_OFFER, (...args) => {
    const { offer, callee, caller } = args[0];
    console.log("{ SEND_CALLER_OFFER }", { offer, callee, caller });
    io.to(callee.socket_id).emit(websocket.INCOMMING_CALLER_OFFER, {
      offer,
      caller,
      callee,
    });
  });

  socket.on(websocket.SEND_CALLEE_ANSWER, (...args) => {
    const { answer, callee, caller } = args[0];
    console.log("{ SEND_CALLEE_ANSWER }", { answer, callee, caller });
    io.to(caller.socket_id).emit(websocket.INCOMMING_CALLEE_ANSWER, {
      answer,
      caller,
      callee,
    });
  });

  socket.on(websocket.SEND_CALLER_ICE, (...args) => {
    const { callee, callerIce, caller } = args[0];
    console.log("{ SEND_CALLER_ICE }", { args });
    io.to(callee.socket_id).emit(websocket.INCOMMING_CALLER_ICE, {
      callerIce,
      caller,
      callee,
    });
  });

  socket.on(websocket.CALLEE_ICE_OUT, (...args) => {
    const { callee, callerIce, caller } = args[0];
    console.log("{ CALLEE_ICE_OUT }", { args });
    io.to(caller.socket_id).emit(websocket.CALLEE_ICE_IN, {
      callerIce,
      caller,
      callee,
    });
  });

  socket.on(websocket.SEND_CALLER_CALLING, (...args) => {
    const { callee, caller } = args[0];
    console.log("{ SEND_CALLER_CALLING }", { args });
    io.to(callee.socket_id).emit(websocket.INCOMMING_CALLER_CALLING, {
      caller,
      callee,
    });
  });

  socket.on(websocket.SEND_CALLEE_CALL_ACEPTED, (...args) => {
    console.log("{ SEND_CALLEE_CALL_ACEPTED   }", { args });
    const { callee, caller } = args[0];

    io.to(caller.socket_id).emit(websocket.INCOMMING_CALLEE_CALL_ACEPTED, {
      caller,
      callee,
    });
  });
};

module.exports = onConnectionController;

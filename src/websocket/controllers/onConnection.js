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
    onDisconnectController({ db, io, user_id, socket_id: socket.id })
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
    const { callee, candidate } = args[0];
    console.log("{ SEND_CALLER_ICE }", { args });
    io.to(callee.socket_id).emit(websocket.INCOMMING_CALLER_ICE, {
      candidate,
    });
  });

  socket.on(websocket.SEND_CALLEE_ICE, (...args) => {
    const { candidate, caller } = args[0];
    console.log("{ SEND_CALLEE_ICE }", { args });
    io.to(caller.socket_id).emit(websocket.INCOMMING_CALLEE_ICE, {
      candidate,
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

  socket.on(websocket.SEND_CALLEE_CALL_ACCEPTED, (...args) => {
    console.log("{ SEND_CALLEE_CALL_ACCEPTED   }", { args });
    const { caller } = args[0];

    io.to(caller.socket_id).emit(websocket.INCOMMING_CALLEE_CALL_ACCEPTED, {
      caller,
    });
  });

  socket.on(websocket.SEND_CALLER_END_CALL, (...args) => {
    console.log("{ SEND_CALLER_END_CALL   }", { args });
    const { callee } = args[0];

    io.to(callee.socket_id).emit(websocket.INCOMMING_CALLER_END_CALL, {
      callee,
    });
  });

  socket.on(websocket.SEND_CALLEE_END_CALL, (...args) => {
    console.log("{ SEND_CALLEE_END_CALL   }", { args });
    const { caller } = args[0];

    io.to(caller.socket_id).emit(websocket.INCOMMING_CALLEE_END_CALL, {
      caller,
    });
  });

  socket.on(websocket.SEND_CALLEE_CALL_REJECTED, (...args) => {
    console.log("{ SEND_CALLEE_CALL_REJECTED   }", { args });
    const { caller } = args[0];
    io.to(caller.socket_id).emit(websocket.INCOMMING_CALLEE_CALL_REJECTED);
  });
};

module.exports = onConnectionController;

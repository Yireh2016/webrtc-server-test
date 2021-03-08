const eventsArr = [
  "CALLER_DESCRIPTION_SENT",
  "INCOMMING_REMOTE_DESCRIPTION",
  "USER_LIST",
  "USER_ALREADY_EXIST",
  "SEND_CALLER_ICE",
  "INCOMMING_CALLER_ICE",
  "SEND_CALLEE_ICE",
  "INCOMMING_CALLEE_ICE",
  "CALLEE_CALL_REJECTED",
  "DISCONNECT",
  "USER_REGISTERED",
  "USER_UNREGISTERED",
  "SEND_CALLER_CALLING",
  "INCOMMING_CALLER_CALLING",
  "SEND_CALLEE_CALL_ACCEPTED",
  "INCOMMING_CALLEE_CALL_ACCEPTED",
  "SEND_CALLER_OFFER",
  "INCOMMING_CALLER_OFFER",
  "SEND_CALLEE_ANSWER",
  "INCOMMING_CALLEE_ANSWER",
  "SEND_CALLER_END_CALL",
  "INCOMMING_CALLER_END_CALL",
  "SEND_CALLEE_END_CALL",
  "INCOMMING_CALLEE_END_CALL",
  "SEND_CALLEE_CALL_REJECTED",
  "INCOMMING_CALLEE_CALL_REJECTED",
];

const websocket = {};

eventsArr.forEach((event) => {
  websocket[event] = event.toLowerCase();
});

module.exports = websocket;

const eventsArr = [
  "CALLER_DESCRIPTION_SENT",
  "INCOMMING_REMOTE_DESCRIPTION",
  "ANSWER_SENT",
  "USER_LIST",
  "USER_ALREADY_EXIST",
  "SEND_CALLER_ICE",
  "INCOMMING_CALLER_ICE",
  "SEND_CALLEE_ICE",
  "INCOMMING_CALLEE_ICE",
  "CALLEE_CALL_REJECTED",
  "DISCONNECT",
  "USER_REGISTERED",
  "SEND_CALLER_CALLING",
  "INCOMMING_CALLER_CALLING",
  "SEND_CALLEE_CALL_ACEPTED",
  "INCOMMING_CALLEE_CALL_ACEPTED",
  "SEND_CALLER_OFFER",
  "INCOMMING_CALLER_OFFER",
  "SEND_CALLEE_ANSWER",
  "INCOMMING_CALLEE_ANSWER",
];

const websocket = {};

eventsArr.forEach((event) => {
  websocket[event] = event.toLowerCase();
});

module.exports = websocket;

const ss = require('socket.io-stream');
module.exports = () => ss.createStream({
  highWaterMark: 2048,
  objectMode: false,
  allowHalfOpen: false
})

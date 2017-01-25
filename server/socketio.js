const debug = require('debug')('app:server:socketio')
const ss = require('socket.io-stream')
const cookieParser = require('cookie-parser')
const passport = require('passport')

const config = require('./config')
const createStream = require('app/util/create-stream')

// Define the Socket.io configuration method
module.exports = function (server, io, mongoStore) {
  debug('initializing socketio server')
  // Intercept Socket.io's handshake request
  io.use(function (socket, next) {
    // Use the 'cookie-parser' module to parse the request cookies
    cookieParser(config.sessionSecret)(socket.request, {}, function (err) {
      // Get the session id from the request cookies
      const sessionId = socket.request.signedCookies['connect.sid'];

      // Use the mongoStorage instance to get the Express session information
      mongoStore.get(sessionId, function (err, session) {
        // Set the Socket.io session information
        socket.request.session = session;

        // Use Passport to populate the user details
        passport.initialize()(socket.request, {}, function () {
          passport.session()(socket.request, {}, function () {
            if (socket.request.user) {
              next(null, true);
            } else {
              next(new Error('User is not authenticated'), false);
            }
          });
        });
      });
    });
  });

  io.on('connection', function (socket) {
    debug('SocketIO client connected')

    ss(socket).on('audio', function (istream) {
      for (let i in io.sockets.connected) {
        if (io.sockets.connected[i].id != socket.id) {
          const outbound = io.sockets.connected[i]
          const ostream = createStream()
          ss(outbound).emit('audio', ostream);
          istream.pipe(ostream);
        }
      }
    });
  });
};

const config = require('../config')
const path = require('path');
const port = config.server_port
const debug = require('debug')('app:bin:server')
require('../server/main')(function (server) {
  server.listen(port)
  debug(`Server is now running at http://localhost:${port}.`)
})

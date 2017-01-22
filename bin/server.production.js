const config = require('../config')
const IsomorphicTools = require('webpack-isomorphic-tools')
const path = require('path');
const port = config.server_port
const debug = require('debug')('app:bin:server')

global.isomorphicTools = new IsomorphicTools({
  patch_require: true,
  debug: config.globals.__DEV__,
  assets: {}
}).server(config.path_base, function () {
  require('../server/main')(function (server) {
    server.listen(port)
    debug(`Server is now running at http://localhost:${port}.`)
  })
})

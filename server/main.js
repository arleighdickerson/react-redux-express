require('babel-register')
require("babel-polyfill");

const debug = require('debug')('app:server')
const path = require('path')
const webpack = require('webpack')
const webpackConfig = require('../build/webpack.config')
const config = require('../config')
const compress = require('compression')
const express = require('express')

const mongoose = require('./mongoose')
const db = mongoose()

/**
 * @param cb Function1[app]
 * @todo probably need a DI container at some point
 * @see http://stackoverflow.com/questions/22519784/how-do-i-convert-an-existing-callback-api-to-promises
 * @see https://github.com/andrewmunsell/needlepoint
 */
module.exports = function (cb) {
  db.connection.once('open', function () {
    debug('mongodb connection established')

    const app = require('./express')(db)

    // Apply gzip compression
    app.use(compress())

    // ------------------------------------
    // Apply Webpack HMR Middleware
    // ------------------------------------
    if (config.env === 'development') {
      global.compiler = webpack(webpackConfig)

      debug('Enabling webpack dev and HMR middleware')
      app.use(require('webpack-dev-middleware')(compiler, {
        publicPath: webpackConfig.output.publicPath,
        contentBase: config.utils_paths.client(),
        hot: true,
        quiet: config.compiler_quiet,
        noInfo: config.compiler_quiet,
        lazy: false,
        stats: config.compiler_stats
      }))
      app.use(require('webpack-hot-middleware')(compiler, {
        path: '/__webpack_hmr'
      }))

      // Serve static assets from ~/public since Webpack is unaware of
      // these files. This middleware doesn't need to be enabled outside
      // of development since this directory will be copied into ~/dist
      // when the application is compiled.
      app.use(express.static(config.utils_paths.dist()))

      // This rewrites all routes requests to the root /index.html file
      // (ignoring file requests). If you want to implement universal
      // rendering, you'll want to remove this middleware.
      /*
       app.use('*', function (req, res, next) {
       const filename = path.join(compiler.outputPath, 'index.html')
       compiler.outputFileSystem.readFile(filename, (err, result) => {
       if (err) {
       return next(err)
       }
       res.set('content-type', 'text/html')
       res.send(result)
       res.end()
       })
       })
       */
    } else {
      debug(
        'Server is being run outside of live development mode, meaning it will ' +
        'only serve the compiled application bundle in ~/dist. Generally you ' +
        'do not need an application server for this and can instead use a web ' +
        'server such as nginx to serve your static files. See the "deployment" ' +
        'section in the README for more information on deployment strategies.'
      )

      // Serving ~/dist by default. Ideally these files should be served by
      // the web server and not the app server, but this helps to demo the
      // server in production.
      app.use(express.static(config.utils_paths.dist()))
    }

    cb(app)
  })
}

require('ignore-styles').default([
    'gif',
    'jpg',
    'eot',
    'woff',
    'ttf',
    'eot',
    'scss',
    'sass',
    'css',
    'less',
    'woff2'
  ].map(ext => '.' + ext)
)

const fs = require('fs')
const path = require('path')
const _ = require('lodash')
const debug = require('debug')('app:server:render')

const config = require('../config')

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const ReactRouter = require('react-router')

const AppContainer = require('../src/containers/AppContainer').default
const createStore = require('../src/store/createStore').default
const createRoutes = require('../src/routes/index').default

function renderIsomorphic(req, res, next, state = {}) {
  const pathname = req.path
  const initialState = {
    routing: {
      location: {
        pathname
      }
    },
    ...state
  }
  global.___INITIAL_STATE__ = initialState
  const history = ReactRouter.createMemoryHistory(pathname)
  const store = createStore(history, initialState)
  const routes = createRoutes(store)

  const component = config.globals.__PROD__
    ? ReactDOMServer.renderToString(
      React.createElement(AppContainer, {store, routes, history})
    )
    : ''
  const handleFile = (err, result) => {
    if (err) {
      return next(err)
    }
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g //<-- NEEDS to be right before response send
    res
      .set('content-type', 'text/html')
      .status(200)
      .send(_.template(result)({
        component,
        initialState: JSON.stringify(initialState)
      }))
      .end()
  }
  if (config.globals.__PROD__) {
    const filename = path.join(config.utils_paths.dist('index.html'))
    fs.readFile(filename, 'utf-8', handleFile)
  } else {
    const filename = path.join(compiler.outputPath, 'index.html')
    compiler.outputFileSystem.readFile(filename, handleFile)
  }
}

module.exports = app => app.use((req, res, next) => {
  res.isomorphic = (initialState = {}) => renderIsomorphic(req, res, next, initialState)
  next()
})

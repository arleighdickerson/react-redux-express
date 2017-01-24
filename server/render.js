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

class RenderStrategy {
  getTemplate() {
    return new Promise((resolve, reject) => this.filesystem
      .readFile(this.filename, 'utf-8', (err, content) => err
        ? reject(err)
        : resolve(content)
      )
    )
  }

  normalizeState(req, initialState) {
    const pathname = req.path
    return {
      routing: { //initialize router location
        location: {
          pathname
        }
      },
      ...initialState
    }
  }

  interpolate(result, {component, initialState}) {
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g
    return _.template(result)({
      component,
      initialState: JSON.stringify(initialState)
    })
  }

  send(res, content) {
    res
      .set('content-type', 'text/html')
      .status(200)
      .send(content)
      .end()
  }

  render(req, res, next, initialState) {
    const component = this.getComponent(initialState)
    const self = this
    this.getTemplate()
      .then(result => {
        const content = self.interpolate(result, {initialState, component})
        self.send(res, content)
      }).catch(err => next(err))
  }
}

class ClientOnlyStrategy extends RenderStrategy {
  get filename() {
    return path.join(compiler.outputPath, 'index.html')
  }

  get filesystem() {
    return compiler.outputFileSystem
  }

  getComponent() {
    return ''
  }
}

class IsomorphicStrategy extends RenderStrategy {
  constructor() {
    super()
    this.filesystem = fs
    this.filename = path.join(config.utils_paths.dist('index.html'))
    const self = this
    this.template = super.getTemplate().then(result => {
      self.template = new Promise(resolve => resolve(result))
      return result
    })
  }

  getTemplate() {
    return this.template
  }

  getComponent(initialState) {
    try {
      global.___INITIAL_STATE__ = initialState
      const history = ReactRouter.createMemoryHistory(initialState.routing.location.pathname)
      const store = createStore(history, initialState)
      const routes = createRoutes(store)
      return ReactDOMServer.renderToString(
        React.createElement(AppContainer, {store, routes, history})
      )
    } finally {
      delete global.___INITIAL_STATE__
    }
  }
}


const STRATEGY = config.globals.__PROD__
  ? new IsomorphicStrategy()
  : new ClientOnlyStrategy()

module.exports = app => app.use((req, res, next) => {
  res.isomorphic = (initialState = {}) => STRATEGY.render(req, res, next, STRATEGY.normalizeState(req, initialState))
  next()
})

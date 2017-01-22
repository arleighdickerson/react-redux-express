'use strict'

require('babel-register')
require('babel-polyfill')

const path = require('path')
const argv = require('yargs').argv

const COMMANDS_DIR = '../commands/'
const db = require('../server/mongoose')()
const bootstrap = cb => db.connection.once('open', cb)

function normalize(route) {
  return path.normalize(route.replace(/^\s+|\s+$/g, "/"))
}

const strategies = [
  route => require(COMMANDS_DIR + route),
  route => require(COMMANDS_DIR + route).default,
  route => {
    const parts = route.split('/')
    const end = parts.pop()
    return require(COMMANDS_DIR + parts.join('/'))[end]
  }
]

function getAction(route) {
  for (let strategy of strategies) {
    try {
      const action = strategy(route)
      if (typeof action == 'function') {
        return action
      }
    } catch (e) {
      if (e.code != 'MODULE_NOT_FOUND') {
        throw e
      }
    }
  }
  throw new Error('action could not be resolved')
}

const action = getAction(normalize(argv._[0]))

const callback = () => {
  try {
    action()
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

bootstrap(callback)

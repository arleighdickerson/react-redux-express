'use strict'

require('babel-register')
require('babel-polyfill')

const path = require('path')
const argv = require('yargs').argv
const moduleExists = require('module-exists')

const COMMANDS_DIR = 'app/commands/'
const db = require('../server/mongoose')()
const bootstrap = cb => db.connection.once('open', cb)

function normalize(route) {
  return path.normalize(route.replace(/^\s+|\s+$/g, "/"))
}

const strategies = [
  route => moduleExists(COMMANDS_DIR + route) ? require(COMMANDS_DIR + route) : null,
  route => moduleExists(COMMANDS_DIR + route) ? require(COMMANDS_DIR + route).default : null,
  route => {
    const parts = route.split('/')
    const end = parts.pop()
    const module = COMMANDS_DIR + parts.join('/')
    return moduleExists(module) ? require(module)[end] : null
  }
]

function getAction(route) {
  for (const strategy of strategies) {
    const action = strategy(route)
    if (typeof action == 'function') {
      return action
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

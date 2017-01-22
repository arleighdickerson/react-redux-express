'use strict'

const fs = require('fs')
const path = require('path')
const argv = require('yargs').argv
const config = require('../config')

const bootstrap = require('../server/main')

function normalize(route) {
  return path.normalize(route.replace(/^\s+|\s+$/g, "/"))
}

const basePath = '../commands/'

const strategies = [
  route => require(basePath + route),
  route => require(basePath + route).default,
  route => {
    const parts = route.split('/')
    const end = parts.pop()
    return require(basePath + parts.join('/'))[end]
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
    }
  }
  throw new Error('action could not be resolved')
}

const action = getAction(normalize(argv._[0]))

const callback = () => {
  try {
    action()
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

bootstrap(callback)

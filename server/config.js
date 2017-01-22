// Invoke 'strict' JavaScript mode
'use strict';

// Load base config
const project = require('../config')

// Load the correct configuration file according to the 'NODE_ENV' variable
const local = require('./env/' + process.env.NODE_ENV + '.js');

//Merge the configs
const config = Object.assign({}, project, local)

Object.assign(global, config.globals)

module.exports = config

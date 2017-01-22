// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
const config = require('./config')
const mongoose = require('mongoose')

mongoose.Promise = Promise

// Define the Mongoose configuration method
module.exports = function () {
  // Use Mongoose to connect to MongoDB
  const db = mongoose.connect(config.db);

  // Load the application models
  require('./models')

  // Return the Mongoose connection instance
  return db;
};

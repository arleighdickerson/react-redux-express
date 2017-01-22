module.exports = (app) => {
  require('./site')(app)
  require('./api')(app)
}

module.exports = (app) => {
  require('./site.routes')(app)
  require('./api.routes')(app)
}

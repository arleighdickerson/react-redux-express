module.exports = (app) => {
  app.route('/').get((req, res) => res.isomorphic({}))
  app.route('/counter').get((req, res) => res.isomorphic({}))
  app.route('/about').get((req, res) => res.isomorphic({}))
  app.route('/login').get((req, res) => res.isomorphic({}))
}

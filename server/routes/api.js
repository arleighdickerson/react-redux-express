import * as authentication from "../controllers/authentication";
module.exports = (app) => {
  app
    .post('/api/login', authentication.login)
    .post('/api/logout', authentication.logout)
    .post('/api/signup', authentication.signup)
}

const _ = require('lodash')
const passport = require('passport')

export function login(req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(422)
        .json(false)
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res
        .status(200)
        .json(user);
    });
  })(req, res, next);
}

export function logout(req, res, next) {
  req.logout();
  return res.json();
}

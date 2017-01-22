const _ = require('lodash')
const passport = require('passport')

const filterUserProperties = user => _.pick(user, [
  'id',
  'username',
  'email',
  'firstName',
  'lastName'
]);

export function login(req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json(false)
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.json(filterUserProperties(user));
    });
  })(req, res, next);
}

export function logout(req, res, next) {
  req.logout();
  return res.json();
}

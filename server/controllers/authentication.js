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
    req.logIn(user, err => err ? next(err) : res
        .status(200)
        .json(user))
  })(req, res, next);
}

export function logout(req, res, next) {
  req.logout();
  return res.json();
}

export function signup(req, res, next) {
  if (!req.user) {
    const user = new User(req.body);
    user.provider = 'local';
    user.save()
      .then(user => req.login(user, err => err
        ? next(err)
        : res.json(user)
      ))
      .catch(err => res.status(422).json(err))
  }
}


export function requiresLogin(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).send({
      message: 'User is not logged in'
    });
  }
  next();
};

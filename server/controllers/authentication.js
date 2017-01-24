const _ = require('lodash')
const passport = require('passport')
const User = require('mongoose').model('User');

export function login(req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(422).json(false)
    }
    req.logIn(user, err => err
      ? next(err)
      : res.status(200).json(user)).end()
  })(req, res, next);
}

export function logout(req, res, next) {
  req.logout();
  return res.json();
}

const getErrorMessage = err => {
  let message = {}
  if (err.code) {
    switch (err.code) {
      // If a unique index error occurs set the message error
      case 11000:
      case 11001:
        return {username: 'Username already exists'}
        break;
      // If a general error occurs set the message error
      default:
        message = {}
    }
  } else {
    message = _.mapValues(err.errors, v => v.message)
  }
  console.log(message)
  return message;
}

export function signup(req, res, next) {
  if (!req.user) {
    const user = new User(req.body);
    user.provider = 'local';
    user.save(err => {
      if (err) {
        let message = getErrorMessage(err);
        return res.status(400).json(message)
      }
      req.login(user, err => err ? next(err) : res.status(200).json(user))
    })
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

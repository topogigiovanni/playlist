var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function (User, config) {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(email, password, done) {
      User.findOne({
        email: email.toLowerCase()
      }, function(err, user) {
        if (err) return done(err);

        if (!user) {
          // 'USER_LOGIN_EMAIL_NOT_REGISTERED': 'This email is not registered.',

          return done(null, false, { message: 'USER_LOGIN_EMAIL_NOT_REGISTERED' });
        }
        if (!user.authenticate(password)) {
          // 'USER_LOGIN_PASS_WRONG': 'This password is not correct.'
          return done(null, false, { message: 'USER_LOGIN_PASS_WRONG' });
        }
        return done(null, user);
      });
    }
  ));
};
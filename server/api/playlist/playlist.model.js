'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var PlaylistSchema = new Schema({
  title: String,
  videos: [Schema.Types.Mixed],
});

/**
 * Virtuals
 */
// PlaylistSchema
//   .virtual('password')
//   .set(function(password) {
//     this._password = password;
//     this.salt = this.makeSalt();
//     this.hashedPassword = this.encryptPassword(password);
//   })
//   .get(function() {
//     return this._password;
//   });

// // Public profile information
// PlaylistSchema
//   .virtual('profile')
//   .get(function() {
//     return {
//       'name': this.name,
//       'role': this.role
//     };
//   });

// // Non-sensitive info we'll be putting in the token
// PlaylistSchema
//   .virtual('token')
//   .get(function() {
//     return {
//       '_id': this._id,
//       'role': this.role
//     };
//   });

/**
 * Validations
 */

//Validate empty email
PlaylistSchema
  .path('title')
  .validate(function(title) {
    return title.length;
  }, 'Title cannot be blank');

// // Validate empty password
// PlaylistSchema
//   .path('hashedPassword')
//   .validate(function(hashedPassword) {
//     return hashedPassword.length;
//   }, 'Password cannot be blank');

// // Validate email is not taken
// PlaylistSchema
//   .path('email')
//   .validate(function(value, respond) {
//     var self = this;
//     this.constructor.findOne({email: value}, function(err, user) {
//       if(err) throw err;
//       if(user) {
//         if(self.id === user.id) return respond(true);
//         return respond(false);
//       }
//       respond(true);
//     });
// }, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
  return value && value.length;
};

/**
 * Pre-save hook
 */
// PlaylistSchema
//   .pre('save', function(next) {
//     if (!this.isNew) return next();

//     if (!validatePresenceOf(this.hashedPassword))
//       next(new Error('Invalid password'));
//     else
//       next();
//   });

/**
 * Methods
 */
PlaylistSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  }
};

module.exports = mongoose.model('Playlist', PlaylistSchema);

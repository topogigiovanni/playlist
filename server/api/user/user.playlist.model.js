'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var PlaylistSchema = new Schema({
  title: String,
  videos: [Schema.Types.Mixed]
});

module.exports = mongoose.model('Playlist', PlaylistSchema);

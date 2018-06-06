const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://admin:admin1@ds243728.mlab.com:43728/truthdaredie');

const db = mongoose.connection;
db.once('open', () => {
  console.log('connected to db');
});
db.on('error', console.error.bind(console, 'connection error:'));

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  password: String,
  avatar: String,
  email: String,
  save_tokens: Number,
  death_tokens: Number,
});

const User = mongoose.model('User', UserSchema);


// function for sign in
// check if user already exists by email
// if user doesn't exist, save to the database
const save = (user, hash, callback) => {
  User.findOne({ username: user.username }, (err, data) => {
    if (err) {
      callback(err);
    } else if (!err && data) {
      console.log(data, 'this is the data');
      console.log('User Exists Already');
      callback('User Exists Already');
    } else {
      const newUser = new User({
        username: user.username,
        password: hash,
        avatar: user.image_url,
        email: user.email,
        save_tokens: 0,
        death_tokens: 0,
      });
      newUser.save((error, userInfo) => {
        if (error) {
          console.error(error);
        } else {
          console.log('user saved');
          callback(userInfo);
        }
      });
    }
  });
};
const getUser = (request, callback) => {
  User.findOne({ username: request.username }, (err, user) => {
    if (err) {
      callback(err);
    } else if (user === null) {
      callback('Username or Password is incorrect');
    } else {
      bcrypt.compare(request.password, user.password, (error, match) => {
        if (error) {
          callback('No Match');
        } else if (!match) {
          callback('UserName or Password is incorrect');
        } else {
          callback('Match');
        }
      });
    }
  });
};

module.exports.save = save;
module.exports.getUser = getUser;

const mongoose = require('mongoose');

mongoose.connect('mongodb://admin:admin1@ds243728.mlab.com:43728/truthdaredie');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected');
});

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
const save = (user) => {
  User.findOne({ email: user.email }, (err, data) => {
    if (!err && data) {
      console.log('User Exists Already');
    } else {
      const newUser = new User({
        username: user.username,
        id_token: user.id,
        avatar: user.image_url,
        email: user.email,
        save_tokens: 0,
        death_tokens: 0,
      });

      newUser.save((error) => {
        if (error) {
          console.error(error);
        } else {
          console.log('saved user');
        }
      });
    }
  });
};

module.exports.save = save;

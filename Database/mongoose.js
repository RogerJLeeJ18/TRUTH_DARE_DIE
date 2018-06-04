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
  id_token: String,
  avatar: String,
  email: String,
  save_tokens: Number,
  death_tokens: Number,
});

const User = mongoose.model('User', UserSchema);

const save = (user) => {
  const newUser = new User({
    username: user.name,
    id_token: user.id,
    avatar: user.image_url,
    email: user.email,
    save_tokens: 0,
    death_tokens: 0,
  });

  newUser.save((err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('saved');
    }
  });
};

const findUser = (user) => {
  User.findOne({ email: user.email }, (err, data) => {
    if (err) {
      console.error(err);
    }
    return true;
  });
};

module.exports.findUser = findUser;
module.exports.save = save;

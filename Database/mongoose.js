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

const RoomSchema = new Schema({
  room: String,
  status: String,
});

const Room = mongoose.model('Room', RoomSchema);


// function for sign in
// check if user already exists by email
// if user doesn't exist, save to the database
const save = (user, hash, callback) => {
  User.findOne({ username: user.username }, (err, data) => {
    if (err) {
      callback(err);
    } else if (!err && data) {
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
          callback({
            username: user.username,
            save_tokens: user.save_tokens,
            death_tokens: user.death_tokens,
          });
        }
      });
    }
  });
};


const findRooms = (data, callback) => {
  Room.findOne({ room: data }, (err, room) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, room);
    }
  });
};
const createRoom = (roomName, callback) => {
  findRooms(roomName.room, (err, response) => {
    if (err) {
      callback(err);
    } else if (response !== null && response.room === roomName.room) {
      callback('Room already Exists!');
    } else {
      const newRoom = new Room({
        room: roomName.room,
        status: 'waiting',
      });
      newRoom.save((error) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Room Created');
          callback('Room Created');
        }
      });
    }
  });
};

module.exports.save = save;
module.exports.getUser = getUser;
module.exports.createRoom = createRoom;
module.exports.findRooms = findRooms;


const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://admin:admin1@ds243728.mlab.com:43728/truthdaredie');

const db = mongoose.connection;
db.once('open', () => {
  console.log('connected to db');
});
db.on('error', console.error.bind(console, 'connection error:'));

const Schema = mongoose.Schema;


// user schema
const UserSchema = new Schema({
  username: String,
  password: String,
  avatar: String,
  email: String,
  save_tokens: Number,
  death_tokens: Number,
  win_tokens: Number,
});

const User = mongoose.model('User', UserSchema);

// room schema
const RoomSchema = new Schema({
  room: String,
  status: String,
});

const Room = mongoose.model('Room', RoomSchema);


// Truths schema
const TruthSchema = new Schema({
  category: String,
  truth_id: Number,
  truth: String,
});

const Truth = mongoose.model('Truth', TruthSchema);


// Dares Schema
const DareSchema = new Schema({
  category: String,
  dare: String,
  dare_id: Number,
});

const Dare = mongoose.model('Dare', DareSchema);


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
        win_tokens: 0,
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

// function that will get a user from db when user logs in
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
            win_tokens: user.win_tokens,
          });
        }
      });
    }
  });
};

// function that will find a room that already exists
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

const generator = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// function that will return a random number to use for getTruth and getDares functions
const randomID = () => Math.floor((Math.random() * 5) + 1);

// function to get the truths randomly
const getTruth = (id, callback) => {
  Truth.findOne({ truth_id: id }, (err, truth) => {
    if (err) {
      console.error(err);
      callback(err);
    } else {
      callback(truth);
    }
  });
};

// function to get the dares randomly
const getDare = (id, callback) => {
  Dare.find({ dare_id: id }, (err, dare) => {
    if (err) {
      console.error(err);
      callback(err);
    } else {
      callback(dare[0]);
    }
  });
};

// function that will create a new room
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
module.exports.generator = generator;
module.exports.randomID = randomID;
module.exports.getTruth = getTruth;
module.exports.getDare = getDare;
module.exports.findRooms = findRooms;

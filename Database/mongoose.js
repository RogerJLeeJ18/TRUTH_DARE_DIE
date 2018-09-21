const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// mongoose.connect('mongodb://admin:admin1@ds243728.mlab.com:43728/truthdaredie');
mongoose.connect('mongodb://osd-user:0sdpassw0rd@ds251622.mlab.com:51622/osd');

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
  twitter: String,
  avatar: String,
  email: String,
  save_tokens: { type: Number, default: 0 },
  death_tokens: { type: Number, default: 0 },
  win_tokens: { type: Number, default: 0 }
});

// room schema
const RoomSchema = new Schema({
  room: String,
  status: String,
  admin: String,
  rating: String
});

// Truths schema
const TruthSchema = new Schema({
  category: String,
  truth_id: Number,
  truth: String
});

// Dares Schema
const DareSchema = new Schema({
  category: String,
  dare: String,
  dare_id: Number
});

const User = mongoose.model('User', UserSchema);
const Room = mongoose.model('Room', RoomSchema);
const Truth = mongoose.model('Truth', TruthSchema);
const Dare = mongoose.model('Dare', DareSchema);

const addTruth = (category, truth, truth_id) => {
  const newTruth = new Truth({
   category: category,
   truth: truth,
   truth_id: truth_id,
  });
  newTruth.save((error, truthInfo) => {
    if (error) {
      console.error(error);
    } else {
      console.log('user saved');
      
    }
  });
}

const addDare = (category, dare, dare_id) => {
  const newDare = new Dare({
    category: category,
    dare: dare,
    dare_id: dare_id,
  });
  newDare.save((error, dareInfo) => {
    if (error) {
      console.error(error);
    } else {
      console.log('dare saved');

    }
  });
}

// addDare('mild', 'Scream pickles as loud as you can', 1);

// function for sign up
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
        twitter: user.twitter,
        avatar: user.image_url,
        email: user.email,
        save_tokens: 0,
        death_tokens: 0,
        win_tokens: 0
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
            twitter: user.twitter,
            save_tokens: user.save_tokens,
            death_tokens: user.death_tokens,
            win_tokens: user.win_tokens
          });
        }
      });
    }
  });
};

// function that will find a room that already exists
const findRoom = (data, callback) => {
  Room.findOne({ room: data }, (err, room) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, room);
    }
  });
};

// function that will get all the rooms from the database
const getAllRooms = () => {
  return Room.find({});
};

// function that will return a random number to use for getTruth and getDares functions
const randomID = () => Math.floor((Math.random() * 5) + 1);

// function to get the truths randomly
const getTruth = (id, callback) => {
  console.log(id, " id in get truth")
  Truth.findOne({ truth_id: id }, (err, truth) => {
    if (err) {
      console.error(err);
      callback(err);
    } else {
      console.log(truth, "  in truth")
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
const createRoom = (roomInfo, callback) => {
  findRoom(roomInfo.room, (err, response) => {
    if (err) {
      callback(err);
    } else if (response !== null && response.room === roomInfo.room) {
      callback('Room already Exists!');
    } else {
      const newRoom = new Room({
        room: roomInfo.room,
        status: 'waiting',
        admin: roomInfo.username,
        rating: roomInfo.rating
      });
      newRoom.save((error) => {
        if (error) {
          console.log(error);
        } else {
          console.log(error);
          callback('Room Created');
        }
      });
    }
  });
};

const updateRoom = (room, callback) => {
  Room.updateOne({ room: room.room }, {
    status: 'start'
  }, (err, resp) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, 'Updated and ready!');
    }
  });
};

const endRoom = (room, callback) => {
  Room.deleteOne({ room: room.room }, (err) => {
    if (err) {
      callback('Room not found.', null);
    } else {
      callback(null, 'Game has finished');
    }
  });
};

const addDeath = (reqUsername, callback) => {
  User.findOneAndUpdate({ username: reqUsername }, { $inc: { death_tokens: 1 } }, { new: true }, (err, response) => {
    if (err) {
      callback(err);
    } else {
      callback(response);
    }
  });
};

module.exports.save = save;
module.exports.getUser = getUser;
module.exports.createRoom = createRoom;
module.exports.randomID = randomID;
module.exports.getTruth = getTruth;
module.exports.getDare = getDare;
module.exports.findRoom = findRoom;
module.exports.getAllRooms = getAllRooms;
module.exports.endRoom = endRoom;
module.exports.updateRoom = updateRoom;
module.exports.addDeath = addDeath;

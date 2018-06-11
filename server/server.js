const express = require('express');
const bodyParser = require('body-parser');
const dataSave = require('../Database/mongoose');
const http = require('http');
// const https = require('https');
const path = require('path');
const socketIO = require('socket.io');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');


const app = express();
const server = http.Server(app);
const io = socketIO.listen(server);

app.use(express.static(path.join(__dirname, '/../database')));
app.use(express.static(path.join(__dirname, '/../dist')));

app.get('/', (req, res) => {
  res.sendStatus(201);
});

app.use(bodyParser.json());

app.use(cookieSession({
  name: 'session',
  secret: 'TDD',
  maxAge: 24 * 60 * 60 * 1000,

}));

// get request for login
app.get('/users', (req, res) => {
  const request = req.query;
  console.log(request, 'this is the request');
  dataSave.getUser(request, (response) => {
    if (typeof response !== 'object') {
      res.status(404).send(response);
    } else {
      res.status(200).send(response);
    }
  });
});

// post request to database for sign up
app.post('/users', (req, res) => {
  const data = req.body;
  console.log(data);
  bcrypt.hash(data.password, 10, (err, hash) => {
    if (err) {
      console.log(err);
    }
    dataSave.save(data, hash, (response) => {
      console.log(data);
      if (typeof response === 'string') {
        res.send(response);
      } else {
        console.log(response);
        const info = {
          username: response.username,
          save_tokens: response.save_tokens,
          death_tokens: response.death_tokens,
          win_tokens: response.win_tokens,
        };
        res.status(201).send(info);
      }
    });
  });
});

// post request to add a room to db
app.post('/start', (req, res) => {
  const request = req.body;
  console.log(request);
  dataSave.createRoom(request, (response) => {
    if (!response) {
      console.log(response);
      res.status(404).send('Invalid');
    } else {
      res.status(201).send(response);
    }
  });
});


app.get('/rooms/:id', (req, res) => {
  console.log(req.params.id);
  const response = req.params.id;
  dataSave.findRooms(response, (err, room) => {
    if (err || room === null) {
      res.status(404).send('Room not available');
    } else {
      res.status(200).send(room);
    }
  });
});

// get request to get truth from db
app.get('/truths', (req, res) => {
  dataSave.getTruth(dataSave.randomID(), (response) => {
    console.log(`the truth is: ${response.truth}`);
    res.status(201).send(response.truth);
  });
});

// get request to get dare from db
app.get('/dares', (req, res) => {
  dataSave.getDare(dataSave.randomID(), (response) => {
    console.log(`The dare is: ${response.dare}`);
    res.status(201).send(response.dare);
  });
});

app.get('/ready', (req, res) => {
  const roomName = req.headers;
  dataSave.updateRoom(roomName, (err, response) => {
    if (err) {
      res.status(404).send('Something went wrong!');
    } else {
      res.status(200).send('Updated');
    }
  });
});

app.get('/end', (req, res) => {
  const roomName = req.headers;
  dataSave.endRoom(roomName, (err, response) => {
    if (err) {
      res.status(404).send('Invalid room');
    } else {
      res.status(200).send('The game has ended!');
    }
  });
});

const players = [];
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('create', (room) => {
    console.log('Joined');
    socket.broadcast.join(room);
  });

  socket.on('sendTruth', (truth) => {
    socket.broadcast.emit('sendTruth', truth);
  });
  socket.on('sendMessage', (message) => {
    console.log(message);
    socket.broadcast.emit('sentMessage', message);
  });
  socket.on('join', (room) => {
    socket.join(room);
    socket.on('send-username', (username) => {
      socket.username = username;
      socket.hasGone = false;
      socket.alive = true;
      players.push(socket.username);
      console.log(socket.username, 'username');
    });
    // request to get the random socket id
    socket.broadcast.emit('join', room);
  });
  let truthOrDare;
  app.post('/room', (req, res) => {
    const reqRoom = req.body.room;
    const socketIdArray = Object.keys(io.sockets.adapter.rooms[reqRoom].sockets);
    const randomSocket = Math.floor(Math.random() * (socketIdArray.length));
    const response = socketIdArray[randomSocket];
    const userSocket = io.sockets.sockets;
    const currentUser = userSocket[response];
    truthOrDare = currentUser;
    const game = () => {
      currentUser.emit('this-user-turn', 'It is your turn!');
      currentUser.hasGone = true;
      socketIdArray.forEach((socketId) => {
        if (socketId !== response) {
          io.sockets.sockets[socketId].emit('user-turn', `${io.sockets.sockets[response].username}'s turn!`);
        }
      });
      // setInterval(() => {

      // }, 10000);
      res.send(response);
    };
    game();
    // if (socketIdArray.length > 3) {
    //   setInterval(game, 10000);
    // } else {
    //   socket.emit('game-end');
    // }
  });
  const userVotes = { pass: 0, fail: 0, count: 0 };
  app.post('/votes', (req, res) => {
    const userVote = req.body.vote;
    userVotes.count += 1;
    userVotes[userVote] += 1;
    console.log(userVotes);
    setTimeout(() => {
      if (userVotes.pass > userVotes.fail) {
        res.status(200).send(`${truthOrDare.username} lives on for another round!`);
      } else {
        console.log(truthOrDare.id);
        res.status(200).send(`${truthOrDare.username} has been eliminated!`);
        socket.to(truthOrDare.id).emit('failure', truthOrDare.username);
      }
    }, 10000);
  });
  socket.on('disconnect', () => {
    console.log('user has disconnected');
    socket.disconnect(true);
  });
});

const role = 'production';
const PORT = process.env.ENV_ROLE === role ? 80 : 3000;

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});


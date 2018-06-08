const express = require('express');
const bodyParser = require('body-parser');
const dataSave = require('../Database/mongoose');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const formidable = require('express-formidable');

const app = express();
const server = http.Server(app);
const io = socketIO.listen(server);

app.use(express.static(path.join(__dirname, '/../database')));
app.use(express.static(path.join(__dirname, '/../dist')));
app.use(formidable());

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
      if (typeof response === 'string') {
        res.send(response);
      } else {
        const info = {
          username: response.username,
          save_tokens: response.save_tokens,
          death_tokens: response.death_tokens,
          win_tokens: response.win_tokens,
        };
        res.send(info);
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
      res.status(200).send(`${room} available`);
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
  })
});

app.post('/video', (req, res) => {
  console.log(req.files, 'this is the req.body');
});

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
    socket.broadcast.emit('join', room);
  });
  socket.on('disconnect', () => {
    console.log('user has disconnected');
    socket.disconnect(true);
  });
});

server.listen(3000, () => {
  console.log('listening on port 3000');
});

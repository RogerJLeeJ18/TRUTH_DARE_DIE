const express = require('express');
const bodyParser = require('body-parser');
const dataSave = require('../Database/mongoose');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const bcrypt = require('bcrypt');

const app = express();
const server = http.Server(app);
const io = socketIO.listen(server);

app.use(express.static(path.join(__dirname, '/../database')));
app.use(express.static(path.join(__dirname, '/../dist')));

app.get('/', (req, res) => {
  res.sendStatus(201);
});

app.use(bodyParser.json());

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
        const info = { username: response.username, save_tokens: response.save_tokens, death_tokens: response.death_tokens };
        res.send(info);
      }
    });
  });
});

app.post('/start', (req, res) => {
  const request = req.body;
  dataSave.createRoom(request, (response) => {
    if (!response) {
      console.log(response);
      res.status(404).send('Invalid');
    } else {
      res.status(201).send(response);
    }
  });
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.adapter.nsp.name);
  socket.on('create', (room) => {
    socket.join(room);
  });
  socket.on('disconnect', () => {
    console.log('user has disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on port 3000');
});

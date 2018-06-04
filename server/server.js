const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const dataSave = require('../Database/mongoose');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, '/../database')));
app.use(express.static(path.join(__dirname, '/../client')));

app.get('/', (req, res) => {
  res.sendStatus(201);
});

app.use(bodyParser.json());

app.get('/users', (req, res) => {

});

// post request to database for sign up
app.post('/users', (req, res) => {
  const data = req.body;
  console.log(data);
  dataSave.save(data);
  res.send('ok');
});


io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

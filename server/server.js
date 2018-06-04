const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.use(express.static(`${__dirname}/../database`));
app.use(express.static(`${__dirname}/../dist`));

app.get('/', (req, res) => {
  res.sendStatus(201);
});

app.post('/', (req, res) => {
  res.sendStatus(201);
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

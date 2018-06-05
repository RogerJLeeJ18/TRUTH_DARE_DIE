const express = require('express');
const bodyParser = require('body-parser');
const dataSave = require('../Database/mongoose');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const bcrypt = require('bcrypt');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, '/../database')));
app.use(express.static(path.join(__dirname, '/../dist')));

app.get('/', (req, res) => {
  res.sendStatus(201);
});

app.use(bodyParser.json());

app.get('/users', (req, res) => {
  const request = req.query;
  console.log(request);
  bcrypt.hash(request.password, 10, (err, hash) => {
    if (err) {
      res.status(404).send('Error with hashing');
    } else {
      dataSave.getUser(request, hash, (error, response) => {
        if (error) {
          res.status(404).send('Username or Password is incorrect!');
        } else if (response.length === 0) {
          res.status(404).send('Username of Password is incorrect!');
        } else {
          console.log(response);
          res.status(200).send('Success');
        }
      });
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
      res.send(response);
    });
  });
});


io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(3000, () => {
  console.log('listening on port 3000');
});

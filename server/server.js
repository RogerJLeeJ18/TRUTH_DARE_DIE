const express = require('express');
const bodyParser = require('body-parser');
const dataSave = require('../Database/mongoose');
const http = require('http');
const https = require('https');
const path = require('path');
const socketIO = require('socket.io');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const fs = require('fs');
var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
var Twitter = require('twitter'); 
const { CONSUMER_SECRET }  = require('../config.js');
const  { TOKEN_SECRET } = require('../config.js');


const key = fs.readFileSync(`${__dirname}/rtc-video-room-key.pem`, 'utf8');
const cert = fs.readFileSync(`${__dirname}/rtc-video-room-cert.pem`, 'utf8');
// need to see if https works with sockets
const options = { key, cert };

const app = express();
// using https instead of http
const server = http.createServer(options, app);
const io = socketIO.listen(server);


app.use(express.static(path.join(__dirname, '/../database')));
app.use(express.static(path.join(__dirname, '/../dist')));
app.use(bodyParser.json());
app.use(cookieSession({
  name: 'session',
  secret: 'TDD',
  maxAge: 24 * 60 * 60 * 1000
}));

app.get('/', (req, res) => {
  res.sendStatus(201);
});

var discovery = new DiscoveryV1({
  username: 'f61125d1-0591-4a3f-a6eb-f83ea000f11f',
  password: 'JPt1KjjuarZ1',
  version_date: '2017-11-07'
});
// console.log(discovery)
const file = fs.readFileSync('./server/tweets.html');

// discovery.query({ environment_id: '1c012708-9b11-4f78-b6a5-d2b1d9aea9ee', collection_id: 'b439a6dc-5f36-4ac6-83c9-4e6fe67f8ebd', query: 'text:fear' }, 
// function (error, data) {
//   console.log("query response start ", JSON.stringify(data, null, 2), "query response end");
// });

var client = new Twitter({
  consumer_key: 'a4Gh4PKbKDEQGPlwF4swKwtBl',
  consumer_secret: `${CONSUMER_SECRET}`,
  access_token_key: '953671599273672704-UDDcr6KlemZnIWsLzsvi4L0rNGRRNNo',
  access_token_secret: `${TOKEN_SECRET}`
});

app.post('/tweet', ({ body }, res) => {
  console.log({ body });
  const params = { screen_name: body.twitter };
  client.get('statuses/user_timeline', params, (error, tweets, response) => {
    // console.log(tweets[0].text, "tweets")
    const html = [
      `<div>${params.screen_name}</div>`,
      `<div>${tweets[0].text}</div>`
    ].join('');
    console.log(tweets[0].text);
    if (!error) {
      fs.writeFile('./server/tweets.html', html, 'utf-8', () => {
        discovery.addDocument(
          {
            environment_id: '1c012708-9b11-4f78-b6a5-d2b1d9aea9ee',
            collection_id: 'b439a6dc-5f36-4ac6-83c9-4e6fe67f8ebd',
            file
          },
          (err, data) => {
            if (err) {
              console.error({ err });
            } else {
              console.log(JSON.stringify(data, null, 2), ' data from add doc response');
              res.status(201).send('file has been written woot');
            }
          }
        );
      });
    } else {
      console.log({ error });
    }
  });
});

// var html = [
//   '<div> A line</div>',
//   '<div> Add more lines</div>',
//   '<div> To the array as you need.</div>'
// ].join('');

// // get tweet from user
// app.post('/tweet', (req, res) => {
//   client.get('statuses/user_timeline', req.body, function (error, tweets, response) {
//     if (!error) {
//       fs.writeFile('./server/tweets.html', html, 'utf-8', () => {
//         res.status(201).send("file has been written woot");
//       })
    
//     } else {
//       console.log(error, "in tweet handle")
//     }
//   });
// });

// get request for login
app.get('/users', (req, res) => {
  const request = req.query;
  // console.log(request, 'this is the request');
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
  // console.log(data);
  bcrypt.hash(data.password, 10, (err, hash) => {
    if (err) {
      console.log(err);
    }
    dataSave.save(data, hash, (response) => {
      console.log(data, 'data');
      if (typeof response === 'string') {
        res.send(response);
      } else {
        console.log(response, 'response');
        const info = {
          username: response.username,
          twitter: response.twitter,
          save_tokens: response.save_tokens,
          death_tokens: response.death_tokens,
          win_tokens: response.win_tokens
        };
        res.status(201).send(info);
      }
    });
  });
});

// post request to add a room to db
app.post('/start', (req, res) => {
  const request = req.body;
  // console.log(request);
  dataSave.createRoom(request, (response) => {
    if (!response) {
      // console.log(response);
      res.status(404).send('Invalid');
    } else {
      res.status(201).send(response);
    }
  });
});


app.get('/rooms/:id', (req, res) => {
  // console.log(req.params.id);
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
    // console.log(`the truth is: ${response.truth}`);
    res.status(201).send(response.truth);
  });
});

// get request to get dare from db
app.get('/dares', (req, res) => {
  dataSave.getDare(dataSave.randomID(), (response) => {
    // console.log(`The dare is: ${response.dare}`);
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

app.post('/grave', (req, res) => {
  const username = req.body.username
  dataSave.addDeath(username, (err, response) => {
    if (err) {
      console.error(err);
      res.send(err);
    } else {
      res.send(response);
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
let userVotes = { pass: 0, fail: 0, count: 0 };
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('create', (room) => {
    console.log('Joined');
    socket.broadcast.join(room);
  });
  socket.on('start', () => {
    socket.broadcast.emit('gameStart', 'The game has started');
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
    socket.broadcast.emit('join', room);
  });
  let truthOrDare;
  let currentRoom;
  app.post('/room', (req, res) => {
    const reqRoom = req.body.room;
    const socketIdArray = Object.keys(io.sockets.adapter.rooms[reqRoom].sockets);
    setInterval(() => {
      if (socketIdArray.length < 4) {
        socket.emit('finished', 'You won!');
      }
    }, 5000);
    const randomSocket = Math.floor(Math.random() * (socketIdArray.length));
    // console.log(socketIdArray, "socket array")
    const response = socketIdArray[randomSocket];
    // console.log(response, " response")
    // console.log(io.sockets, " io sockets")
    const userSocket = io.sockets.sockets;
    const currentUser = userSocket[response];
    truthOrDare = currentUser;
    currentRoom = reqRoom;
    const game = () => {
      userVotes = { pass: 0, fail: 0, count: 0 };
      currentUser.emit('this-user-turn', 'It is your turn!');
      currentUser.emit('sentMessage', `${currentUser.username}'s turn`);
      currentUser.hasGone = true;
      socketIdArray.forEach((socketId) => {
        if (socketId !== response) {
          io.sockets.sockets[socketId].emit('user-turn', `${currentUser.username}'s turn!`);
        }
      });
      // res.send(response);
    };
    game();
  });
  app.post('/votes', (req, res) => {
    const userVote = req.body.vote;
    userVotes.count += 1;
    userVotes[userVote] += 1;
    console.log(userVotes, 'user votes in /votes handler');
    setTimeout(() => {
      if (userVotes.pass >= userVotes.fail) {
        res.status(200).send(`${truthOrDare.username} lives on for another round!`);
        socket.emit('alive', `${truthOrDare.username} Lives for another round!`);
      } else {
        console.log(truthOrDare.id);
        res.status(200).send(`${truthOrDare.username} has been eliminated!`);
        socket.to(truthOrDare.id).emit('failure', truthOrDare.username);
        socket.broadcast.emit('userDeath', `${truthOrDare.username} has been eliminated!`);
      }
    }, 10000);
  });
  socket.on('disconnect', () => {
    console.log('user has disconnected');
    socket.disconnect(true);
  });
});

const PORT = process.env.PORT || 5000;


server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

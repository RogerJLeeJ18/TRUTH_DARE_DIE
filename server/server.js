const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const dataSave = require('../Database/mongoose');


const app = express();

app.use(express.static(`${__dirname}/../client`));
app.use(express.static(`${__dirname}/../database`));
app.use(bodyParser.json());

app.get('/users', (req, res) => {

});

// post request to database for sign up
app.post('/users', (req, res) => {
  // request('/users', (err, response, body) => {
  //   if (err) {
  //     console.error(err);
  //   }
  const data = req.body;
  console.log(data);
  if (dataSave.findUser(data)) {
    res.send('User Already Exists');
  } else {
    dataSave.save(data);
    res.send('Welcome');
  }
  // });
});

app.listen(3000, () => {
  console.log('listening on 3000');
});

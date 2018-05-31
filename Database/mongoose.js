const mongoose = require('mongoose');

mongoose.connect('mongodb://<admin>:<admin1>@ds243728.mlab.com:43728/truthdaredie');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connected');
});

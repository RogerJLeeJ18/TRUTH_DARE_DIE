const express = require('express');

const app = express();

app.use(express.static(`${__dirname}/../client`));
app.use(express.static(`${__dirname}/../database`));

app.get('', (req, res) => {
  
});

app.post('', (req, res) => {

});

app.listen(3000, () => {
  console.log('listening on 3000');
});

const express = require('express');
const githubHelper = require('../helpers/github.js');
const bodyParser = require('body-parser');
let app = express();

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error'));
// db.once('open', ()=>{
//   console.log('connected to db');
// })


app.use(express.static(__dirname + '/../client/dist'));
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/repos', function (req, res) {
  // TODO - your code here!
  // This route should take the github username provided
  // and get the repo information from the github API, then
  // save the repo information in the database

  githubHelper.getReposByUsername(req.body.searched)

  res.send('posted')
});

app.get('/repos', function (req, res) {
  // TODO - your code here!
  // This route should send back the top 25 repos
});

let port = 1128;

app.listen(port, function () {
  console.log(`listening on port ${port}`);
});


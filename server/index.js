const express = require('express');
const githubHelper = require('../helpers/github.js');
const database = require('../database/index.js')
const bodyParser = require('body-parser');
let app = express();


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

  database.findTop()
  .then((results)=>{
    var sortedResults = results.sort((a,b)=>b.forksCount - a.forksCount).slice(0,25);
    res.send({sortedResults, results})
  })

});

let port = process.env.PORT;

app.listen(process.env.PORT || 3000, function () {
  console.log(`listening on port ${port}`);
});


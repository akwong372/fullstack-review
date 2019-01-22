const request = require('request');
const database = require('../database/index.js')
const config = require('../config.js');

let getReposByUsername = (username) => {
  // TODO - Use the request module to request repos for a specific
  // user from the github API
  var callback = (error, response, body) => {
    if (!error && response.statusCode == 200) {

      var results = JSON.parse(body)
      for (var i = 0; i < results.length; i++){
        database.save(results[i]);
      }
    }
  }

  // The options object has been provided to help you out,
  // but you'll have to fill in the URL
  let options = {
    url: `https://api.github.com/users/${username}/repos`,
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${process.env.GITHUBTOKEN}`
    }
  };

  request(options, callback);
}

module.exports.getReposByUsername = getReposByUsername;
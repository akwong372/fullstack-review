const mongoose = require('mongoose');
mongoose.Promise = require('bluebird')
// mongoose.connect('mongodb://localhost/fetcher', { useMongoClient: true });
mongoose.connect(process.env.MONGODB_URI);

let repoSchema = mongoose.Schema({
  // TODO: your schema here!
  repoID: Number,
  userName: String,
  repoName: String,
  url: String,
  forksCount: Number
});

let Repo = mongoose.model('Repo', repoSchema);

let save = (newRepo) => {
  // TODO: Your code here
  // This function should save a repo or repos to
  // the MongoDB
  var addNewRepo = new Repo({
    repoID: newRepo.id,
    userName: newRepo.owner.login,
    repoName: newRepo.name,
    url: newRepo.html_url,
    forksCount: newRepo.forks
  });

  Repo.findOne({ repoID: newRepo.id }, (err, repo) => {
    if (err) {
      console.log('findOne error: ', err)
    }
    // console.log('fineOne repo: ', repo)
    if (repo === null) {
      Repo.findOneAndUpdate({ repoID: newRepo.id }, addNewRepo, { new: true, upsert: true }, (err, data) => {
        console.log('repo added', data);
      });
    } else {
      var updated = {
        repoID: newRepo.id,
        userName: newRepo.owner.login,
        repoName: newRepo.name,
        url: newRepo.html_url,
        forksCount: newRepo.forks
      }
      Repo.findOneAndUpdate({ repoID: newRepo.id }, updated, { new: true, upsert: true }, (err, data) => {
        if (err){
          console.log('error: ', err)
        }
        console.log('repo added else ', data);
      });
    }
  })


}

let findTop = () => {
  return Repo.find({}, (err, docs) => {
    if (err) {
      console.log('error', err);
    }

    return docs;
  })
}

module.exports.save = save;
module.exports.findTop = findTop;
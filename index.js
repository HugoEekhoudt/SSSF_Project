
require ('custom-env').env()
var bodyParser = require('body-parser')
const express = require('express');
const app = express();
const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var patchSchema = new Schema({
  name:  String,
  description: String,
  image: String
});
const Patch = mongoose.model('Patch', patchSchema);

app.use(express.static('views'))
app.use("/images",express.static('images'))
app.use(bodyParser())

// if mongoose < 5.x, force ES6 Promise
// mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/test`).then(() => {
  console.log('Connected successfully.');
}, err => {
  console.log('Connection to db failed: ' + err);
});

app.get('/patches/all', (req, res) => {
    Patch.find().then(result => {
    res.json(result);
  });
});

app.get('/search/patch', (req, res) => {
  Patch.find({name: { $regex: '.*' + req.query.searchField + '.*' }}).then(result => {
  res.json(result);
});
});

app.delete('/rest/PatchService/patches', (req, res) => {
  Patch.find({_id:req.query.idToDelete }).remove().exec();
  Patch.find().then(result => {
  res.json(result);
  });
});

app.post('/createPatch', (req, res) => {
  Patch.create(req.body).then(post => {
     console.log(post.id);
  });
  res.sendfile(__dirname + '/views/index.html')
});

//Postman Post: http://localhost:3000/upload
app.post('/upload', (req, res, next) => {
    //do upload
    next();
});

app.use('/upload', (req, res, next) => {
    //do small
    next();
});

app.use('/upload', (req, res) => {
    //do big
    res.send('something');
});

app.listen(3000);
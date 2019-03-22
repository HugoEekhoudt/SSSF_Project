
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
app.use(bodyParser())

// if mongoose < 5.x, force ES6 Promise
// mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/test`).then(() => {
  console.log('Connected successfully.');
}, err => {
  console.log('Connection to db failed: ' + err);
});

app.post('/patch', (req, res) => {
  Patch.create(req.body).then(post => {
     console.log(post.id);
  });
  res.send("Patch Created.")
});

app.get('/patches/all', (req, res) => {
  var listOfPatches = new Array
    Patch.find().then(result => {
    result.forEach(element => {
      listOfPatches.push(element)
    });
    res.send(listOfPatches + `Got ${result.length} patches`);
  });
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
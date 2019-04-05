const https = require('https');
const fs = require('fs');

const sslkey = fs.readFileSync('certificate/ssl-key.pem');
const sslcert = fs.readFileSync('certificate/ssl-cert.pem')
const template = fs.readFileSync('views/index.html').toString()
const options = {
      key: sslkey,
      cert: sslcert
};

require ('custom-env').env()
require('dotenv').config();
const handle = require('handlebars');
const helmet = require('helmet');
var bodyParser = require('body-parser')
const express = require('express');
const app = express();
const http = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const session = require('express-session')


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
app.use(helmet());
app.use(session({ secret: process.env.SessionSeed, resave: false, saveUninitialized: false }))
app.use(passport.initialize());
app.use(passport.session())
app.use(bodyParser.urlencoded({extended: true}));

// if mongoose < 5.x, force ES6 Promise
// mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/test`).then(() => {
  console.log('Connected successfully.');
}, err => {
  console.log('Connection to db failed: ' + err);
});

const login = (req, res, next) => {
  if(req.user){
      next()
  }else{
      res.redirect('/login')
  }
}

passport.use(new LocalStrategy(
    (username, password, done) => {
        if (username !== process.env.USER || password !== process.env.PASS) {
            done(null, false, {message: 'Incorrect credentials.'});
            return;
        }
        return done(null, {id: process.env.USER}); // returned object usally contains something to identify the user
    }
));

passport.serializeUser(function(user, cb) {
  console.log('Serial')
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  console.log('Deserial')
  cb(null, {id: id});
});

app.get('/index', login,(req, res) => {
  Patch.find().then(result => {
    var index = handle.compile(template)
    res.send(index(result))
  });
});

app.get('/createPatch', login, (req, res) => {
  Patch.find().then(result => {
    var patch = handle.compile(template)
    res.send(patch(result))
  });
});

app.post('/login', 
  passport.authenticate('local', { 
    successRedirect: '/index', 
    failureRedirect: '/login' })
);

app.get('/login', (req, res) => {
res.sendFile(__dirname + '/views/login.html')
});

app.get('/logout', function(req, res){
  req.logout()
  res.redirect('/login')
})

app.get('/search/patch', (req, res) => {
  Patch.find({name: { $regex: '.*' + req.query.searchField + '.*' }}).then(result => {
  res.json(result);
});
});

app.get('/updatePatch', (req, res) => {
  res.sendFile(__dirname + '/views/updatePatch.html')
});

app.get('/patch', (req, res) => {
  Patch.find({_id:req.query.idToUpdate}).then(result => {
  res.json(result);
});
});

app.post('/rest/PatchService/patches', (req, res) => {
  console.log(req.body)
  Patch.updateOne({_id: req.body.idOfPatchToUpdate},{name: req.body.name, description: req.body.description, image: req.body.image}, (err, data) => {
    if (err) {
      res.send('cant update Patch')
    }
    res.redirect('https://localhost:3001/index')
  })
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
  res.redirect('https://localhost:3001/index')
});

http.use ((req, res, next) => {
  if (req.secure) {
    // request was via https, so do no special handling
    next();
  } else {
    // request was via http, so redirect to https
    res.redirect('https://localhost:3001/index');
  }
});

http.listen(3000);

https.createServer(options, app).listen(3001);
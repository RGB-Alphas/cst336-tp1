const Promise = require('bluebird');
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
var bodyParser = require('body-parser');

// import { AddUser, VerifyUser } from './services/registrar.js';
var registry = require('./services/userRegistrar');

const port = process.env.PORT || 3000;

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
//app.use(bodyParser.text({ type: 'text/html' }))
//app.use(bodyParser.json({ type: 'application/*+json' }))

let numUsers = 0;
let clientList = [];

io.on('connection', (client) => { 
  require('./services/loungeService.js')(io, client);
  require('./services/lobbyService.js')(io, client);
  require('./services/gameService.js')(io, client);
  
});

app.get('/', (req, res, next) => {
  const message = "Please register or sign in.";
  res.render('index.html', {message: message});
});

app.get('/register', function (req, res) {
  const name = req.query.accountName;
  const password = req.query.password;
  const alias = req.query.displayName;
  var userAdded = registry.AddUser(name, password, alias);
  if(userAdded) {
    const message = "You may log into your new account.";
    res.render('index.html', {message: message});
  }
  else {
    const message = "Registration Failed: User already exists.";
    res.render('index.html', {message: message});
  }

});

app.get('/auth', function (req, res) {
  // validate user
  // console.log("/auth");
  // console.log(req.query.loginName);
  // console.log(req.query.loginPassword);
  const name = req.query.loginName;
  const password = req.query.password;

  // console prints a list of all user profiles
  // registry.GetUserCredentials();

  var userVerified = registry.VerifyUser(name, password);
  if(userVerified)
    res.redirect(`/authenticated/${name}`);
  else {
    const message = "Invalid login";
    res.render('index.html', {message: message });
  }
    
});

app.get('/authenticated/:loginName', (req, res, next) => {
  // console.log(req.params.loginName);
  const name = req.params.loginName;
  res.render("authenticated/lounge.html", {name: name });
});

app.get('/lobby', function (req, res) {
  const name = req.query.lobbyName;
  // console.log(`Lobby Created: name: ${name}, ${password}.`);
  res.render("authenticated/lobby.html", { lobbyName: name, });
});

app.get('/game', (req, res, next) => {
  res.render("authenticated/game.html");
});

server.listen(port, () => {
  if(port == 3000)
    console.log("Server is running on 'http://localhost:%d/'.", port);
  else
  console.log("Server is running on port %d.", port);
});
const Promise = require('bluebird');
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
var bodyParser = require('body-parser');

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
  res.render('index.html');
});

app.get('/auth', function (req, res) {
  // validate user
  console.log(req.query.loginName);
  const name = req.query.loginName;
  res.redirect(`/authenticated/${name}`);
});

app.get('/authenticated/:loginName', (req, res, next) => {
  console.log(req.params.loginName);
  const name = req.params.loginName;
  res.render("authenticated/lounge.html", {name: name });
});

app.get('/lobby', (req, res, next) => {
  res.render("authenticated/lobby.html");
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
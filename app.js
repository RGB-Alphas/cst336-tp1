const Promise = require('bluebird');
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 3000;

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

server.listen(port, () => {
  if(port == 3000)
    console.log("Server is running on 'http://localhost:%d/'.", port);
  else
  console.log("Server is running on port %d.", port);
});

app.use(express.static(path.join(__dirname, 'public')));

let numUsers = 0;
let clientList = [];

app.get('/', (req, res) => {
  res.render('index.html');
});

app.get('/auth', (req, res) => {
  // validate user
  console.log(req.params.loginName);
  res.redirect('/authenticated');
});

app.get('/authenticated', (req, res, next) => {
  res.render("authenticated/lounge.html");
});

app.get('/lobby', (req, res, next) => {
  res.render("authenticated/lobby.html");
});


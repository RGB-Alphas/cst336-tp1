const Promise = require('bluebird');
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
var bodyParser = require('body-parser');
const mysql = require('mysql');
// var registry = require('./services/userRegistrar');
const session = require('express-session');
require('dotenv').config();
var sql = require('./services/mysqlService');

//Setting up data base
const connection = sql.Connect();

// import { AddUser, VerifyUser } from './services/registrar.js';


const port = process.env.PORT || 3000;

var jsonParser = bodyParser.json();
app.use(express.urlencoded({extended: true}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use('/scripts', express.static(path.join(__dirname + '/node_modules/')));   // Used for accessing faker.js
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(session({
  secret: "top secret!",
  resave : true,
  saveUninitialized: true,
}));


io.on('connection', (client) => { 
  require('./services/loungeService.js')(io, client);
  require('./services/lobbyService.js')(io, client);
  require('./services/gameService.js')(io, client);
  
});
//Home page 
app.get('/', (req, res, next) => {
  const message = "Please register or sign in.";
  res.render('index.html', {message: message});
});

// for action
app.post('/login', function(req, res) 
{
    var username = req.body.loginName;
    var password = req.body.loginPassword;
  
    if (username && password) 
    {
      // check if user exists
        sql.login(username, password, function(results){
          if(!results)
            console.log("Error selecting from DB");

          if(results.length === 0)
          {
            const message = "Incorrect Username and/or Password.";
            res.render('index.html', {message: message});
          }
          else{
          req.session.authenticated = true;
          req.session.username = results[0].accountName;
          req.session.alias = results[0].displayName;
          req.session.userId = results[0].id;

          console.log(`${results[0].accountName} ${results[0].displayName}`);
          res.redirect('/authenticated');
          }
        });
    } 
    else 
    {
      // res.send('');
      const message = "Please enter Username and Password.";
      res.render('index.html', {message: message});
      // res.end();
    }
});
//Gets data from form anc pushes to DataBase
app.post('/register', function (req, res) {
  let user = { accountName: req.body.accountName, password: req.body.password, displayName: req.body.displayName };
  //insert data into db
  sql.register(user,function(valid){
    if(valid){
    const message = "You may log into your new account.";
    res.render('index.html', {message: message});
  }
  else {
    const message = "Registration Failed: User already exists.";
    res.render('index.html', {message: message});
  }
  })
});

app.get('/authenticated', isAuthenticated, function(req, res){
  let name = req.session.username;
  let alias = req.session.alias;
  let userId = req.session.userId;
  res.render("authenticated/lounge.html", {name: name, alias: alias , userId: userId });
   
});


app.get('/lobby', isAuthenticated, function(req, res){
  const lobbyName = req.query.lobbyName || req.query.inputLobbyName;
  const userName = req.session.username;
  const alias = req.session.alias;

  // console.log(`Lobby Created: name: ${name}, ${password}.`);
  res.render("authenticated/lobby.html", { lobbyName: lobbyName, userName: userName, alias: alias });
});

app.get('/game', isAuthenticated, function(req, res){
  let name = req.session.username;
  let alias = req.session.alias;
  res.render("authenticated/game.html", { userName: name, alias: alias });
});

server.listen(port, () => {
  if(port == 3000)
    console.log("Server is running on 'http://localhost:%d/'.", port);
  else
  console.log("Server is running on port %d.", port);
});


//Function to authenticate user
function isAuthenticated(req,res,next){
  if(!req.session.authenticated){
    res.redirect('/');
  }
  else{
    next();
  }
}

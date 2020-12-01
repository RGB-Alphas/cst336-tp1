const Promise = require('bluebird');
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
var bodyParser = require('body-parser');
const mysql = require('mysql');
var registry = require('./services/userRegistrar');
const session = require('express-session');
require('dotenv').config();
//Setting up data base
const connection = mysql.createConnection({
 host: process.env.Host,
 user: process.env.User,
 password: process.env.Password,
 database: process.env.Database
});
// Connection to database
 connection.connect((err) => {
    if(err){
        console.log('Error connection to DB');
        return;
    }
    console.log('Connected!');
  });
  
// import { AddUser, VerifyUser } from './services/registrar.js';


const port = process.env.PORT || 3000;

var jsonParser = bodyParser.json();
app.use(express.urlencoded({extended: true}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(session({
  secret: "top secret!",
  resave : true,
  saveUninitialized: true,
}));



let numUsers = 0;
let clientList = [];

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
      var queryResults;
      connection.query('SELECT * FROM users WHERE accountName = ? AND password = ?', 
        [username, password], 
        function(error, results, fields) 
        {
          if(error)
            console.error(error);
          
          if(results.length === 0)
          {
            const message = "Incorrect Username and/or Password.";
            res.render('index.html', {message: message});
          }

          req.session.authenticated = true;
          req.session.username = results[0].accountName;
          req.session.alias = results[0].displayName;

          console.log(`${results[0].accountName} ${results[0].displayName}`);
          res.redirect('/authenticated');

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

app.get('/register', async function (req, res) {
  let valid = await dbInsertData(req.query.accountName, req.query.password,  req.query.displayName);
  console.log(valid);
  if(valid){
    const message = "You may log into your new account.";
    res.render('index.html', {message: message});
  }
  else {
    const message = "Registration Failed: User already exists.";
    res.render('index.html', {message: message});
  }

});

app.get('/authenticated', isAuthenticated, function(req, res){
  let name = req.session.username;
  let alias = req.session.alias;
  res.render("authenticated/lounge.html", {name: name, alias: alias });
   
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
  res.render("authenticated/game.html", {userName: name});
});

server.listen(port, () => {
  if(port == 3000)
    console.log("Server is running on 'http://localhost:%d/'.", port);
  else
  console.log("Server is running on port %d.", port);
});

//functions for database

//function accepts data from form, if user name is taken return false else return true
function dbInsertData(accountName, password, displayName){
  let user = { accountName: accountName, password: password, displayName: displayName };
  //insert data into db
  connection.query('INSERT INTO users SET ?', user, (err, res) => {
    if(err) {
      console.log("Error inserting into DB Code:")
      console.log(err.code);
      return false;
    }else
    console.log('Last insert ID:', res.insertId); 
    return true;
  });
 
}

//Function to authenticate user
function isAuthenticated(req,res,next){
  if(!req.session.authenticated){
    res.redirect('/');
  }
  else{
    next();
  }
}

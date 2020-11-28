const Promise = require('bluebird');
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
var bodyParser = require('body-parser');
const mysql = require('mysql');
const connection = mysql.createConnection({
 host: 'aqx5w9yc5brambgl.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
 user: 'm4uczqk07nizg82s',
 password: 'jjcce4z1yndxc21y',
 database: 'pxe2qkxvek3zot7z'
});

 connection.connect((err) => {
    if(err){
        console.log('Error connection to DB');
        return;
    }
    console.log('Connected!');
  });
  
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
  var userAdded = dbInsertData(name, password, alias);
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
  const password = req.query.loginPassword;

  // console prints a list of all user profiles
  // registry.GetUserCredentials();

  var userVerified = dbAuthenticate(name, password);
  console.log(userVerified);
  console.log("auther funcit0on");
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
    }
    console.log('Last insert ID:', res.insertId);
  });
  return true;
}

//Function to authenticate user
async function dbAuthenticate(accountName, password){
let user = { accountName: accountName, password: password};
let isValid = false;
connection.query('SELECT accountName, password FROM users', (err,rows) => {
 if(err) throw err;
 
 rows.forEach( (row) => {
   if(row.accountName == user.accountName){
     if(row.password == user.password){
       isValid = true;
       console.log(isValid);
       console.log("inside loop");
     }
   }
});
});
console.log(isValid);
console.log("end function");
return isValid;
}
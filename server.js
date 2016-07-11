//za Cloud9...
if (!process.env.PORT)
  process.env.PORT = 8080;

//priprava podatkovne baze
//var sqlite3 = require('sqlite3').verbose();
//var pb = new sqlite3.Database('imeBaze.sl3');


// Priprava strežnika
var formidable = require("formidable");
var express = require('express');
var expressSession = require('express-session');
var fs = require("fs");
var http = require("html");
var streznik = express();
streznik.set('view engine', 'ejs');
streznik.use(express.static('public'));
streznik.use(
  expressSession({
    secret: '1234567890QWERTY', 
    saveUninitialized: true,    
    resave: false,              
    cookie: {
      maxAge: 3600000       
    }
  })
);

//za strezenje staticnih datotek
streznik.use(express.static("/public"));
//nastavi path
var path = require('path');

//prikazi index.html
streznik.get('/', function(zahteva, odgovor) {
    console.log("ping..");
    odgovor.sendFile(path.join(__dirname, "views/index.html"));
})

streznik.listen(process.env.PORT, function() {
    console.log("Strežnik pognan!");
})
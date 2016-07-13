if (!process.env.PORT) {
  process.env.PORT = 8080;
}

//set up server
var express =require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

//moduls
var path = require('path');
var formidable = require("formidable");
var expressSession = require('express-session');
var fs = require("fs");
var sqlite3 = require('sqlite3').verbose();

//database
var pb = new sqlite3.Database('database.sl3');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(
  expressSession({
    secret: '1234567890QWERTY',
    saveUninitialized: true,
    resave: false,
    cookie: {
    maxAge: 3600000
    }
  })
);

/* ------------------------------------------------------------------------- express part ------------------------------------------ */
app.post('/prijavi', function(zahteva, odgovor) {
    var form = new formidable.IncomingForm();
    form.parse(zahteva, function(napaka1, polje, datoteke){
      zahteva.session.email = polje.email;
      zahteva.session.geslo = polje.pwd;
      odgovor.redirect('/tasks');
    })
});

app.get('/tasks', function(zahteva, odgovor) {
  pb.all("SELECT * FROM naloge", function(napaka1, vrstice1){
    pb.all("SELECT * FROM usluzbenci WHERE email = '" +zahteva.session.email + "' AND geslo = '"+zahteva.session.geslo+"'", function(napaka, vrstice){
      if(vrstice.length == 0){
        odgovor.redirect('/index');
      }
      else{
        console.log(vrstice1);
        odgovor.render('tasks', {usluzbenci: vrstice[0],naloge: vrstice1});
      }
    })
  })
});

app.get('/', function(zahteva, odgovor) {
    odgovor.redirect('/index');
})

app.get('/index', function(zahteva, odgovor) {
    odgovor.render('index', {sporocilo: ' '});
})

server.listen(process.env.PORT, function() {
  console.log("Strežnik posluša na portu " + process.env.PORT + ".");
});

//brodcast to all users
// io.on('connection', function (socket) {
//   socket.on('chat message', function (data) {
//     io.sockets.emit('chat message',data);
//   });
// });

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('chat message', (data) => {
    console.log(data);
    io.sockets.emit('chat',data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

if (!process.env.PORT) {
  process.env.PORT = 8080;
}

var steviloTaskov = 7;

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

app.post('/odjavi', function(zahteva, odgovor) {
  delete zahteva.session.email;
  delete zahteva.session.geslo;
  zahteva.session.sporociloZaIzpisNaStrani = "Uspešno ste se izpisali iz strani";
  odgovor.redirect('/');
});


app.get('/tasks', function(zahteva, odgovor) {
  pb.all("SELECT * FROM naloge", function(napaka1, vrstice1){
    pb.all("SELECT * FROM usluzbenci WHERE email = '" +zahteva.session.email + "' AND geslo = '"+zahteva.session.geslo+"'", function(napaka, vrstice){
      if(vrstice.length == 0){
        zahteva.session.sporociloZaIzpisNaStrani = "Neuspešna prijava, prijavite se še enkrat";
        odgovor.redirect('/index');
      }
      else{
        console.log(vrstice1);
        odgovor.render('front_page', {usluzbenci: vrstice[0],naloge: vrstice1});
      }
    })
  })
});

app.get('/', function(zahteva, odgovor) {
  if(!zahteva.session.sporociloZaIzpisNaStrani){
    zahteva.session.sporociloZaIzpisNaStrani = '';
  }
  odgovor.redirect('/index');
})

app.get('/index', function(zahteva, odgovor) {
    var izpis = zahteva.session.sporociloZaIzpisNaStrani
    delete sporociloZaIzpisNaStrani;
    odgovor.render('index', {sporocilo: izpis});
})

server.listen(process.env.PORT, function() {
  console.log("Strežnik posluša na portu " + process.env.PORT + ".");
});


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('kreirajOpravilo',(data,objekt) => {
    var stmt = "INSERT INTO naloge (usluzbenec_id, ehr_id,imeOpravila, loc_id, done) VALUES (?,?,?,?,?)";
      pb.run(stmt,[null,objekt.ehr,objekt.opis,objekt.loc,0]);
      steviloTaskov = steviloTaskov + 1;
    console.log(data);
    io.sockets.emit('kreiranoOpravilo',data);
  });

  socket.on('prevzemiOpravilo', (data,id) => {
    var sql03="UPDATE naloge SET usluzbenec_id = ? WHERE task_id = ?";
    pb.run(sql03,[data,id]);
    io.sockets.emit('prevzetoOpravilo',data);
  });

  socket.on('sprostiOpravilo', (id) => {
    var sql03="UPDATE naloge SET usluzbenec_id = ? WHERE task_id = ?";
    pb.run(sql03,[null,id]);
    io.sockets.emit('sproscenoOpravilo');
  });

  socket.on('koncanoOpravilo', (id) => {
    var sql03="UPDATE naloge SET done = ? WHERE task_id = ?";
    pb.run(sql03,[1,id]);
    console.log(id);
    io.sockets.emit('koncajOpravilo');
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

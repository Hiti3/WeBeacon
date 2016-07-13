var socketio = require('socket.io');
var io;
var stevilkaGosta = 1;
var vzdevkiGledeNaSocket = {};
var uporabljeniVzdevki = [];
var trenutniKanal = {};

exports.listen = function(streznik) {
  io = socketio.listen(streznik);
  io.set('log level', 1);
  io.sockets.on('connection', function (socket) {
    stevilkaGosta = dodeliVzdevekGostu(socket, stevilkaGosta, vzdevkiGledeNaSocket, uporabljeniVzdevki);
  });
};



function dodeliVzdevekGostu(socket, stGosta, vzdevki, uporabljeniVzdevki) {
  var vzdevek = document.getElementById('vzdevek').value;
  alert("blabla");
  vzdevki[socket.id] = vzdevek;
  socket.emit('vzdevekSpremembaOdgovor', {
    uspesno: true,
    vzdevek: vzdevek
  });
  uporabljeniVzdevki.push(vzdevek);
  return stGosta + 1;
}


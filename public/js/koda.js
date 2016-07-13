var socket = io();
$('form').submit(function(){
  var objekt ={ehr: "1", opis:"Lepa Brena", loc:"0"}
  socket.emit('kreirajOpravilo', $('#m').val(),objekt);
  $('#m').val('');
  return false;
});
// socket.on('kreiranoOpravilo', function(msg){
//   $('#messages').append($('<li>').text(msg));
//   $("#usluzbenci").text(msg);
// });
$('.todoItem').click(function() {
  var todoID = $(this).attr("id").replace("todo", "");
  var usluzbenec_id = $("#usluzbenec").text();
  socket.emit('prevzemiOpravilo', usluzbenec_id, todoID);
})

$('.progItem').click(function() {
  var progID = $(this).attr("id").replace("prog", "");
  socket.emit('sprostiOpravilo', progID);
})

$('.doneItem').click(function() {
  var doneID = $(this).attr("id").replace("done", "");
  socket.emit('koncanoOpravilo', doneID);
})

socket.on('opravila', function(opravila) {
  console.log(opravila);
});

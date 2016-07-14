var socket = io();

var lokacija = [[0,10,2], [10,0,12], [2,12,0]];
var naloge;

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
  var usluzbenec_id = $("#usluzbenec").text();
  var usluzbenecLoc = $("#usluzbenecLoc").text();
  var toDo = {};
  var stevecTD = 0
  naloge = opravila;
  for (var i in opravila) {
    if (opravila[i].usluzbenec_id === null ) {
      toDo[stevecTD] = opravila[i];
      toDo[stevecTD].index = stevecTD;
      stevecTD++;
    }
  }
  var datum = new Date();
  datum = datum.getTime();
  for (var i in toDo) {
    if (toDo[i].prioriteta === 1) {
      toDo[i].pomembnost = 10000;
      toDo[i].createDatum = 0;
    } else {
      toDo[i].pomembnost = 0;
    }
    var until = new Date(parseInt(toDo[i].createDatum));
    var razlika = until - datum;
    razlika = Math.floor(razlika / 60000); // v minute
    // var absolutna = razlika;
    // if (absolutna<0) {
    //   absolutna = absolutna * (-1);
    // }
    if (razlika<=-10) {
      toDo[i].pomembnost = 10000;
      toDo[i].createDatum = 0;
    } else if (-10<razlika && razlika<=10) {
      toDo[i].pomembnost += 3000;
    } else if (10<razlika && razlika<=60) {
      toDo[i].pomembnost += 2000;
    } else {
      toDo[i].pomembnost += 1000;
    }
    toDo[i].pomembnost -= lokacija[toDo[i].loc_id][usluzbenecLoc];
    if(toDo[i].createDatum === 0) {
      razlika = "Urgent";
    } else if (razlika > 60) {
      var kolkur = Math.floor(razlika/60);
      var kolkmin = razlika - (kolkur * 60);
      razlika = kolkur + "h" + kolkmin + "min";
    } else {
      razlika = razlika + "min";
    }
    toDo[i].until = razlika;
  }

  var swapped;
  console.log(toDo.length);
  do {
    swapped = false;
    for (var i=0; i < stevecTD-1; i++) {
      if (toDo[i].pomembnost < toDo[i+1].pomembnost) {
        var temp = toDo[i];
        toDo[i] = toDo[i+1];
          toDo[i+1] = temp;
          swapped = true;
      }
    }
  } while (swapped);
  console.log(toDo);
});

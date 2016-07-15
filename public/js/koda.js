var socket = io();

var lokacija = [[0,10,2], [10,0,12], [2,12,0]];
var naloge;

$('#posljiVsem').click(function(){
    var imeO = $('#dodajIme').val();
    var opisO = $('#dodajOpis').val();
    var lokacijaO= $('#dodajLokacijo').val();
    var prioritetaO =$('#dodajPrioriteto').val();
    var ehrIdO = $('#dodajEhr').val();
    var cas = $('#dodajCas').val();

    if($('#dodajEhr').val().length === 0){
      ehrIdO ="12345";
    }

    if(imeO == "" || opisO == "" || lokacijaO == "" || prioritetaO == "" || cas ==""){
      $('#uspesnoAliNeuspesno').modal('show');
      $('#sporociloTaska').text("Your task wasn't created!");
    }
    else{
      var usluzbenec_id = $("#usluzbenec").text();
      var kreiranObjekt = {ime:imeO, opis:opisO, loc:lokacijaO, priority: prioritetaO, ehr:ehrIdO, minute: cas};
      console.log(kreiranObjekt);
      socket.emit('kreirajOpravilo', usluzbenec_id, kreiranObjekt);
      $('#uspesnoAliNeuspesno').modal('show');
      $('#sporociloTaska').text("Your task is created!");
    }
})

$('.list-group').on('click', '.todoItem',function() {
  var todoID = $(this).attr("id").replace("todo", "");
  var usluzbenec_id = $("#usluzbenec").text();
  socket.emit('prevzemiOpravilo', usluzbenec_id, todoID);
})

$('.list-group').on('click', '.progItem',function() {
  var progID = $(this).attr("id").replace("prog", "");
  socket.emit('sprostiOpravilo', progID);
})

$('.list-group').on('click', '.doneItem',function() {
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
  // console.log(toDo);
  $('#list-todo').empty();
  var izpis = '';
  for(var i=0; i<stevecTD; i++) {
    var todo_ehrId = "'"+ toDo[i].ehr_id + "'";
    izpis += '<a href="#" class="list-group-item">\
    <i class="fa fa-exclamation" aria-hidden="true"></i>\
    '+toDo[i].imeOpravila+'\
    <button class="patientInfoBtn" onclick="prikaziPodatke('+toDo[i].task_id+','+todo_ehrId+',null,1)"><div class="glyphicon glyphicon-glyphicon glyphicon-info-sign logo-large" id="patientInfo"></div></button>\
    <button class="todoItem" id="todo'+toDo[i].task_id+'"><div class="glyphicon glyphicon-ok-circle logo-large" id="check_glyphon"></div></button></a>\
\
    <div class="panel panel-default" id="taskTo'+toDo[i].task_id+'" style="display:none">\
        <div class="panel-body" id="taskT'+toDo[i].task_id+'">\
          <div class="row">\
          <div class="col-sm-4">\
            <span class="label label-info">Description</span>\
            <input type="text" class="form-control input-mini" value="'+toDo[i].opisNaloge+'"readonly>\
          </div>\
          <div class="col-sm-4">\
            <span class="label label-info">Location</span>\
            <input type="text"class="form-control input-mini" value="'+toDo[i].loc_id+'" readonly>\
          </div>\
          <div class="col-sm-4">\
            <span class="label label-info">Until</span>\
            <input type="text" class="form-control input-mini" value="'+toDo[i].until+'" readonly>\
            </div>\
          </div>\
        </div>\
    </div>\
    <div class="panel panel-default" id="show'+toDo[i].task_id+'" style="display:none">\
      <div class="panel-body" id="panel'+toDo[i].task_id+'"></div>\
      </div>';
  }
  $('#list-todo').append(izpis);
  $('#list-progress1').empty();
  var izpis = '';
  var k = "'";
  for(var i in opravila) {
    if (!opravila[i].done && opravila[i].usluzbenec_id != null) {
      if (opravila[i].usluzbenec_id == usluzbenec_id) {
        var progress_ehrId = "'"+ opravila[i].ehr_id + "'";
        izpis += '<a href="#" class="list-group-item">'+opravila[i].imeOpravila+'\
        <button class="patientInfoBtn" onclick="prikaziPodatke('+opravila[i].task_id+','+progress_ehrId+','+opravila[i].usluzbenec_id+',null)"><div class="glyphicon glyphicon-glyphicon glyphicon-info-sign logo-large" id="patientInfo"></div></button>\
        <button class="doneItem" id="done'+opravila[i].task_id+'"><i class="glyphicon glyphicon-ok-circle logo-large" id="done_glyphon"></i></button>\
        <button class="progItem" id="prog'+opravila[i].task_id+'"><i class="glyphicon glyphicon-ban-circle logo-large" id="ban_glyphon"></i></button></a>\
\
        <div class="panel panel-default" id="progressTo'+opravila[i].task_id+'" style="display:none">\
        <div class="panel-body" id="progressT'+opravila[i].task_id+'">\
          <div class="row">\
          <div class="col-sm-4">\
            <span class="label label-info">Description</span>\
            <input type="text" class="form-control input-mini" value="'+opravila[i].opisNaloge+'"readonly>\
          </div>\
          <div class="col-sm-4">\
            <span class="label label-info">Location</span>\
            <input type="text"class="form-control input-mini" value="'+opravila[i].loc_id+'" readonly>\
          </div>\
          <div class="col-sm-4">\
            <span class="label label-info">Until</span>\
            <input type="text" class="form-control input-mini" value="'+opravila[i].createDatum+'" readonly>\
            </div>\
          </div>\
        </div>\
      </div>\
      <div class="panel panel-default" id="see'+opravila[i].task_id+'" style="display:none">\
        <div class="panel-body" id="panela'+opravila[i].task_id+'"></div>\
      </div>';

      }
    }
  }
  $('#list-progress1').append(izpis);
  $('#list-progress2').empty();
  var izpis = '';
  for(var i in opravila) {
    if (!opravila[i].done && opravila[i].usluzbenec_id != null) {
      if (opravila[i].usluzbenec_id != usluzbenec_id) {
        izpis += '<a href="#" class="list-group-item">'+opravila[i].imeOpravila+'</a>\
        <div class="panel panel-default" id="progressTo'+opravila[i].task_id+'" style="display:none">\
        <div class="panel-body" id="progressT'+opravila[i].task_id+'">\
          <div class="row">\
          <div class="col-sm-4">\
            <span class="label label-info">Description</span>\
            <input type="text" class="form-control input-mini" value="'+opravila[i].opisNaloge+'"readonly>\
          </div>\
          <div class="col-sm-4">\
            <span class="label label-info">Location</span>\
            <input type="text"class="form-control input-mini" value="'+opravila[i].loc_id+'" readonly>\
          </div>\
          <div class="col-sm-4">\
            <span class="label label-info">Until</span>\
            <input type="text" class="form-control input-mini" value="'+opravila[i].createDatum+'" readonly>\
            </div>\
          </div>\
        </div>\
      </div>\
      <div class="panel panel-default" id="see'+opravila[i].task_id+'" style="display:none">\
        <div class="panel-body" id="panela'+opravila[i].task_id+'"></div>\
      </div>';

      }
    }
  }
  $('#list-progress2').append(izpis);
  $('#list-done').empty();
  var izpis = '';
  for(var i in opravila) {
    console.log(opravila[i].ehr_id);
    if (opravila[i].done) {
      var done_ehrId = "'"+ opravila[i].ehr_id + "'";
        izpis += '<a href="#" class="list-group-item">'+opravila[i].imeOpravila+'\
        <button class="patientInfoBtn" onclick="prikaziPodatke('+opravila[i].task_id+','+done_ehrId+','+opravila[i].usluzbenec_id+',1)"><div class="glyphicon glyphicon-glyphicon glyphicon-info-sign logo-large" id="patientInfo"></div></button></a>\
\
        <div class="panel panel-default" id="doneTo'+opravila[i].task_id+'" style="display:none">\
        <div class="panel-body" id="doneT'+opravila[i].task_id+'">\
          <div class="row">\
          <div class="col-sm-4">\
            <span class="label label-info">Description</span>\
            <input type="text" class="form-control input-mini" value="'+opravila[i].opisNaloge+'"readonly>\
          </div>\
          <div class="col-sm-4">\
            <span class="label label-info">Location</span>\
            <input type="text"class="form-control input-mini" value="'+opravila[i].loc_id+'" readonly>\
          </div>\
          <div class="col-sm-4">\
            <span class="label label-info">Until</span>\
            <input type="text" class="form-control input-mini" value="'+opravila[i].createDatum+'" readonly>\
            </div>\
          </div>\
        </div>\
      </div>\
      <div class="panel panel-default" id="vidi'+opravila[i].task_id+'" style="display:none">\
        <div class="panel-body" id="tabla'+opravila[i].task_id+'"></div>\
      </div>';

      }
  }
  $('#list-done').append(izpis);
});

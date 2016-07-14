var tasks = ["1", "2", "3"];

$(document).ready(function(){
    $("vsebina1").html = vsebina1_html();
    console.log(22);
});

function vsebina1_html(tasks) {
    var s = "";
    s = "<div class='list-group'>\
        <a href='#' class='list-group-item active'>Cras justo odio</a>\
        <a href='#' class='list-group-item'>Dapibus ac facilisis in</a>\
        <a href='#' class='list-group-item'>Morbi leo risus</a>\
        <a href='#' class='list-group-item'>Porta ac consectetur ac</a>\
        <a href='#' class='list-group-item'>Vestibulum at eros</a>\
    </div>";
    s = '<p>"NEKI"</p>';

    return s;
}

$('#createTask').click(function(){
    $('#dodajIme').val("");
    $('#dodajOpis').val("");
    $('#dodajLokacijo').val("");
    $('#dodajPrioriteto').val("");
    $('#dodajEhr').val("");
})

var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';
var username = "ois.seminar";
var password = "ois4fri";
var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


function getSessionId() {
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(username) +
                "&password=" + encodeURIComponent(password),
        async: false
    });
    return response.responseJSON.sessionId;
}

function prikaziPodatke(id,ehrId,usluzbenec,done){
    if(usluzbenec == null){
        var prikazi = "#show"+id;
        var dodaj = "#panel"+id;
        var prikazi1 = "#taskTo"+id;
        var dodaj1 = "#taskT"+id;
        var kaj = "panel";
    }
    else{
        if(done == null){
            var prikazi = "#see"+id;
            var dodaj = "#panela"+id;
            var kaj = "panela";
            var prikazi1 = "#progressTo"+id;
            var dodaj1 = "#progressT"+id;
        }
        else{
           var prikazi = "#vidi"+id;
           var dodaj = "#tabla"+id;
           var kaj = "tabla";
           var prikazi1 = "#doneTo"+id;
           var dodaj1 = "#doneT"+id;
        }
    }
    var kaksno = $( ''+prikazi+'').css("display");
/*    if(kaksno == "block"){
        $(''+prikazi1+'').attr('style','display: none');
        // $(''+prikazi+'').attr('style','display: none');
        $(''+prikazi1+'').slideToggle();
        $(''+prikazi+'').empty();
    }
    else{*/
        if(ehrId != '12345'){
        // $(''+prikazi+'').attr('style','display: block');
        // $(''+prikazi1+'').attr('style','display: block');

        $(''+prikazi+'').empty();
        $(''+prikazi+'').append('<div class="panel-body" id="'+kaj+id+'"> \
        <div class="row"><div class="col-sm-4"> <span class="label label-info">Name</span><input type="text" id="name'+id+'" class="form-control input-mini" readonly></div> \
        <div class="col-sm-4"> <span class="label label-info">Surname</span><input type="text" id="last'+id+'" class="form-control input-mini" readonly></div> \
        <div class="col-sm-4"> <span class="label label-info" >Birth date</span><input type="text" id="rd'+id+'" class="form-control input-mini" readonly></div></div> \
        <div class="row"><div class="col-sm-4"> <span class="label label-info">Weight</span><input type="text" id="teza'+id+'" class="form-control input-mini" readonly></div> \
        <div class="col-sm-4"> <span class="label label-info">Height</span><input type="text" id="visina'+id+'" class="form-control input-mini" readonly></div> \
        <div class="col-sm-4"> <span class="label label-info">Temperature</span><input type="text" id="temperatura'+id+'" class="form-control input-mini" readonly></div></div> \
        <div class="row"><div class="col-sm-4"> <span class="label label-info">Pulse</span><input type="text" id="pulz'+id+'" class="form-control input-mini" readonly></div> \
        <div class="col-sm-4"> <span class="label label-info">Systolic pressure</span><input type="text" id="sp'+id+'" class="form-control input-mini" readonly></div> \
        <div class="col-sm-4"> <span class="label label-info" >Diastolic pressure</span><input type="text" id="dp'+id+'" class="form-control input-mini" readonly></div></div> \
        <div class="row"><div class="col-sm-4"> <span class="label label-info">Sp02</span><input type="text" id="spo'+id+'" class="form-control input-mini" readonly></div></div> \
         \
        <div>');

        var name = "#name"+id;
        var last = "#last"+id;
        var rd = "#rd"+id;
        var visina = "#visina"+id;
        var teza = "#teza"+id;
        var temperatura = "#temperatura"+id;
        var pulz = "#pulz"+id;
        var sp = "#sp"+id;
        var dp = "#dp"+id;
        var spo = "#spo"+id;

        sessionId = getSessionId();

        $.ajax({
            url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
            type: 'GET',
            headers: {"Ehr-Session": sessionId},
            success: function (data) {
                var party = data.party;
                $(''+name+'').val(party.firstNames);
                $(''+last+'').val(party.lastNames);
                $(''+rd+'').val(party.dateOfBirth);
            },
            error: function(err){
                console.log(err);
            }
        });
        $.ajax({
            url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
            type: 'GET',
            headers: {"Ehr-Session": sessionId},
            success: function (data) {
                var party = data.party;
                $.ajax({
                    url: baseUrl + "/view/" + ehrId + "/" + "body_temperature",
                    type: 'GET',
                    headers: {"Ehr-Session": sessionId},
                    success: function (res) {
                        $(temperatura).val(res[0].temperature);
                    },
                    error: function() {
                    }
                });
            },
            error: function(err){
                console.log(err);
            }
        });
        $.ajax({
            url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
            type: 'GET',
            headers: {"Ehr-Session": sessionId},
            success: function (data) {
                var party = data.party;
                $.ajax({
                    url: baseUrl + "/view/" + ehrId + "/" + "body_temperature",
                    type: 'GET',
                    headers: {"Ehr-Session": sessionId},
                    success: function (res) {
                        $("#temperatura").val(res[0].temperature);
                    },
                    error: function() {
                    }
                });
            },
            error: function(err){
                console.log(err);
            }
        });
        $.ajax({
            url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
            type: 'GET',
            headers: {"Ehr-Session": sessionId},
            success: function (data) {
                var party = data.party;
                $.ajax({
                    url: baseUrl + "/view/" + ehrId + "/" + "weight",
                    type: 'GET',
                    headers: {"Ehr-Session": sessionId},
                    success: function (res) {
                        $(teza).val(res[0].weight);
                    },
                    error: function() {
                    }
                });
            },
            error: function(err){
                console.log(err);
            }
        });
        $.ajax({
            url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
            type: 'GET',
            headers: {"Ehr-Session": sessionId},
            success: function (data) {
                var party = data.party;
                $.ajax({
                    url: baseUrl + "/view/" + ehrId + "/" + "height",
                    type: 'GET',
                    headers: {"Ehr-Session": sessionId},
                    success: function (res) {
                        $(visina).val(res[0].height);
                    },
                    error: function() {
                    }
                });
            },
            error: function(err){
                console.log(err);
            }
        });
        $.ajax({
            url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
            type: 'GET',
            headers: {"Ehr-Session": sessionId},
            success: function (data) {
                var party = data.party;
                $.ajax({
                    url: baseUrl + "/view/" + ehrId + "/" + "blood_pressure",
                    type: 'GET',
                    headers: {"Ehr-Session": sessionId},
                    success: function (res) {
                        $(sp).val(res[0].systolic);
                        $(dp).val(res[0].diastolic);
                    },
                    error: function() {
                    }
                });
            },
            error: function(err){
                console.log(err);
            }
        });
        $.ajax({
            url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
            type: 'GET',
            headers: {"Ehr-Session": sessionId},
            success: function (data) {
                var party = data.party;
                $.ajax({
                    url: baseUrl + "/view/" + ehrId + "/" + "spO2",
                    type: 'GET',
                    headers: {"Ehr-Session": sessionId},
                    success: function (res) {
                        $(spo).val(res[0].spO2);
                    },
                    error: function() {
                    }
                });
            },
            error: function(err){
                console.log(err);
            }
        });
        $.ajax({
            url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
            type: 'GET',
            headers: {"Ehr-Session": sessionId},
            success: function (data) {
                var party = data.party;
                $.ajax({
                    url: baseUrl + "/view/" + ehrId + "/" + "pulse",
                    type: 'GET',
                    headers: {"Ehr-Session": sessionId},
                    success: function (res) {
                        $(pulz).val(res[0].pulse);
                    },
                    error: function() {
                    }
                });
            },
            error: function(err){
                console.log(err);
            }
        });
    $(''+prikazi1+'').slideToggle();
    $(''+prikazi+'').slideToggle();
  } else {
    $(''+prikazi1+'').slideToggle();
  }
  //}
}

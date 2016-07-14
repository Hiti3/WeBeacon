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

function panelMenu(id){
    console.log("jaaa");
    var prikazi = "#taskTo"+id;
    var dodaj = "#taskT"+id;


    var kaksno = $( ''+prikazi+'').css("display");

    if(kaksno == "block"){
        $(''+prikazi+'').attr('style','display: none');
    }
    else{
        $(''+prikazi+'').attr('style','display: block');
    }
}
function panelProgress(id){
    console.log("jaaa");
    var prikazi = "#progressTo"+id;
    var dodaj = "#progressT"+id;


    var kaksno = $( ''+prikazi+'').css("display");

    if(kaksno == "block"){
        $(''+prikazi+'').attr('style','display: none');
    }
    else{
        $(''+prikazi+'').attr('style','display: block');
    }
}
function panelDone(id){
    console.log("jaaa");
    var prikazi = "#doneTo"+id;
    var dodaj = "#doneT"+id;


    var kaksno = $( ''+prikazi+'').css("display");

    if(kaksno == "block"){
        $(''+prikazi+'').attr('style','display: none');
    }
    else{
        $(''+prikazi+'').attr('style','display: block');
    }
}

function prikaziPodatke(id,ehrId,usluzbenec,done){
    ehrId = "53db43f5-f709-4202-87d8-289e6223bc35";
    if(usluzbenec == null){ 
        var prikazi = "#show"+id;
        var dodaj = "#panel"+id;
        var kaj = "panel";
    }
    else{
        if(done == null){
            var prikazi = "#see"+id;
            var dodaj = "#panela"+id;
            var kaj = "panela";
        }
        else{
           var prikazi = "#vidi"+id;
           var dodaj = "#tabla"+id;
           var kaj = "tabla"; 
        }
    }
    var kaksno = $( ''+prikazi+'').css("display");

    if(kaksno == "block"){
        $(''+prikazi+'').attr('style','display: none');
        $(''+prikazi+'').empty();
    }
    else{
        $(''+prikazi+'').attr('style','display: block');
        $(''+prikazi+'').empty();
        $(''+prikazi+'').append('<div class="panel-body" id="'+kaj+id+'"> \
        <div class="row"><div class="col-sm-4"> <span class="label label-info">Name</span><input type="text" id="name" class="form-control input-mini" readonly></div> \
        <div class="col-sm-4"> <span class="label label-info">Surname</span><input type="text" id="last" class="form-control input-mini" readonly></div> \
        <div class="col-sm-4"> <span class="label label-info" >Birth date</span><input type="text" id="rd" class="form-control input-mini" readonly></div></div> \
        <div class="row"><div class="col-sm-4"> <span class="label label-info">Weight</span><input type="text" id="teza" class="form-control input-mini" readonly></div> \
        <div class="col-sm-4"> <span class="label label-info">Height</span><input type="text" id="visina" class="form-control input-mini" readonly></div> \
        <div class="col-sm-4"> <span class="label label-info">Temperature</span><input type="text" id="temperatura" class="form-control input-mini" readonly></div></div> \
        <div class="row"><div class="col-sm-4"> <span class="label label-info">Pulse</span><input type="text" id="pulz" class="form-control input-mini" readonly></div> \
        <div class="col-sm-4"> <span class="label label-info">Systolic pressure</span><input type="text" id="sp" class="form-control input-mini" readonly></div> \
        <div class="col-sm-4"> <span class="label label-info" >Diastolic pressure</span><input type="text" id="dp" class="form-control input-mini" readonly></div></div> \
        <div class="row"><div class="col-sm-4"> <span class="label label-info">Sp02</span><input type="text" id="spo" class="form-control input-mini" readonly></div></div> \
        <br><div class="row" style="text-align:center;"><div class="col-sm-4"><span class="label label-info">Height</span><div id="chart-height"></div></div> \
        <div class="col-sm-4"><span class="label label-info">Weight</span><div id="chart-weight"></div></div> \
        <div class="col-sm-4"><span class="label label-info">Temperature</span><div id="body-temperature"></div></div></div> \
        <div class="row" style="text-align:center;"><div class="col-sm-4"><span class="label label-info">Blod pressure</span><div id="blood-pressures"></div></div> \
        <div class="col-sm-4"><span class="label label-info">Pulse</span><div id="chart-pulse"></div></div> \
        <div>');

        sessionId = getSessionId();

        $.ajax({
            url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
            type: 'GET',
            headers: {"Ehr-Session": sessionId},
            success: function (data) {
                var party = data.party;
                $("#name").val(party.firstNames);
                $("#last").val(party.lastNames);
                $("#rd").val(party.dateOfBirth);
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
                        $("#teza").val(res[0].weight);
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
                        $("#visina").val(res[0].height);
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
                        $("#sp").val(res[0].systolic);
                        $("#dp").val(res[0].diastolic);
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
                        $("#spo").val(res[0].spO2);
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
                        $("#pulz").val(res[0].pulse);
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
            url: baseUrl + "/view/" + ehrId + "/height",
            type: 'GET',
            headers: {
                "Ehr-Session": sessionId
            },
            success: function (res) {
                res.forEach(function(el, i, arr) {
                    var date = new Date(el.time);
                    el.date = date.getDate() + '-' + monthNames[date.getMonth()];
                });
        
                new Morris.Bar({
                    element: 'chart-height',
                    data: res.reverse(),
                    xkey: 'date',
                    ykeys: ['height'],
                    labels: ['Height'],
                    hideHover: true,
                    barColors: ['#48CFAD', '#37BC9B'],
                    xLabelMargin: 5,
                    resize: true
                });
            }
        });
        $.ajax({
            url: baseUrl + "/view/" + ehrId + "/body_temperature",
            type: 'GET',
            headers: {
                "Ehr-Session": sessionId
            },
            success: function (res) {
        
                res.forEach(function(el, i, arr) {
                    var date = new Date(el.time);
                    el.date = date.getDate() + '-' + monthNames[date.getMonth()];
                });
        
                new Morris.Bar({
                    element: 'body-temperature',
                    data: res.reverse(),
                    xkey: 'date',
                    ykeys: ['temperature'],
                    labels: ['Body Temperature'],
                    hideHover: true,
                    barColors: ['#FFCE54'],
                    xLabelMargin: 5,
                    resize: true
                });
            }
        });
        $.ajax({
            url: baseUrl + "/view/" + ehrId + "/weight",
            type: 'GET',
            headers: {
                "Ehr-Session": sessionId
            },
            success: function (res) {
        
                res.forEach(function(el, i, arr) {
                    var date = new Date(el.time);
                    el.date = date.getDate() + '-' + monthNames[date.getMonth()];
                });
        
                new Morris.Bar({
                    element: 'chart-weight',
                    data: res.reverse(),
                    xkey: 'date',
                    ykeys: ['weight'],
                    labels: ['Weight'],
                    hideHover: true,
                    barColors: ['#4FC1E9'],
                    xLabelMargin: 5,
                    resize: true
                });
            }
        });
    $.ajax({
        url: baseUrl + "/view/" + ehrId + "/blood_pressure",
        type: 'GET',
        headers: {
        "Ehr-Session": sessionId
        },
        success: function (res) {
            res.forEach(function (el, i, arr) {
                var date = new Date(el.time);
                el.date = date.getTime();
            });

            new Morris.Area({
                element: 'blood-pressures',
                data: res.reverse(),
                xkey: 'date',
                ykeys: ['systolic', 'diastolic'],
                lineColors: ['#4FC1E9','#4FC1E9'],
                labels: ['Systolic', 'Diastolic'],
                lineWidth: 2,
                pointSize: 3,
                hideHover: true,
                behaveLikeLine: true,
                smooth: false,
                resize: true,
                xLabels: "day",
                xLabelFormat: function (x){
                    var date = new Date(x);
                    return (date.getDate() + '-' + monthNames[date.getMonth()]);
                },
                dateFormat: function (x){
                    return new Date(x).toString();
                }
            });
        }
    });
    $.ajax({
        url: baseUrl + "/view/" + ehrId + "/pulse",
        type: 'GET',
        headers: {
            "Ehr-Session": sessionId
        },
        success: function (res) {

            res.forEach(function (el, i, arr) {
                var date = new Date(el.time);
                el.date = date.getTime();
            });

            new Morris.Area({
                element: 'chart-pulse',
                data: res.reverse(),
                xkey: 'date',
                ykeys: ['pulse'],
                lineColors: ['#A0D468'],
                labels: ['Pulse'],
                lineWidth: 2,
                pointSize: 3,
                hideHover: true,
                behaveLikeLine: true,
                smooth: false,
                resize: true,
                xLabels: "day",
                xLabelFormat: function (x){
                    var date = new Date(x);
                    return (date.getDate() + '-' + monthNames[date.getMonth()]);
                },
                dateFormat: function (x){
                    return new Date(x).toString()
                }
            });
        }
    });
    }
}
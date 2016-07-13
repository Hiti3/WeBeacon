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
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
// Button
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}
// Onclick for dropdown 
function admin() {
    // loading data for the map to use
    d3.json("data/jobsData/admin_support.json", function(json) {
        data = json;
        counties.selectAll("path").attr("class", quantize);
    });
}

function arts() {
    // loading data for the map to use
    d3.json("data/jobsData/arts_entertainment.json", function(json) {
        data = json;
        counties.selectAll("path").attr("class", quantize);
    });
}

function finance() {
    // loading data for the map to use
    d3.json("data/jobsData/finance.json", function(json) {
        data = json;
        counties.selectAll("path").attr("class", quantize);
    });
}

function health() {
    // loading data for the map to use
    d3.json("data/jobsData/health_social.json", function(json) {
        data = json;
        counties.selectAll("path").attr("class", quantize);
    });
}

function info() { // loading data for the map to use
    d3.json("data/jobsData/it.json", function(json) {
        data = json;
        counties.selectAll("path").attr("class", quantize);
    });
}

function manufacturing() { // loading data for the map to use
    d3.json("data/jobsData/manufacturing.json", function(json) {
        data = json;
        counties.selectAll("path").attr("class", quantize);
    });
}

function education() { // loading data for the map to use
    d3.json("data/jobsData/education.json", function(json) {
        data = json;
        counties.selectAll("path").attr("class", quantize);
    });
}

function construction() {
    // loading data for the map to use
    d3.json("data/jobsData/construction.json", function(json) {
        data = json;
        counties.selectAll("path").attr("class", quantize);
    });
}
// Filter
function filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            a[i].style.display = "";
        } else {
            a[i].style.display = "none";
        }
    }
}
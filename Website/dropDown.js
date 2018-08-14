/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
// Button
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}
// Onclick for dropdown 
function admin() {
    // launches google maps while sharing the county clicked on
    window.location.href = "map.html?industry=admin_support&county=dublin";
}

function arts() {
    // launches google maps while sharing the county clicked on
    window.location.href = "map.html?industry=arts_entertainment&county=dublin";
}

function finance() {
    // launches google maps while sharing the county clicked on
    window.location.href = "map.html?industry=finance&county=dublin";
}

function health() {
    // launches google maps while sharing the county clicked on
    window.location.href = "map.html?industry=health_social&county=dublin";
}

function info() { 
    // launches google maps while sharing the county clicked on
    window.location.href = "map.html?industry=it&county=dublin";
}

function manufacturing() { 
    // launches google maps while sharing the county clicked on
    window.location.href = "map.html?industry=manufacturing&county=dublin";
}

function education() { 
    // launches google maps while sharing the county clicked on
    window.location.href = "map.html?industry=education&county=dublin";
    
}

function construction() {
    // launches google maps while sharing the county clicked on
    window.location.href = "map.html?industry=construction&county=dublin";
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
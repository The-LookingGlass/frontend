// array to store markers
var markers = [];
// array to store house markers
var aMarkers = [];

var markerCluster;

function myMap() {
   
    // getting county location from the parameters in URl5fxhj
    var location = getAllUrlParams().county;
    
        try {
            // reading data 
            readTextFile("data/job_data.json", function (text) {
        
                // data from JSON 
                var data = JSON.parse(text);
        
                // Init map and get map object
                var map = initMap(data, location);
                
                // place markers after loading the map
                markerpPlacement(data, map, location);
        
                //setup markers
                setMapOnAll(map);
        
                // reseting the code
                var app = new Vue({
                    el: "#floating-panel",
                    methods: {
                        changeCenter: function(){

                            location = getAllUrlParams().county;

                            // cache previous results
                            var tempArray = markers;
        
                            // clean the storing array and remove all markers
                            setMapOnAll(null);
                            markers = [];
                            
                            // create the map again
                            var map = initMap(data, location);
                            
                            // restoring data without processing again
                            markers = tempArray;
        
                            //setup markers
                            setMapOnAll(map);
                            
                            // marking cluster only applicable for dublin
                            if(location.toUpperCase() == "DUBLIN"){
                                // images to load when multiple markers are presented 
                                var options = {
                                   imagePath: 'images/m'
                               };
                        
                               // initializing marker cluster
                               markerCluster = new MarkerClusterer(map, markers, options); 
                            } 
                        }
                    }
                });

                // change county
                var app2 = new Vue({
                    el: "#floating-panel2",
                    methods: {
                        changeCenter: function(){

                            var location = getAllUrlParams().county;
  
                            // clean the storing array and remove all markers
                            setMapOnAll(null);
                            markers = [];
            
                            // create the map again
                            var map = initMap(data, location);

                            // create markers for the county
                            markerpPlacement(data, map, location);
            
                            //setup markers
                            setMapOnAll(map);
                        }
                    }
                });
  
            });
        }
        catch(err){
            console.log(err.message);
        }
    
}

// calculate difference between two markers
function calculateDistance(lat1, lng1, lat2, lng2){
  
    // calculating distance using Google api
    /*  
    var p1 = new google.maps.LatLng(lat1,lng1);
    var p2 = new google.maps.LatLng(lat2,lng2);
    
    calculation = (google.maps.geometry.spherical.computeDistanceBetween(p1, p2)/1000).toFixed(2);
    
    return calculation;
*/

// calculating ditance manually
// using modified version of this answer https://stackoverflow.com/a/1502821
 
    var rad = function(x) {
    return x * Math.PI / 180;
  };

   var R = 6378137; // Earth’s mean radius in meter
   
   var dLat = rad(lat2 - lat1);
   
   var dLong = rad(lng2 - lng1);
   
   var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
     Math.cos(rad(lat1) * Math.cos(rad(lat2))) *
     Math.sin(dLong / 2) * Math.sin(dLong / 2);
   
     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
   
     var distance = R * c;
     return distance/1000; // returns the distance in Km*/
}

// initialize map

function initMap(data, location){

    // fetching data from the json file for centering the map
    var long = data[location].longitude;
    var lat = data[location].latitude;
    var zoom = data[location].zoom;
    //var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';

    var mapStyle = [
        {
            "featureType": "landscape.natural",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#e0efef"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "hue": "#1900ff"
                },
                {
                    "color": "#c0e8e8"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "lightness": 100
                },
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "lightness": 700
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#7dcdcd"
                }
            ]
        },
        {
            featureType: "poi",
            elementType: "labels",
            stylers: [
                  { visibility: "off" }
            ]
        }
    ];
    // properties for map 
    var mapProp = {
        center: new google.maps.LatLng(lat, long),
        zoom: zoom,
        styles: mapStyle
    };

    // initializing the map
    var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

    return map;
}

// add marker
function addMarker(data, map, i, format, customMarker, url){

    var marker = new google.maps.Marker({
       
        position: new google.maps.LatLng(data.ID[i].lat, data.ID[i].lng),
        
        // format to display in infoWindow
        info: new google.maps.InfoWindow({
            content: format
        }),
        
        // custom icon
        icon:{
            url: customMarker,
            scaledSize: new google.maps.Size(32, 32)
        },
       
        animation: google.maps.Animation.DROP,
        
        // url attached to the marker on click
        url: url, 
       
        map: map
      });

    // event listener for when the user hower over's the marker
        google.maps.event.addListener(marker, 'mouseover', function () {
            this.info.open(map, this);
    
        });
        
        // event listner for mouseout
         google.maps.event.addListener(marker, 'mouseout', function () {
            this.info.close();
        }); 

    return marker;
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
      }      

// change center as well as place marker cluster
function markerpPlacement(data, map, location){

    var length = Object.keys(data.ID).length;
    var industry = getAllUrlParams().industry;

        // code used from https://tommcfarlin.com/multiple-infowindows-google-maps/ and modified.
    for (var i = 0; i < length; i++) {

        var county = data.ID[i].county;
        var industryData =  data.ID[i].industry;
        try {
            if (county !== undefined && 
                industry == industryData &&
                (county.toUpperCase() == location.toUpperCase() || 
                (county.toUpperCase()).includes(location.toUpperCase())
                )
            ){  
                
                var jobLink = data.ID[i].joburl;
                var salary = data.ID[i].salary;
                var homepage = data.ID[i].homepage;  
                
                if(homepage !== null){
                // format for info window
             var format = "<div style='float:left'><img src='http://i.stack.imgur.com/g672i.png'></div>" + 
             "<div style = 'float:right; padding:10px; font-size:18px'><strong>" + data.ID[i].title+'</strong><br>'+ 
             '<br>'+'<strong>' + "COMPANY: "+ '</strong>' + data.ID[i].company.toUpperCase() +
             '<br>'+ '<strong>' + "SALARY: "+ '</strong>' + salary +
             '<br>'+ '<strong>' + "HOMEPAGE: "+ '</strong>'+ homepage +'</div>';
                }
                else{
                        // format for info window
             var format = "<div style='float:left'><img src='http://i.stack.imgur.com/g672i.png'></div>" + 
             "<div style = 'float:right; padding:10px; font-size:18px'><strong>" + data.ID[i].title+'</strong><br>'+ 
             '<br>' +'<strong>' + "COMPANY: "+ '</strong>'+ data.ID[i].company.toUpperCase() +
             '<br>'+ '<strong>' + "SALARY: "+ '</strong>' + salary + '</div>';
                }
             var customMarker = 'images/standardMarker.svg';
             
             // adding markers to the array 
             var markerObj = addMarker(data, map, i, format, customMarker, jobLink);
    
              // push marker on to the array    
                markers.push(markerObj);
                
                // setting variable to false as there the marker is still not clicked
                var singleClick = false;
    
            // event listener for when the user clicks on the marker
            google.maps.event.addListener(markerObj,'click', function (e) {
                
                /* Recreate the map to display 1 company and nearby houses */
                
                // if marker has been clicked once then show website for job the next click 
                if(!singleClick){
                map = initMap(data,location);
                // map properties            
    
                // leave the company's marker while presenting housing data
                this.setMap(map);
    
                // position of the selected job 
                var lat = e.latLng.lat();
                var lng = e.latLng.lng();
                
                // display housing data
                placeHomeMarker( map, lat, lng, location);
                
                singleClick = true;
    
            }else{
                
                if(this.url == undefined || this.url == "null"){
                    console.log("error");
                }
                
                else{
                    
                    window.open(this.url);
            }
    
            // reset click back to show houses
            singleClick = false;
            }
            });
           }

        
        }
         catch(err) {
             console.log(err.message);
        }
     }  

     if(location.toUpperCase() == "DUBLIN"){
                
        //console.log("still inside");
        // images to load when multiple markers are presented 
        var options = {
           imagePath: 'images/m'
       };

       // initializing marker cluster
       markerCluster = new MarkerClusterer(map, markers, options); 
    }
}      

// place house markers 
function placeHomeMarker(map, lat, lng, location){
     // remove all markers in the map
     
    try{ 
    readTextFile("data/coordinates_myhome.json", function (text) {

        // object reference for the file
        var data = JSON.parse(text);

        // default distance for markers ie 5km
        var minDistance = 0, maxDistance = 5; 
        
        // initializing
        var houseThreshold = 0;
        
        // getting the 
        houseThreshold = autoDistance(minDistance, maxDistance, data, map, location, houseThreshold, lat, lng);
          
        // if less that 3 houses are being shown then search for more by increasin the distance to 10km
        if(houseThreshold <3){
            
            minDistance = 5;
            maxDistance = 10;
            
            houseThreshold = autoDistance(minDistance, maxDistance, data, map, location, houseThreshold, lat, lng);
        }

        // if its still less than 3 houses then increase the range to 20km
        if(houseThreshold < 3){
            minDistance = 10;
            maxDistance = 20;
            
            houseThreshold = autoDistance(minDistance, maxDistance, data, map, location, houseThreshold, lat, lng);
        }

        // if there are still less houses then 3 then there is no hope for the county seriously.
        if(houseThreshold < 3){ 
            console.log("this county is doomed!");
        }        
        
        // images to load when multiple markers are presented 
        var options = {
            imagePath: 'images/m'
        };

        // initializing marker cluster
        var markerCluster = new MarkerClusterer(map, aMarkers, options);

            });
        }catch(err){
            console.log(err.message);
        }
}

// placing home markers and initializing circle boundary automatically 
function autoDistance(min, max, data, map, location, houseThreshold, lat, lng){

    var radius;
    var cirleColor;

    // clear already stored markers in array
    aMarkers = [];
    var center = {lat: lat, lng: lng};

    // length of data array        
    var length = Object.keys(data.ID).length;

    // switching radius of cicle according to range provided
    switch(max){
        
        case 5: radius = 5000; 
        cicleColor= "#228b22";// dark green
        break;
        
        case 10: radius = 10000; 
        cirleColor = "#ffe200"; // dark yellow
        break;
        
        case 20: radius = 20000;
        cirleColor = "#ff0000"; // dark red
        break;
        
        default: radius = 5000;
        cicleColor= "#228b22"; 

    }
    
    // custom house marker 
    var customMarker = 'images/home.svg';
    
    // code used from https://tommcfarlin.com/multiple-infowindows-google-maps/ and modified.
    for (var i = 0; i < length; i++) {
        
        // address of the house
        var address = data.ID[i].address;            

        // check if the house is in the same county as the job else skip
        if(address.toUpperCase().includes(location.toUpperCase())){

            // calculating distance between job location and this house
            var distance = calculateDistance(lat , lng, data.ID[i].lat, data.ID[i].lng);
        
            // cost of house
            var price = data.ID[i].price;

            // draw circle for the specified radius around the selected job
            var circle = new google.maps.Circle({
                strokeColor: cirleColor,
                strokeOpacity: 0.2,
                strokeWeight: 2,
                fillOpacity: 0,
                map: map,
                center: center,
                radius: radius
            });
            
            // hardcoded for testing before implementing the working dropdown
            var minPrice = 1000, maxPrice = 2000;

            // make marker only if it comes under the defined price and distance range 
            if(price > minPrice && price < maxPrice && distance > min && distance < max){  
                
                // increment everytime a house marker is placed
                houseThreshold = houseThreshold + 1;
                
                // format for infowindow
                var format = "<div id='img' style='float:left'><img src='http://i.stack.imgur.com/g672i.png'></div>" + 
                    "<div style = 'float:right; padding: 10px; font-size:18px'><strong>" + "COST: "+ price + "€"+ 
                    '</strong><br>' + '<br>' +'<strong>' + "ADDRESS: " +'</stong>'+ address + '</div>';

                // getting the link from record
                var web = data.ID[i].url;
    
                // add marker
                var markerObj = addMarker(data, map, i, format, customMarker, web);

                aMarkers.push(markerObj);
    
                // event listener for when the user clicks on the marker
                google.maps.event.addListener(markerObj, 'click', function () {
                // launches google maps while sharing the county clicked on
                    window.open(this.url, "_blank");
                });


            }
        }

    }

    return houseThreshold;
}

// loading county data json file

// code used from https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
// reading the JSON file
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    };
    rawFile.send(null);
}

// accessing data from the URL
// Code used from  https://www.sitepoint.com/get-url-parameters-with-javascript/
function getAllUrlParams(url) {
    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
    // we'll store the parameters here
    var obj = {};
    // if query string exists
    if (queryString) {
        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];
        // split our query string into its component parts
        var arr = queryString.split('&');
        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');
            // in case params look like: list[]=thing1&list[]=thing2
            var paramNum = undefined;
            var paramName = a[0].replace(/\[\d*\]/, function (v) {
                paramNum = v.slice(1, -1);
                return '';
            });
            // set parameter value (use 'true' if empty)
            var paramValue = typeof(a[1]) === 'undefined' ? true : a[1];
            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            paramValue = paramValue.toLowerCase();
            // if parameter name already exists
            if (obj[paramName]) {
                // convert value to array (if still string)
                if (typeof obj[paramName] === 'string') {
                    obj[paramName] = [obj[paramName]];
                }
                // if no array index number specified...
                if (typeof paramNum === 'undefined') {
                    // put the value on the end of the array
                    obj[paramName].push(paramValue);
                }
                // if array index number specified...
                else {
                    // put the value at that index number
                    obj[paramName][paramNum] = paramValue;
                }
            }
            // if param name doesn't exist yet, set it
            else {
                obj[paramName] = paramValue;
            }
        }
    }
    return obj;
}
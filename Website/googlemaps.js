// google map api key
var key = "AIzaSyAGiNsd-zPf5pwe6_JN32W5fth_yhLtTt0";

function myMap(data) {
    // getting county location from the parameters in URl5fxhj
    var location = getAllUrlParams().county;

    // this requests the file and executes a callback with the parsed result once
    //   it is available
    readTextFile("county_data.json", function(text){
        var data = JSON.parse(text);
        
        // fetching data from the json file for centering the map
        var long = data[location].longitude;
        var lat =  data[location].latitude;
        var zoom = data[location].zoom;

        // properties for map 
        var mapProp= {
            center : new google.maps.LatLng(lat,long),
            zoom : zoom,
        };
        
        // initializing the map
        var map=new google.maps.Map(document.getElementById("googleMap"),mapProp);


         // ADDING MARKERS----

        // Create an array of alphabetical characters used to label the markers.
        var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        
        // test locations 
        // add cordinates to show markers on map
        var locations = [
          {lat:53.341676 , lng:-6.249326}
        ];

        // Marker properties
        var markers = locations.map(function(location, i) {
          return new google.maps.Marker({
          position: location,
          label: labels[i % labels.length]
          });
        });

        // Add a marker clusterer to manage the markers.
        var markerCluster = new MarkerClusterer(map, markers,
          {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
        });


}

// using to place markers all over the map
function placeMarkers(){

  
  
}
 
// loading county data json file
// code used from https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript

// reading the JSON file
function readTextFile(file, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
        }
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
  
      for (var i=0; i<arr.length; i++) {
        // separate the keys and the values
        var a = arr[i].split('=');
  
        // in case params look like: list[]=thing1&list[]=thing2
        var paramNum = undefined;
        var paramName = a[0].replace(/\[\d*\]/, function(v) {
          paramNum = v.slice(1,-1);
          return '';
        });
  
        // set parameter value (use 'true' if empty)
        var paramValue = typeof(a[1])==='undefined' ? true : a[1];
  
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
  
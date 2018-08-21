start();
// calculate difference between two markers
function getDifference(lat1, lng1, lat2, lng2){
  
    // calculating distance using Google api
      
    var p1 = new google.maps.LatLng(lat1,lng1);
    var p2 = new google.maps.LatLng(lat2,lng2);
    
    var googleDistance = (google.maps.geometry.spherical.computeDistanceBetween(p1, p2)).toFixed(9);
    console.log("Distance using google Api (in kms) = "+ googleDistance/1000);

    

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
   
     var manualDistance = R * c;
     
     var difference = Math.abs(googleDistance - manualDistance);
     console.log("Distance using manual algorithm used in jobMap (in kms) = "+ manualDistance/1000);

     return difference/1000;
}


function getResults(data){

    var lat, lng, lat1, lng1;
    
    // address of the house
    var length =  Object.keys(data.ID).length;  

    for(var i = 0 ; i < length; i++){
            lat = data.ID[i].company.lat;
            lng = data.ID[i].company.lng;

            lat1 = data.ID[i].house1.lat;
            lng1 = data.ID[i].house1.lng;

            console.log("\nJob to first House");
            var difference = getDifference(lat, lng, lat1,lng1);
            console.log("Difference = "+ difference);
            
            lat1 = data.ID[i].house2.lat;
            lng1 = data.ID[i].house2.lng;

            console.log("\nJob to second House");
            difference = getDifference(lat, lng, lat1,lng1);
            console.log("Difference = "+ difference);
            console.log("\n==== NEW JOB ====");


        }
}

function start(){

    readTextFile("Evaluation.json", function (text) {
        // data from JSON 
        var data = JSON.parse(text);
        getResults(data);
    });
    console.log("end program");
}

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



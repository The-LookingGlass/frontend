var data; // loaded asynchronously

//Albers projection values based on playing with ireland.json using D3's Albers Example
var proj = d3.geo.albers()
          .origin([-9.5,48.1])
          .scale(10000)// size of the map basically
          .translate([250,1260]);// position on screen for the maps

//path            
var path = d3.geo.path().projection(proj);
// SVG
var svg = d3.select("#chart")
  .append("svg");

var counties = svg.append("g")
    .attr("id", "ireland");

// Tooltip
var tooltip = d3.select("body").append("div") 
.attr("class", "tooltip")       
.style("opacity", 0);

// get industry from parameters 
var industry = getAllUrlParams().industry;

/*
*modified version of d3js code from the project https://gist.github.com/2183412
*/

// load ireland map as heatmap
d3.json("ireland.json", function(json) {
    counties.selectAll("path")
      .data(json.features)
      .enter().append("path")
      .attr("class", "ireland")
      .attr("d", path)
      
      // show name of the county when mouse hovers
      .on("mouseover", function(d) {           
        tooltip.transition()    
          .duration(200)    
          .style("opacity", 1);    
        
          tooltip.html(d.properties.id)
          .style("left", (d3.event.pageX) + "px")   
          .style("top", (d3.event.pageY - 28) + "px");  
        })
        
        // On click launching stage 2
        .on("click", function(d){
          var industry = getAllUrlParams().industry;
          
          // launches google maps while sharing the county clicked on
          window.history.replaceState(null, null, "map.html?industry="+industry+"&county="+d.properties.id);
        })
        
        // transition when mouse moves away
      .on("mouseout", function() {   
        tooltip.transition()    
        .duration(500)    
        .style("opacity", 0); 
      });
});

// loading data for the map to use
d3.json("data/job_data_heatmap.json", function(json) {
    
  // choose the industry specific data from json file
data = json[industry];

counties.selectAll("path").attr("class", quantize);
});

// normal color codes for normal maps
function quantize(d) {
  if(data[d.properties.id] < 10){
    return "q2-9";
  }
  else if(data[d.properties.id] < 30){
    return "q4-9";
  }
  else if(data[d.properties.id] < 60){
    return "q6-9";
  }
  else if(data[d.properties.id] < 75){
    return "q7-9";
  }
  else if(data[d.properties.id] > 75){
    return "q8-9";
  }  
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
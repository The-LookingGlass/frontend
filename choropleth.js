var data; // loaded asynchronously

//Albers projection values based on playing with ireland.json using D3's Albers Example
var proj = d3.geo.albers()
          .origin([-7.9,53.3])
          .scale(10000)// size of the map basically
          .translate([450,350]);// position on screen for the map

//path            
var path = d3.geo.path().projection(proj);
// SVG
var svg = d3.select("#chart")
  .append("svg");

var counties = svg.append("g")
    .attr("id", "ireland");

//modified version of d3js code from the project https://gist.github.com/2183412
d3.json("ireland.json", function(json) {
  counties.selectAll("path")
      .data(json.features)
    .enter().append("path")
      .attr("class", "ireland")
      .attr("d", path)
      .on('mouseover', function(d){
        // add code for when the mouse hovers over the map
    })
});

d3.json("county_jobs.json", function(json) {
  data = json;
  counties.selectAll("path")
      .attr("class", quantize);
});
 
function quantize(d) {
  if(data[d.properties.id] < 100){
    return "q2-9";
  }
  else if(data[d.properties.id] < 300){
    return "q4-9";
  }
  else if(data[d.properties.id] < 600){
    return "q6-9";
  }
  else if(data[d.properties.id] < 800){
    return "q7-9";
  }
  else if(data[d.properties.id] > 800){
    return "q8-9";
  }  
}
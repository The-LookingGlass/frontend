var data; // loaded asynchronously

//Albers projection values based on playing with ireland.json using D3's Albers Example
var proj = d3.geo.albers()
          .origin([-7.9,53.3])
          .scale(10005)// size of the map basically
          .translate([450,350]);// position on screen for the map

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

//modified version of d3js code from the project https://gist.github.com/2183412
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
          .style("opacity", .9);    
        
          tooltip.html(d.properties.id)
          .style("left", (d3.event.pageX) + "px")   
          .style("top", (d3.event.pageY - 28) + "px");  
        })
        .on("click", function(d){
          window.location.href = "googleMaps.html";
            
          })
        // transition when mouse moves away
      .on("mouseout", function(d) {   
        tooltip.transition()    
        .duration(500)    
        .style("opacity", 0); 
      });
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
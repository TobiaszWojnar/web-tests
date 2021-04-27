/*
w and h and scale component in projection decide how much do we see
 */
let w = 1400;
let h = 700;
let projection = d3.geoMercator().translate([w/2, h/2]).scale(5500)
    .center([-77.5,40.8]);//moves in y-right and x-up coordinate

let path = d3.geoPath().projection(projection);

let svg = d3.select("div#container").append("svg").attr("preserveAspectRatio", "xMinYMin meet").style("background-color","#f0e4dd")
    .attr("viewBox", "0 0 " + w + " " + h)
    .classed("svg-content", true);

// load data
let jsonData = d3.json("cancer.json");

/*
    Creating tooltip and setting initial opacity to be translucent;
 */
let tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

/*
 3 functions for displaying data for regions, when mouse is over them.
 */
let mouseover = function (d){
    tooltip.transition()
        .duration(200)
        .style("opacity", .9);
};
let mousemove = function(d) {
    tooltip.html(d.properties.name +"<br>"+d.properties.rate)
        .style("left", (d3.event.pageX+10) + "px")//.style("left", (d3.mouse(this)[0]+10) + "px")
        .style("top", (d3.event.pageY-5) + "px");
};
let mouseout = function(d) {
    tooltip.transition()
        .duration(500)
        .style("opacity", 0);
};

Promise.all([jsonData]).then(function(data){
    // draw map
    svg.selectAll("path")
        .data(data[0].features)
        .enter()
        .append("path")
        .attr("class","county")
        .attr("d", path)
        .on("mouseover", mouseover)
        .on("mousemove",mousemove)
        .on("mouseout", mouseout);
});
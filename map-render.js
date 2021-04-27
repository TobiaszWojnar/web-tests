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
    Choosing color scheme, and scaling it for our data
 */
var colorScheme = d3.schemeYlOrRd[9];
//colorScheme.unshift("#eee") //borrowed form example, a way to add color on the begining of array
var colorScale = d3.scaleQuantile().domain([110,150])
    .range(colorScheme);//https://observablehq.com/@d3/color-schemes

/*
 3 functions for displaying data for regions, when mouse is over them.
 */
let mouseover = ()=>{
    tooltip.transition()
        .duration(200)
        .style("opacity", .9);
};
let mousemove = (d)=>{
    tooltip.html(d.properties.name +"<br>"+d.properties.rate)
        .style("left", (d3.event.pageX+10) + "px")
        .style("top", (d3.event.pageY-5) + "px");
};
let mouseout = ()=>{
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
        .attr("fill",(e)=>{
            return colorScale(e.properties.rate)
        })
        .on("mouseover", mouseover)
        .on("mousemove",mousemove)
        .on("mouseout", mouseout)
        .on("click",(d)=>{
            alert("County "+d.properties.name+"\r\n"+"Infection rate is "+d.properties.rate);}
        );
    /*
    list of events can be found at https://www.w3schools.com/jsref/obj_mouseevent.asp
     */

    // Legend
    var g = svg.append("g")
        .attr("class", "legendThreshold")
        .attr("transform", "translate(20,20)");
    g.append("text")
        .attr("class", "caption")
        .attr("x", 0)
        .attr("y", -6)
        .text(data[0].name);//Or regular text
    var labels = ['110', '115', '120', '125', '130', '135', '140','145','150'];
    var legend = d3.legendColor()
        .labels(function (d) { return labels[d.i]; })
        .shapePadding(4)
        .scale(colorScale);
    svg.select(".legendThreshold")
        .call(legend);
});

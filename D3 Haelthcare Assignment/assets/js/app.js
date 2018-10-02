
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

 
 
  // Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";



// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.80,
      d3.max(data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }

// function used for updating x-scale var upon click on axis label
function yScale(data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis]) * .8,
      d3.max(data, d => d[chosenYAxis]) * 1.2
    ])
    .range([height,0]);

  return yLinearScale;

}




  // function used for updating xAxis var upon click on axis label
function renderxAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }

  function renderyAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }


  function renderxCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
 
    return circlesGroup;
 }

 function renderyCircles(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}




function xtext(abbrGroup, newXScale, chosenXAxis) {

  abbrGroup.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXAxis]));

  return abbrGroup;
}

function ytext(abbrGroup, newYScale, chosenYAxis) {

abbrGroup.transition()
  .duration(1000)
  .attr("dy", d => newYScale(d[chosenYAxis]));

return abbrGroup;
}


// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

      var xlabel = chosenXAxis;
      var ylabel = chosenYAxis;
  
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
      });

      
    circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}


// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/mydata.csv", function(err, data) {
    if (err) throw err;
  
    // parse data
    data.forEach(function(data) {
      data.healthcare = +data.healthcare;
      data.smokes = +data.smokes;
      data.obesity = +data.obesity;
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.state = data.state;
    });
  
    // xLinearScale function above csv import
    var xLinearScale = xScale(data, chosenXAxis);
    var yLinearScale = yScale(data, chosenYAxis);
  
    // Create y scale function
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.poverty)])
      .range([height, 0]);
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  


    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

      var yAxis = chartGroup.append("g")
      .call(leftAxis);
  
      var abbrGroup =  chartGroup.selectAll(null)
      .data(data)
      .enter()
      .append("text")
      .attr("dx", d => xLinearScale(d[chosenXAxis]))
      .attr("dy", d => yLinearScale(d[chosenYAxis]))
      .attr("fill", "black")
      .attr("alignment-baseline", "middle")
      .attr("text-anchor", "middle")
      .style("font-size",9)
      .style("font-weight", "bold")
      .text(d => d.abbr);

    // append initial circles
    
    var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 12)
      .attr("fill", "blue")
      .attr("opacity", ".5");
          
               
 
    // Create group for  2 x- axis labels
    var xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var ylabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(0, ${height/2}) rotate(-90)`);
  
    var povertyLabel = xlabelsGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("Poverty");
  
    var ageLabel = xlabelsGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median) ");

    var incomeLabel = xlabelsGroup
      .append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household Income (Median) ");


  

    var healthcareLabel = ylabelsGroup
      .append("text")
      .attr("x", 0)
      .attr("y", -30)
      .attr("value", "healthcare") // value to grab for event listener
      .classed("active", true)
      .text("Lacks Healthcare (%)");

    var smokeLabel = ylabelsGroup
      .append("text")
      .attr("x", 0)
      .attr("y", -50)
      .attr("value", "smokes") // value to grab for event listener
      .classed("inactive", true)
      .text("Smoke (%) ");

    var obesseLabel = ylabelsGroup
    .append("text")
    .attr("x", 0)
    .attr("y", -70)
    .attr("value", "obesity") // value to grab for event listener
    .classed("inactive", true)
    .text("Obesse (%)");


 
    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
   
   
     
    // x axis labels event listener
    xlabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
  
          // replaces chosenXAxis with value
          chosenXAxis = value;
  
        
          
          // updates x scale for new data
          xLinearScale = xScale(data, chosenXAxis);
  
          // updates x axis with transition
          xAxis = renderxAxes(xLinearScale, xAxis);
  
          // updates circles with new x values
          circlesGroup = renderxCircles(circlesGroup, xLinearScale, chosenXAxis);
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
          abbrGroup = xtext(abbrGroup, xLinearScale, chosenXAxis);
               
        }

        
      });


         ylabelsGroup.selectAll("text")
        .on("click", function() {
          // get value of selection
          var value = d3.select(this).attr("value");
          if (value !== chosenYAxis) {
    
            // replaces chosenXAxis with value
            chosenYAxis = value;
    
           
            // updates x scale for new data
            yLinearScale = yScale(data, chosenYAxis);
    
            // updates x axis with transition
            yAxis = renderyAxes(yLinearScale, yAxis); 
    
            // updates circles with new x values
            circlesGroup = renderyCircles(circlesGroup, yLinearScale, chosenYAxis);
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
            abbrGroup = ytext(abbrGroup, yLinearScale, chosenYAxis);
          }
  
      });


  });
  
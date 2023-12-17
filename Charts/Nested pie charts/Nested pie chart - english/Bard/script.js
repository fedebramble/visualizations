// Load the data using D3.js
d3.csv("processed_english_data_2.csv", function(error, data) {
  if (error) throw error;

  // Process the data
  const nestedData = d3.nest()
    .key(function(d) { return d.category; })
    .entries(data);

  // Create the nested pie chart
  createNestedPieChart(nestedData);
});

// Function to create the nested pie chart
function createNestedPieChart(data) {
  // Define the width and height of the chart
  const width = document.getElementById("chart").clientWidth;
  const height = document.getElementById("chart").clientHeight;

  // Create the SVG element
  const svg = d3.select("#chart")
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  // Define the scales
  const arcScale = d3.scale.linear()
    .domain([0, d3.max(data, d => d.value)])
    .range([0, 2 * Math.PI]);

  const sliceScale = d3.scale.ordinal()
    .domain(data.map(d => d.key))
    .range(d3.range(data.length));

  // Create the pie chart slices
  const slices = svg.selectAll(".pie-slice")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "pie-slice");

  // Add arcs to the pie slices
  slices.append("path")
    .attr("d", d3.svg.arc()
      .innerRadius(0)
      .outerRadius(width / 2)
      .startAngle(d => arcScale(d.startAngle))
      .endAngle(d => arcScale(d.endAngle))
    );

  // Add text labels to the pie slices
  slices.append("text")
    .attr("x", d => arcScale(d.midAngle) * Math.cos(Math.PI / 2))
    .attr("y", d => arcScale(d.midAngle) * Math.sin(Math.PI / 2))
    .attr("text-anchor", "middle")
    .text(d => d.key);

// Create nested slices for the top-level categories
slices.filter(d => d.children)
  .selectAll(".nested-slice")
  .data(function(d) { return d.children; })
  .enter()
  .append("g")
  .attr("class", "nested-slice");

// Add arcs to the nested slices
d3.selectAll(".nested-slice").append("path")
  .attr("d", d3.svg.arc()
    .innerRadius(0)
    .outerRadius(width / 3)
    .startAngle(d => arcScale(d.startAngle))
    .endAngle(d => arcScale(d.endAngle))
  );

  // Add a title to the chart
svg.append("text")
.attr("x", width / 2)
.attr("y", 20)
.attr("text-anchor", "middle")
.text("Reading and Writing Topics")
.attr("font-size", "16px");
}

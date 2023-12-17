// Simulated data
const data = {
    name: "Category A",
    children: [
      { name: "Subcategory 1", value: 40 },
      { name: "Subcategory 2", value: 30 },
      { name: "Subcategory 3", value: 20 },
      { name: "Subcategory 4", value: 10 },
    ]
  };
  
  // Define the width and height of the chart
  const width = document.getElementById("chart").clientWidth;
  const height = document.getElementById("chart").clientHeight;
  
  // Create the SVG element
  const svg = d3.select("#chart")
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);
  
  // Define the scales
  const arcScale = d3.scale.linear()
    .domain([0, d3.max(data.children, d => d.value)])
    .range([0, 2 * Math.PI]);
  
  const sliceScale = d3.scale.ordinal()
    .domain([0, data.children.length])
    .range(d3.range(data.children.length));
  
  // Create the pie chart slice
  const pieSlice = svg.append("g")
    .attr("class", "pie-slice");
  
  // Add an arc to the pie slice
  pieSlice.append("path")
    .attr("d", d3.svg.arc()
      .innerRadius(0)
      .outerRadius(width / 2)
      .startAngle(0)
      .endAngle(2 * Math.PI)
    );
  
  // Create nested slices for each child category
  pieSlice.selectAll(".nested-slice")
    .data(data.children)
    .enter()
    .append("g")
      .attr("class", "nested-slice");
  
  // Add arcs to the nested slices
  d3.selectAll(".nested-slice").append("path")
    .attr("d", d3.svg.arc()
      .innerRadius(width / 4)
      .outerRadius(width / 2)
      .startAngle(d => arcScale(d.startAngle))
      .endAngle(d => arcScale(d.endAngle))
    );
  
  // Add text labels to the nested slices
  d3.selectAll(".nested-slice").append("text")
    .attr("x", d => arcScale(d.midAngle) * Math.cos(Math.PI / 2))
    .attr("y", d => arcScale(d.midAngle) * Math.sin(Math.PI / 2))
    .attr("text-anchor", "middle")
    .text(d => d.name);
  
  // Add a title to the chart
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .text("Simple Nested Pie Chart")
    .attr("font-size", "16px");
  
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
  
  // Define the margin
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  
  // Define the x and y scales
  const xScale = d3.scale.ordinal()
    .domain(data.children.map(d => d.name))
    .rangeBands([0, width - margin.left - margin.right]);
  
  const yScale = d3.scale.linear()
    .domain([0, d3.max(data.children, d => d.value)])
    .range([height - margin.top - margin.bottom, 0]);
  
  // Create the SVG element
  const svg = d3.select("#chart")
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  // Create the bars
  svg.selectAll(".bar")
    .data(data.children)
    .enter()
    .append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.name))
      .attr("y", d => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - margin.top - margin.bottom - yScale(d.value));
  
  // Add text labels to the bars
  svg.selectAll(".text")
    .data(data.children)
    .enter()
    .append("text")
      .attr("class", "text")
      .attr("x", d => xScale(d.name) + (xScale.bandwidth() / 2))
      .attr("y", d => yScale(d.value) - 5)
      .text(d => d.value);
  
  // Add a title to the chart
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2)
    .attr("text-anchor", "middle")
    .text("Simple Bar Graph")
    .attr("font-size", "16px");
  
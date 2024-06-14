// Data for the bars
const data = [
  { category: "CONFIDENCE", value: 74 },
  { category: "UNDERSTANDING", value: 77 },
  { category: "ENGAGEMENT", value: 88 }
];



// Set the dimensions and margins of the graph
const margin = {top: 20, right: 20, bottom: 40, left: 10},
      width = 540 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom; // Increased height for thicker bars

// Append the svg object to the div called 'chart'
const svg = d3.select("#chart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// X scale
const x = d3.scaleLinear()
  .domain([0, 100])
  .range([0, width]);

// Y scale - decreased padding for thicker bars
const y = d3.scaleBand()
    .range([0, height])
    .domain(data.map(d => d.category))
    .padding(0.2); // Adjust padding to control bar thickness

// After appending the svg and setting its attributes, but before appending the bars and labels
svg.append("text")
    .attr("class", "title") // Assign a class for styling if needed
    .attr("x", 210)
    .attr("y", 0) 
    .attr("text-anchor", "end") // Center the text
    .style("font-size", "24px") // Set the font size as desired
    .style("fill", "black") // Set the fill color as desired
    .text("33,000 CUE Ratings");


//Bars
  svg.selectAll("myRect")
    .data(data)
    .join("rect")
    .attr("class", "bar")
    .attr("x", x(0))
    .attr("y", d => y(d.category))
    .attr("width", d => x(d.value))
    .attr("height", y.bandwidth())



// Category labels
svg.selectAll("myCategory")
  .data(data)
  .join("text")
  .attr("class", "label")
  .attr("x", d => x(d.value) / 2) // Center text in the middle of the bar
  .attr("y", d => y(d.category) + y.bandwidth() / 2) // Center text in the bar
  .attr("text-anchor", "middle") // Center the text
  .attr("dy", ".35em")
  .style("fill", "white") // Make text color white for visibility
  .text(d => d.category);

// Percentage labels
svg.selectAll("myValue")
  .data(data)
  .join("text")
  .attr("class", "label")
  .attr("x", d => x(d.value) - 5) // Position label a bit to the left from the bar end
  .attr("y", d => y(d.category) + y.bandwidth() / 2)
  .attr("dy", ".35em")
  .attr("text-anchor", "end") // Align text at the end of the bar
  .style("fill", "white")
  .text(d => `${d.value}%`);

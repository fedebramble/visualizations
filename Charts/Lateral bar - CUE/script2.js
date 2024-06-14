// Data for the bars
const data = [
    { category: "CONFIDENCE", value: 74 },
    { category: "UNDERSTANDING", value: 77 },
    { category: "ENGAGEMENT", value: 88 }
  ];
  
  // Set the dimensions and margins of the graph
  const margin = {top: 30, right: 30, bottom: 40, left: 10},
        width = 450 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;
  
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
  
  // Y scale
  const y = d3.scaleBand()
    .range([0, height])
    .domain(data.map(d => d.category))
    .padding(0.1);
  
  //Bars
  svg.selectAll("myRect")
    .data(data)
    .join("rect")
    .attr("class", "bar")
    .attr("x", x(0))
    .attr("y", d => y(d.category))
    .attr("width", d => x(d.value))
    .attr("height", y.bandwidth())
  
  // Text labels
svg.selectAll("myText")
.data(data)
.join("text")
.attr("class", "label")
.attr("x", d => x(d.value) / 2) // Center text in the middle of the bar
.attr("y", d => y(d.category) + y.bandwidth() / 2) // Center text in the bar
.attr("text-anchor", "middle") // Center the text
.attr("dy", ".35em")
.style("fill", "white") // Make text color white for visibility
.text(d => `${d.value}%`);

// Data for the stacked bar chart
const data = [
    { statement: "More relaxed and focussed", "Tutors and teachers": 79, "Student": 216, "Parent": 33 },
    { statement: "Searchable lesson recordings aid", "Tutors and teachers": 41, "Student": 160, "Parent": 25 },
    { statement: "Easier to track progress", "Tutors and teachers": 26, "Student": 120, "Parent": 20 },
    { statement: "Cover more content online", "Tutors and teachers": 39, "Student": 110, "Parent": 7 },
    { statement: "Lesson recordings keep tutor and student safe", "Tutors and teachers": 39, "Student": 94, "Parent": 18 }
  ];
  
  // Set the dimensions and margins of the graph
  const margin = { top: 20, right: 80, bottom: 60, left: 220 },
        width = 1276 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
  
  // Append the svg object to the body of the page
  const svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
  // List of subgroups (header of the CSV)
  const subgroups = ["Tutors and teachers", "Student", "Parent"];
  
  // List of groups (here I have one group per column)
  const groups = data.map(d => d.statement)
  
  // Add X axis
  const x = d3.scaleLinear()
    .domain([0, 350])
    .range([0, width]);
  
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));
  
  // Add Y axis
  const y = d3.scaleBand()
    .domain(groups)
    .range([0, height])
    .padding([0.5])
  
  svg.append("g")
    .call(d3.axisLeft(y));
  
  //stack the data
  const stackedData = d3.stack()
    .keys(subgroups)
    (data)
  
  // color palette
  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#29dae4','#1aa7ee','#4328e7'])
  
  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in the stack data
    .data(stackedData)
    .enter().append("g")
      .attr("fill", d => color(d.key))
    .selectAll("rect")
    .data(d => d)
    .enter().append("rect")
      .attr("y", d => y(d.data.statement))
      .attr("x", d => x(d[0]))
      .attr("width", d => x(d[1]) - x(d[0]))
      .attr("height", y.bandwidth())
  

// Add legend with correct positioning
const legendPadding = 10; // Padding from the left edge of the SVG canvas
const legendItemSpacing = 200; // Spacing between legend items
const legend = svg.append("g")
  .attr("class", "legend")
  .attr("transform", `translate(${legendPadding}, ${-margin.top / 2})`)
  .selectAll("g")
  .data(subgroups)
  .enter().append("g")
    .attr("transform", (d, i) => `translate(${i * 150 + legendItemSpacing * i},0)`);

legend.append("rect")
  .attr("x", 0)
  .attr("width", 18)
  .attr("height", 18)
  .attr("fill", color);

legend.append("text")
  .attr("x", 22)
  .attr("y", 9)
  .attr("dy", ".35em")
  .text(d => d);

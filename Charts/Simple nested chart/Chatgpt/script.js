// script.js

// Sample data for the nested pie chart
const data = [
    {
      category: "A",
      value: 100,
      subcategories: [
        { label: "A1", value: 30 },
        { label: "A2", value: 20 },
        { label: "A3", value: 50 }
      ]
    },
    {
      category: "B",
      value: 100,
      subcategories: [
        { label: "B1", value: 40 },
        { label: "B2", value: 60 }
      ]
    }
  ];
  
  // Create a nested pie chart
  const width = 500;
  const height = 500;
  const radius = Math.min(width, height) / 2;
  
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  
  const arc = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);
  
  const labelArc = d3.arc()
    .outerRadius(radius - 40)
    .innerRadius(radius - 40);
  
  const pie = d3.pie()
    .sort(null)
    .value(d => d.value);
  
  const svg = d3.select('#d3-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
  
  // Create a group for each category
  const categoryGroups = svg.selectAll('.category')
    .data(data)
    .enter().append('g')
    .attr('class', 'category');
  
  // Draw the outer pie for each category
  categoryGroups.selectAll('path.outer')
    .data(d => pie([{ label: d.category, value: d.value }]))
    .enter().append('path')
    .attr('class', 'outer')
    .attr('d', arc)
    .style('fill', (d, i) => color(i));
  
  // Draw the inner pie for each category
  categoryGroups.selectAll('path.inner')
    .data(d => pie(d.subcategories))
    .enter().append('path')
    .attr('class', 'inner')
    .attr('d', arc)
    .style('fill', d => color(d.data.label));
  
  // Add text labels for each subcategory
  categoryGroups.selectAll('text')
    .data(d => pie(d.subcategories))
    .enter().append('text')
    .attr('transform', d => 'translate(' + labelArc.centroid(d) + ')')
    .attr('dy', '.35em')
    .text(d => d.data.label);
  
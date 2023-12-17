// script.js

// Load data from CSV file
d3.csv('processed_english_data_2.csv').then(function(data) {
  // Convert percentage strings to numbers
  data.forEach(function(d) {
    d.Proportion = +d.Proportion.replace('%', '');
  });

  // Create a nested pie chart
  createNestedPieChart(data);
});

// Function to create nested pie chart
function createNestedPieChart(data) {
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
    .value(d => d.Proportion);

  const svg = d3.select('#d3-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

  const g = svg.selectAll('.arc')
    .data(pie(data))
    .enter().append('g')
    .attr('class', 'arc');

  g.append('path')
    .attr('d', arc)
    .style('fill', d => color(d.data.topic + '_' + d.data.subtopic));

  g.append('text')
    .attr('transform', d => 'translate(' + labelArc.centroid(d) + ')')
    .attr('dy', '.35em')
    .text(d => d.data.subtopic);

  // Add a tooltip
  const tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

  g.on('mouseover', function(event, d) {
    tooltip.transition()
      .duration(200)
      .style('opacity', .9);
    tooltip.html(d.data.subtopic + '<br>' + d.data.Proportion + '%')
      .style('left', (event.pageX) + 'px')
      .style('top', (event.pageY - 28) + 'px');
  })
  .on('mouseout', function(d) {
    tooltip.transition()
      .duration(500)
      .style('opacity', 0);
  });
}

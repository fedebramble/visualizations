// Sample data - replace with your actual data
const data = [
    { category: 'ALL', pre: 42, post: 68, increase: '62%' },
    { category: 'KS2', pre: 38, post: 66, increase: '74%' },
    { category: 'KS3', pre: 54, post: 74, increase: '38%' },
    { category: 'KS4', pre: 41, post: 68, increase: '65%' }
];

const width = 960;
const height = 200; // Adjusted for fewer categories
const margin = { top: 20, right: 150, bottom: 30, left: 100 }; // Left margin increased for category names

// Create SVG container
const svg = d3.select('#connected_dot').append('svg')
    .attr('width', width)
    .attr('height', height);

// Scales for the data
const xScale = d3.scaleLinear()
    .domain([0, 100]) // Assuming the assessment scores are out of 100
    .range([margin.left, width - margin.right]);

const yScale = d3.scaleBand()
    .domain(data.map(d => d.category))
    .rangeRound([margin.top, height - margin.bottom])
    .padding(0.4);

// Add category names on the left side with white color
svg.selectAll('.category-name')
    .data(data)
    .enter().append('text')
    .attr('class', 'category-name')
    .attr('x', margin.left / 2) // Adjust as needed
    .attr('y', d => yScale(d.category) + yScale.bandwidth() / 2)
    .attr('text-anchor', 'end')
    .attr('alignment-baseline', 'middle')
    .attr('fill', 'white')
    .text(d => d.category);

// Add the lines
svg.selectAll('.line')
    .data(data)
    .enter().append('line')
    .attr('class', 'line')
    .attr('x1', d => xScale(d.pre))
    .attr('x2', d => xScale(d.post))
    .attr('y1', d => yScale(d.category) + yScale.bandwidth() / 2)
    .attr('y2', d => yScale(d.category) + yScale.bandwidth() / 2)
    .attr('stroke', '#000');

// Add the circles for pre-assessment
svg.selectAll('.circle-pre')
    .data(data)
    .enter().append('circle')
    .attr('class', 'circle-pre')
    .attr('cx', d => xScale(d.pre))
    .attr('cy', d => yScale(d.category) + yScale.bandwidth() / 2)
    .attr('r', 20)
    .attr('fill', '#1f77b4');

// Add the circles for post-assessment
svg.selectAll('.circle-post')
    .data(data)
    .enter().append('circle')
    .attr('class', 'circle-post')
    .attr('cx', d => xScale(d.post))
    .attr('cy', d => yScale(d.category) + yScale.bandwidth() / 2)
    .attr('r', 20)
    .attr('fill', '#2ca02c');

// Add the text for pre-assessment values inside the circles
svg.selectAll('.text-pre')
    .data(data)
    .enter().append('text')
    .attr('x', d => xScale(d.pre))
    .attr('y', d => yScale(d.category) + yScale.bandwidth() / 2 + 5)
    .attr('class', 'text-pre')
    .attr('text-anchor', 'middle')
    .text(d => d.pre)
    .style('fill', 'white');

// Add the text for post-assessment values inside the circles
svg.selectAll('.text-post')
    .data(data)
    .enter().append('text')
    .attr('x', d => xScale(d.post))
    .attr('y', d => yScale(d.category) + yScale.bandwidth() / 2 + 5)
    .attr('class', 'text-post')
    .attr('text-anchor', 'middle')
    .text(d => d.post)
    .style('fill', 'white');

// Add the text for percentage increase
svg.selectAll('.text-increase')
    .data(data)
    .enter().append('text')
    .attr('x', width - margin.right + 20) // place it to the right
    .attr('y', d => yScale(d.category) + yScale.bandwidth() / 2 + 5)
    .attr('class', 'text-increase')
    .attr('text-anchor', 'start')
    .text(d => `${d.increase} increase`)
    .style('fill', 'white'); // White text color

// Remove axes
svg.selectAll('.axis').remove();

// script.js

// The initial dataset now includes a second layer for "Reading".
const data = {
    name: "root",
    children: [
      {
        name: "Writing",
        children: [
          { name: "Creative", value: 24.52 },
          { name: "Writing", value: 0.62 },
          { name: "Grammar", value: 5.56 },
          { name: "Analytical", value: 0.96 },
          { name: "Transactional", value: 5.73 }
        ]
      },
      {
        name: "Reading",
        // The children array now includes the data for the second graph.
        children: [
          {
            name: "Reading Details",
            children: [
              { name: "Literacy", value: 13.05 },
              { name: "Critical reading", value: 8.50 },
              { name: "Language + structure", value: 23.47 },
              { name: "Reading", value: 4.58 },
              { name: "Shakespeare", value: 5.96 }
            ]
          }
        ]
      }
    ]
  };
  
  
  // Specify the chart’s dimensions.
  const width = 928;
  const height = width;
  const radius = width / 6;
  
  // Create the color scale.
  const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));
  
  // Compute the layout.
  const hierarchy = d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value);
  const root = d3.partition()
    .size([2 * Math.PI, hierarchy.height + 1])
    (hierarchy);
  root.each(d => d.current = d);
  
  // Create the arc generator.
  const arc = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius * 1.5)
    .innerRadius(d => d.y0 * radius)
    .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));
  
  // Create the SVG container.
  const svg = d3.create("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, width])
    .style("font", "10px sans-serif");
  
  // Append the arcs.
  const path = svg.append("g")
    .selectAll("path")
    .data(root.descendants().slice(1))
    .join("path")
    .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
    .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
    .attr("pointer-events", d => arcVisible(d.current) ? "auto" : "none")
    .attr("d", d => arc(d.current));
  
  // Make them clickable if they have children.
  path.filter(d => d.children)
    .style("cursor", "pointer")
    .on("click", clicked);
  
  const format = d3.format(",d");
  path.append("title")
    .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);
  
  const label = svg.append("g")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .style("user-select", "none")
    .selectAll("text")
    .data(root.descendants().slice(1))
    .join("text")
    .attr("dy", "0.35em")
    .attr("fill-opacity", d => +labelVisible(d.current))
    .attr("transform", d => labelTransform(d.current))
    .text(d => d.data.name);
  
  // Parent circle for zoom-out
  const parent = svg.append("circle")
    .datum(root)
    .attr("r", radius)
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .on("click", clicked);
  
  // Zoom on click function
  // Adjust the clicked function to handle the transition to the second layer
function clicked(event, p) {
    if (p.depth === 0) return; // Do nothing if we're already at the root level
  
    // This condition checks if we are at the first layer and "Reading" is clicked
    if (p.depth === 1 && p.data.name === "Reading") {
      // Set the children of "Reading" as the new root
      p = p.children[0];
    }
  
    parent.datum(p.parent || root);
  
    // Transition the new arcs into place
    const t = svg.transition().duration(750);
  
    // Transition the arcs
    path.transition(t)
      .tween("data", d => {
        const i = d3.interpolate(d.current, {
          x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
          x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
          y0: Math.max(0, d.y0 - p.depth),
          y1: Math.max(0, d.y1 - p.depth)
        });
        return t => { d.current = i(t); };
      })
      .attrTween("d", d => () => arc(d.current));
  
    // Transition the labels
    label.transition(t)
      .attrTween("transform", d => {
        const i = d3.interpolate(d.current, {
          x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
          x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
          y0: Math.max(0, d.y0 - p.depth),
          y1: Math.max(0, d.y1 - p.depth)
        });
        return t => labelTransform(i(t));
      })
      .attr("fill-opacity", d => +labelVisible(d.current));
  
    // Make the currently visible arcs respond to mouse events
    path.filter(d => arcVisible(d.current))
      .attr("pointer-events", "all");
  
    // Make the currently invisible arcs not respond to mouse events
    path.filter(d => !arcVisible(d.current))
      .attr("pointer-events", "none");
  }
  
  // Visibility functions
  function arcVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
  }
  
  function labelVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
  }
  
  function labelTransform(d) {
    const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
    const y = (d.y0 + d.y1) / 2 * radius;
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  }
  
  document.getElementById('d3-container').appendChild(svg.node());
  
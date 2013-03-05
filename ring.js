// Generate the ring.
function generateRing(id, n_nodes, n_partitions, initialDescription) {
  var width = 700,
      height = 400,
      radius = Math.min(width, height) / 2;

  var ringId = "#" + id + "-ring";
  var descriptionId = "#" + id + "-desc";

  var svg = d3.select(ringId).append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var arc = d3.svg.arc()
      .startAngle(function(d) { return d.x; })
      .endAngle(function(d) { return d.x + d.dx; })
      .innerRadius(function(d) { return Math.sqrt(d.y); })
      .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

  var partition = d3.layout.partition()
      .sort(null)
      .size([2 * Math.PI, radius * radius])
      .value(function(d) { return 1; });

  // Build ring data.
  var renderRing = function(description, n_nodes, n_partitions, downNodes, highlightNodes) {
    var partitions = [],
        ring;

    for(var i = 0; i < n_partitions; i++) {
      var object = { id: i, name: "Node " + i % n_nodes };

      if(downNodes.indexOf(i) !== -1) {
        object.down = true;
      } else {
        object.down = false;
      }

      if(highlightNodes.indexOf(i) !== -1) {
        object.highlight = true;
      } else {
        object.highlight = false;
      }

      partitions.push(object);
    }

    // Redraw.
    ring = { name: "ring", children: partitions };

    // Ordinal color scale and animation duration.
    var duration = 1000,
        scale = d3.scale.category20(),
        color = function(d) { return scale(d.name); };

    // Redraw the partitions.
    var partitions = svg.selectAll("path")
        .data(partition.nodes(ring));

    partitions.enter()
      .append("path")
      .attr("d", arc)
      .style("stroke", "#fff")
      .style("fill", function(d) { return d.depth ? color(d) : "#333"; })
      .style("fill-rule", "evenodd");

    partitions
      .style("opacity", function(d) {
        if(d.down) {
          return 0.2;
        } else {
          return d.highlight ? 1.0 : 0.4;
        }
      })
      .transition()
        .delay(function(d, i) { return i / ring.children.length * duration; })
        .duration(duration)
        .style("fill", function(d) { return d.depth ? color(d) : "#333"; });

    d3.select(descriptionId).transition().duration(duration).text(description);
  }

  // Generate initial ring.
  renderRing(initialDescription, n_nodes, n_partitions, [], []);

  // Set proper height.
  d3.select(self.frameElement).style("height", height + "px");

  // Return update function.
  return { svgElement: svg, updateFunction: renderRing };

}

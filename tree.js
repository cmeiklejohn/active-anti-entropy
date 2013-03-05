// Generate a merkle tree.
function generateTree(id, initialDescription) {
  var width = 700,
      height = 400,
      radius = Math.min(width, height) / 2;

  var duration = 1000,
      maxLabelLength = 5,
      fontSize = 12,
      nodeRadius = 5;

  var treeId = "#" + id + "-tree";
  var descriptionId = "#" + id + "-desc";

  var tree = d3.layout.tree()
        .sort(null)
        .size([height, width - maxLabelLength * fontSize])
        .children(function(d) {
          return (!d.contents || d.contents.length === 0) ? null : d.contents;
        });

  var svg = d3.select(treeId)
     .append("svg:svg")
        .attr("class", "tree")
        .attr("width", width)
        .attr("height", height)
     .append("svg:g")
       .attr("class", "container")
       .attr("transform", "translate(" + maxLabelLength + ",0)");

  var data = {
    name: "f8f947",
    contents: [
      { name: "f98d30", contents: [
        { name: "f5acd9", contents: [] },
        { name: "5facd9", contents: [] },
        { name: "f5acd9", contents: [] },
        { name: "5facd9", contents: [] },
        { name: "f5acd9", contents: [] },
        { name: "af5cd9", contents: [] },
        { name: "f59cda", contents: [] },
        { name: "d70fff", contents: [] }
      ] },
      { name: "f8f947", contents: [
        { name: "f5acde", contents: [] },
        { name: "facd70", contents: [] }
      ] }
    ]
   };

  var renderTree = function(description, data) {
     var link = d3.svg.diagonal()
                  .projection(function(d) { return [d.y, d.x]; });

     var nodes = tree.nodes(data);
     var links = tree.links(nodes);

     svg.selectAll("path.link")
         .data(links)
         .enter()
         .append("svg:path")
         .attr("class", "link")
         .attr("d", link);

     var nodeGroup = svg.selectAll("g.node")
           .data(nodes)
           .enter()
         .append("svg:g")
           .attr("class", "node")
           .attr("transform", function(d) {
               return "translate(" + d.y + "," + d.x + ")";
           });

     nodeGroup.append("svg:circle")
         .attr("class", "node-dot")
         .attr("r", nodeRadius);

     nodeGroup.append("svg:text")
         .attr("text-anchor", function(d)
           { return d.children ? "end" : "start"; })
         .attr("dx", function(d)
           { var gap = 2 * nodeRadius; return d.children ? -gap : gap; })
         .attr("dy", 3)
         .text(function(d) { return d.name; })
         .on("click", function(d) {
            var self = d3.select(this.parentNode);
            self.style("fill", "red");

            d3.selectAll("g.node")
              .filter(function(d, i) { return d === self.datum().parent; })
              .style("fill", "red");

            d3.selectAll("g.node")
              .filter(function(d, i) { return d === self.datum().parent.parent; })
              .style("fill", "red");
         });

    d3.select(descriptionId).transition().duration(duration).text(description);
  };

  // Generate initial tree.
  renderTree(initialDescription, data);

  // Set proper height.
  d3.select(self.frameElement).style("height", height + "px");

  // Return update function.
  return { svgElement: svg, updateFunction: renderTree };

}

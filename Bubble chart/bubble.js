define(["jquery","./d3.min"], function($, cssContent) {'use strict';
	$("<style>").html(cssContent).appendTo("head");
	return {
		initialProperties : {
			version : 1.0,
			qHyperCubeDef : {
				qDimensions : [],
				qMeasures : [],
				qInitialDataFetch : [{
					qWidth : 10,
					qHeight : 50
				}]
			}
		},
		definition : {
			type : "items",
			component : "accordion",
			items : {
				dimensions : {
					uses : "dimensions",
					min : 1
				},
				measures : {
					uses : "measures",
					min : 0
				},
				sorting : {
					uses : "sorting"
				},
				settings : {
					uses : "settings",
					items : {
						initFetchRows : {
							ref : "qHyperCubeDef.qInitialDataFetch.0.qHeight",
							label : "Initial fetch rows",
							type : "number",
							defaultValue : 50
						},
					}
				}
			}
		},
		snapshot : {
			canTakeSnapshot : true
		},
		paint : function($element, layout) {
		console.log($element, layout);
		

var width = $element.width();
// Chart object height
var height = $element.height();
// Chart object id
var id = "container_" + layout.qInfo.qId;
// Check to see if the chart element has already been created
if (document.getElementById(id)) {
    // if it has been created, empty it's contents so we can redraw it
    $("#" + id).empty();
}
else {
    // if it hasn't been created, create it with the appropiate id and size
    $element.append($('<div />').attr("id", id).width(width).height(height));
}

console.log(layout);

var basedata  = layout.qHyperCube.qDataPages[0].qMatrix;

var child = basedata.map(function(d){ return { name:d[0].qText,size:d[1].qNum };})

var root = {
  "name": "parent",
  "children":child
};	

var diameter = width,
    format = d3.format(",d"),
    color = d3.scale.ordinal().range(["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d", "#666666"]);

var bubble = d3.layout.pack()
    .sort(null)
    .size([width, height])
    .padding(1.5);

 var svg = d3.select("#"+id).append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");


  var node = svg.selectAll(".node")
      .data(bubble.nodes(classes(root))
      .filter(function(d) { return !d.children; }))
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  node.append("title")
      .text(function(d) { return d.className + ": " + format(d.value); });

  node.append("circle")
      .attr("r", function(d) { return d.r; })
      .style("fill", function(d) { return color(d.r); });

  node.append("text")
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
	  .style("fill","#fff")
      .text(function(d) { return d.className.substring(0, d.r / 4); });


// Returns a flattened hierarchy containing all leaf nodes under the root.
function classes(root) {
  var classes = [];

  function recurse(name, node) {
    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
    else classes.push({packageName: name, className: node.name, value: node.size});
  }

  recurse(null, root);
  return {children: classes};
}
			
			
		}
	};
})

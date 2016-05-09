define(["jquery","./d3.min",'text!./style.css'], function($, cssContent) {'use strict';
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


var basedata  = layout.qHyperCube.qDataPages[0].qMatrix;
console.log(basedata);

var position = checkMeasureDimension(basedata);

var nesteddata = d3.nest()
				.key(function(d) { return d[position.Dimension.index].qText; })
				.entries(basedata);
				


var child = basedata.map(function(d){ return { name:d[0].qText,size:d[1].qNum };})



if(nesteddata.length >1){
var child = nesteddata.map(function(d){
var children = d.values.map(function(d){ return { name:d[1].qText,size:d[2].qNum };});

return {name:d.key,size:200,children :children }

})

}
console.log(child);

var margin = {top: 20, right: 20, bottom: 20, left: 50};
  
var i = 0,
    duration = 750,
    root;

var root = {
  "name": "parent",
  "size":2000,
  "children":child
};


var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });


 var svg = d3.select("#"+id).append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "driver-tree")
  .append("g").attr("transform", "translate(" + margin.left + "," +0 + ")");

 
  root.x0 = height / 2;
  root.y0 = 0;

  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  root.children.forEach(collapse);
  update(root);

function update(source) {

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", click);

baseRectangle(nodeEnter);
valueRectangle(nodeEnter);

  nodeEnter.append("text")
      .attr("dy", "15px")
	  .attr("dx","10px")
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      }).attr("style","fill:none;stroke:#ccc;stroke-width:1px");

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}


function baseRectangle(container){

container.append("rect")
  .attr("y", -20)
  .attr("width", 140)
  .attr("height", 40)
  .attr("class", "baseRectangle")
  .attr("fill", function (d) {
  return "#C1C0C0";
});
}

function valueRectangle(container){

           container
                .append("rect")
                .attr("y", -15)
                .attr("x", 15)
                .attr("width", 100)
                .attr("height", 14)
                .attr("fill", "#f1f1f1");


            container
                      .append("rect")
                      .attr("y", -15)
                       .attr("x", 10)
                     .attr("width", function (d) {
                         return 20;
                     })
                      .attr("height", 14)
                      .attr("fill", "#005d9d");

}

function checkMeasureDimension(basedata){
var mindex, mcount, dindex, dcount;
basedata[0].map(function(d,i){
if(d.qNum === "NaN"){
mindex = i+1;
mcount = basedata[0].length -mindex;
dcount =i;
dindex =0;
} 

})

return {Measure: {index:mindex,count:mcount},Dimension:{index:dindex,count:dcount}}

}










			
		}
	};
})

# GraphSvg
A javascript/typescript library for converting graphs to SVG images.

## See it [online](http://reza1024.github.io/GraphSvg/)

## How to use it in your code
Just include the `GraphSvg.js` in your page and pass the graph information:

``` javascript
var graph = {
	vertices: [{x:20, y:100}, {x:120, y:180}, {x:120, y:20}, {x:220, y: 100}],
	verticesLabel: ["A", "B", "C", "D"], // optional
	edges: [[0, 1], [0, 2], [0, 3], [1, 2]],
	edgesWeight: [1, 1, 5, 1], // optional
	verticesHoverLabel: ["Apple", "Book", "Cat", "Dog"] // optional
};

var svgSettings = {
	width: 240,
	height: 200,
	edgeWidth: 1.5,
	vertexStrokeWidth: 1,
	vertexRadius: 19,
	vertexStrokeColor: "#BECFE9", // optional
	edgeColor: "#CFE9BE", // optional
	vertexFillColor: "#E9BECF" // optional
};

document.getElementById("container").innerHtml = GraphSvg.toSvg("svgElementId", graph, settings);
```

to generate a svg:

![Svg Graph](http://reza1024.github.io/GraphSvg/GraphSvg.svg)

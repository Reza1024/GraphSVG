# GraphSvg
A javascript/typescript library for converting graphs to SVG images.

## See it [online](http://reza1024.github.io/GraphSvg/)

## How to use it in your code
Just include [`d3`](http://d3js.org/d3.v3.min.js) and `GraphSvg.js` in your page and pass the graph information:

``` javascript
var graph = {
	vertices: [
		{ x: 20, y: 100, label: "A", hoverLabel: "Apple"},
		{ x: 120, y: 180, label: "B", hoverLabel: "Book"},
		{ x: 120, y: 20, label: "C" },
		{ x: 220, y: 100, label: "D", hoverLabel: "Dog", weight: 0.75 }
	],
	edges: [
		{ v1: 0, v2: 1 },
		{ v1: 0, v2: 2 },
		{ v1: 0, v2 : 3, weight: 5 },
		{ v1: 1, v2: 2 }
	]
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
```
then call
``` javascript
GraphSvg.toSvg("#container", "svgElementId", graph, settings);
```

to generate a svg:

![Svg Graph](http://reza1024.github.io/GraphSvg/GraphSvg.svg)

## To Do
Automatic embedding of planar graphs is coming soon

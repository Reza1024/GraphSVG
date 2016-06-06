/// <reference path="GraphSvg.ts"/>
/// <reference path="Scripts/d3.d.ts"/>

export module GraphSvg {
	export interface IVertex {
		x: number;
		y: number;
		label?: string;
		hoverLabel?: string;
		imageUrl?: string;
		weight?: number;
		class?: string;
	}

	export interface IEdge {
		v1: number;
		v2: number;
		weight?: number;
		class?: string;
	}

	export interface IGraph {
		vertices: IVertex[];
		edges: IEdge[];
	}

	export interface ISettings {
		width: number;
		height: number;
		vertexRadius: number;
		edgeWidth: number; // optional unless "weight" property of any of the vertices is set
		vertexStrokeWidth: number; // optional
		svgViewBox: string; // optional
		edgeColor: string; // optional
		vertexFillColor: string; // optional
		vertexStrokeColor: string; // optional
		labelColor: string; // optional
	}
}

export class GraphSvgD3 {
	static toSvg(svgContainerSelector: string, elementId: string, graph: GraphSvg.IGraph, settings: GraphSvg.ISettings): void {
		var svg = GraphSvgD3._buildSvgStructure(svgContainerSelector, elementId)
			.attr("width", settings.width)
			.attr("height", settings.height)
			.attr("viewBox", settings.svgViewBox);

		var vertices = svg
			.select("g.vertices")
			.style("fill", settings.vertexFillColor)
			.style("stroke", settings.vertexStrokeColor)
			.style("stroke-width", settings.vertexStrokeWidth)
			.selectAll("circle")
			.data(graph.vertices);
		vertices.enter().append("circle");
		vertices
			.attr("cx", v => v.x)
			.attr("cy", v => v.y)
			.attr("r", v => GraphSvgD3._radius(v, settings))
			.attr("class", e => e.class);
		vertices.exit().remove();

		var edges = svg
			.select("g.edges")
			.style("stroke-width", settings.edgeWidth)
			.style("stroke", settings.edgeColor)
			.selectAll("line")
			.data(graph.edges);
		edges.enter().append("line");
		edges
			.attr("x1", e => graph.vertices[e.v1].x)
			.attr("y1", e => graph.vertices[e.v1].y)
			.attr("x2", e => graph.vertices[e.v2].x)
			.attr("y2", e => graph.vertices[e.v2].y)
			.style("stroke-width", e => e.weight && settings.edgeWidth ? e.weight * settings.edgeWidth : null)
			.attr("class", e => e.class);
		edges.exit().remove();

		var verticesClipPath = svg
			.select("defs")
			.selectAll("clipPath")
			.data(graph.vertices.filter(v => !!v.imageUrl));
		verticesClipPath.enter().append("clipPath");
		verticesClipPath.html("").append("circle")
			.attr("cx", v => v.x)
			.attr("cy", v => v.y)
			.attr("r", v => GraphSvgD3._radius(v, settings))
		verticesClipPath.exit().remove();

		var verticesImage = svg
			.selectAll("g.verticesImage > image")
			.data(graph.vertices.filter(v => !!v.imageUrl));
		verticesImage.enter().append("image");
		verticesImage
			.attr("xlink:href", v => v.imageUrl)
			.attr("clip-path", (v, i) => `url(#${elementId}-v${i})"`)
			.attr("x", v => v.x - GraphSvgD3._radius(v, settings))
			.attr("y", v => v.y - GraphSvgD3._radius(v, settings))
			.attr("width", v => 2 * GraphSvgD3._radius(v, settings) + 1)
			.attr("height", v => 2 * GraphSvgD3._radius(v, settings) + 1);
		verticesImage.exit().remove();

		var verticesLabel = svg
			.select("g.verticesLabels")
			.style("text-anchor", "middle")
			.style("fill", settings.labelColor)
			.style("dominant-baseline", "central")
			.selectAll("text")
			.data(graph.vertices.filter(v => !!v.label));
		verticesLabel.enter().append("text");
		verticesLabel
			.attr("x", v => v.x)
			.attr("y", v => v.y)
			.text(v => v.label);
		verticesLabel.exit().remove();

		[vertices, verticesImage, verticesLabel].forEach(selection => {
			selection.selectAll("title").remove();
			selection
				.filter(v => !!v.hoverLabel)
				.append("title").text(v => v.hoverLabel)
		});
	}

	private static _radius(v: GraphSvg.IVertex, settings: GraphSvg.ISettings) {
		return v.weight ? v.weight * settings.vertexRadius : settings.vertexRadius;
	}

	private static _buildSvgStructure(svgContainerSelector: string, elementId: string) {
		var svg = d3.select(svgContainerSelector).select("svg");
		if (svg.empty()) {
			svg = d3.select(svgContainerSelector).append("svg")
				.attr("id", elementId)
				.attr("version", "1.1")
				.attr("xmlns", "http://www.w3.org/2000/svg")
				.attr("xmlns:xlink", "http://www.w3.org/1999/xlink");

			svg.append("defs");
			svg.append("g").classed("edges", true);
			svg.append("g").classed("vertices", true);
			svg.append("g").classed("verticesLabels", true);
			svg.append("g").classed("verticesImage", true);
		}
		return svg;
	}
}

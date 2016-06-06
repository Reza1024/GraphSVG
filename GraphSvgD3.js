/// <reference path="GraphSvg.ts"/>
/// <reference path="Scripts/d3.d.ts"/>
"use strict";
var GraphSvgD3 = (function () {
    function GraphSvgD3() {
    }
    GraphSvgD3.toSvg = function (svgContainerSelector, elementId, graph, settings) {
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
            .attr("cx", function (v) { return v.x; })
            .attr("cy", function (v) { return v.y; })
            .attr("r", function (v) { return GraphSvgD3._radius(v, settings); })
            .attr("class", function (e) { return e.class; });
        vertices.exit().remove();
        var edges = svg
            .select("g.edges")
            .style("stroke-width", settings.edgeWidth)
            .style("stroke", settings.edgeColor)
            .selectAll("line")
            .data(graph.edges);
        edges.enter().append("line");
        edges
            .attr("x1", function (e) { return graph.vertices[e.v1].x; })
            .attr("y1", function (e) { return graph.vertices[e.v1].y; })
            .attr("x2", function (e) { return graph.vertices[e.v2].x; })
            .attr("y2", function (e) { return graph.vertices[e.v2].y; })
            .style("stroke-width", function (e) { return e.weight && settings.edgeWidth ? e.weight * settings.edgeWidth : null; })
            .attr("class", function (e) { return e.class; });
        edges.exit().remove();
        var verticesClipPath = svg
            .select("defs")
            .selectAll("clipPath")
            .data(graph.vertices.filter(function (v) { return !!v.imageUrl; }));
        verticesClipPath.enter().append("clipPath");
        verticesClipPath.html("").append("circle")
            .attr("cx", function (v) { return v.x; })
            .attr("cy", function (v) { return v.y; })
            .attr("r", function (v) { return GraphSvgD3._radius(v, settings); });
        verticesClipPath.exit().remove();
        var verticesImage = svg
            .selectAll("g.verticesImage > image")
            .data(graph.vertices.filter(function (v) { return !!v.imageUrl; }));
        verticesImage.enter().append("image");
        verticesImage
            .attr("xlink:href", function (v) { return v.imageUrl; })
            .attr("clip-path", function (v, i) { return ("url(#" + elementId + "-v" + i + ")\""); })
            .attr("x", function (v) { return v.x - GraphSvgD3._radius(v, settings); })
            .attr("y", function (v) { return v.y - GraphSvgD3._radius(v, settings); })
            .attr("width", function (v) { return 2 * GraphSvgD3._radius(v, settings) + 1; })
            .attr("height", function (v) { return 2 * GraphSvgD3._radius(v, settings) + 1; });
        verticesImage.exit().remove();
        var verticesLabel = svg
            .select("g.verticesLabels")
            .style("text-anchor", "middle")
            .style("fill", settings.labelColor)
            .style("dominant-baseline", "central")
            .selectAll("text")
            .data(graph.vertices.filter(function (v) { return !!v.label; }));
        verticesLabel.enter().append("text");
        verticesLabel
            .attr("x", function (v) { return v.x; })
            .attr("y", function (v) { return v.y; })
            .text(function (v) { return v.label; });
        verticesLabel.exit().remove();
        [vertices, verticesImage, verticesLabel].forEach(function (selection) {
            selection.selectAll("title").remove();
            selection
                .filter(function (v) { return !!v.hoverLabel; })
                .append("title").text(function (v) { return v.hoverLabel; });
        });
    };
    GraphSvgD3._radius = function (v, settings) {
        return v.weight ? v.weight * settings.vertexRadius : settings.vertexRadius;
    };
    GraphSvgD3._buildSvgStructure = function (svgContainerSelector, elementId) {
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
    };
    return GraphSvgD3;
}());
exports.GraphSvgD3 = GraphSvgD3;
//# sourceMappingURL=GraphSvgD3.js.map
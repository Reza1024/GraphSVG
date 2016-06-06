"use strict";
var GraphSvg = (function () {
    function GraphSvg() {
    }
    GraphSvg.toSvg = function (elementId, graph, settings) {
        var svgBuilder = [];
        svgBuilder.push("<svg ", "id=\"" + elementId + "\" ", "width=\"" + settings.width + "\" ", "height=\"" + settings.height + "\" ", "version=\"1.1\" ", "xmlns=\"http://www.w3.org/2000/svg\" ", "xmlns:xlink=\"http://www.w3.org/1999/xlink\" ", (settings.svgViewBox) ? "viewBox=\"" + settings.svgViewBox + "\" " : "", ">");
        if (graph.verticesImagesUrl)
            GraphSvg._drawVerticesClipPath(elementId, svgBuilder, graph, settings);
        svgBuilder.push("<g>");
        GraphSvg._drawEdges(svgBuilder, graph, settings);
        GraphSvg._drawVertices(svgBuilder, graph, settings);
        svgBuilder.push("</g>");
        if (graph.verticesImagesUrl)
            GraphSvg._drawVerticesImage(elementId, svgBuilder, graph, settings);
        else if (graph.verticesLabel)
            GraphSvg._drawVerticesLabels(svgBuilder, graph, settings);
        svgBuilder.push("</svg>");
        return svgBuilder.join("");
    };
    GraphSvg._drawVertices = function (svgBuilder, graph, settings) {
        var vertexFillColor = settings.vertexFillColor;
        if (!vertexFillColor)
            vertexFillColor = GraphSvg.defaultVertexFillColor;
        var vertexStrokeColor = settings.vertexStrokeColor;
        if (!vertexStrokeColor)
            vertexStrokeColor = GraphSvg.defaultVertexStrokeColor;
        svgBuilder.push("<g style=\"", "fill:" + vertexFillColor + ";", "stroke:" + vertexStrokeColor + ";", "stroke-width:" + settings.vertexStrokeWidth + "px;", "\">");
        for (var v = 0; v < graph.vertices.length; v++) {
            svgBuilder.push("<circle ", "cx=\"" + graph.vertices[v].x + "\" ", "cy=\"" + graph.vertices[v].y + "\" ", "r=\"" + settings.vertexRadius + "\" ", ">");
            if (graph.verticesHoverLabel)
                svgBuilder.push("<title>" + graph.verticesHoverLabel[v] + "</title>");
            svgBuilder.push("</circle>");
        }
        svgBuilder.push("</g>");
    };
    GraphSvg._drawEdges = function (svgBuilder, graph, settings) {
        var edgeColor = settings.edgeColor;
        if (!edgeColor)
            edgeColor = GraphSvg.defaultEdgeColor;
        svgBuilder.push("<g style=\"", "stroke:" + edgeColor + ";", "stroke-width:" + settings.edgeWidth + "px;", "\">");
        for (var i = 0; i < graph.edges.length; i++) {
            var e = graph.edges[i];
            var strokeWidth = (graph.edgesWeight && graph.edgesWeight[i] !== 1)
                ? " stroke-width=\"" + settings.edgeWidth * graph.edgesWeight[i] + "px\" "
                : "";
            svgBuilder.push("<line ", "x1=\"" + graph.vertices[e[0]].x + "\" ", "y1=\"" + graph.vertices[e[0]].y + "\" ", "x2=\"" + graph.vertices[e[1]].x + "\" ", "y2=\"" + graph.vertices[e[1]].y + "\" ", strokeWidth, "/>");
        }
        svgBuilder.push("</g>");
    };
    GraphSvg._drawVerticesClipPath = function (elementId, svgBuilder, graph, settings) {
        svgBuilder.push("<defs>");
        for (var v = 0; v < graph.vertices.length; v++) {
            svgBuilder.push("<clipPath id=\"" + elementId + "-v" + v + "\">");
            svgBuilder.push("<circle ", "cx=\"" + graph.vertices[v].x + "\" ", "cy=\"" + graph.vertices[v].y + "\" ", "r=\"" + settings.vertexRadius + "\" ", "></circle>");
            svgBuilder.push("</clipPath>");
        }
        svgBuilder.push("</defs>");
    };
    GraphSvg._drawVerticesImage = function (elementId, svgBuilder, graph, settings) {
        svgBuilder.push("<g>");
        for (var v = 0; v < graph.vertices.length; v++) {
            svgBuilder.push("<image ", "xlink:href=\"" + graph.verticesImagesUrl[v] + "\" ", "clip-path=\"url(#" + elementId + "-v" + v + ")\" ", "x=\"" + (graph.vertices[v].x - settings.vertexRadius) + "\" ", "y=\"" + (graph.vertices[v].y - settings.vertexRadius) + "\" ", "width=\"" + (2 * settings.vertexRadius + 1) + "\" ", "height=\"" + (2 * settings.vertexRadius + 1) + "\" ", ">");
            if (graph.verticesHoverLabel)
                svgBuilder.push("<title>" + graph.verticesHoverLabel[v] + "</title>");
            svgBuilder.push("</image>");
        }
        svgBuilder.push("</g>");
    };
    GraphSvg._drawVerticesLabels = function (svgBuilder, graph, settings) {
        var textColor = settings.labelColor;
        if (!textColor)
            textColor = GraphSvg.defaultLabelColor;
        svgBuilder.push("<g style=\"text-anchor: middle; fill: " + textColor + "\">");
        for (var v = 0; v < graph.vertices.length; v++) {
            svgBuilder.push("<text ", "x=\"" + graph.vertices[v].x + "\" ", "y=\"" + graph.vertices[v].y + "\" ", "style=\"dominant-baseline: central;\"", ">");
            svgBuilder.push(graph.verticesLabel[v]);
            if (graph.verticesHoverLabel)
                svgBuilder.push("<title>" + graph.verticesHoverLabel[v] + "</title>");
            svgBuilder.push("</text>");
        }
        svgBuilder.push("</g>");
    };
    GraphSvg.defaultEdgeColor = "black";
    GraphSvg.defaultVertexFillColor = "black";
    GraphSvg.defaultVertexStrokeColor = "black";
    GraphSvg.defaultLabelColor = "white";
    return GraphSvg;
}());
exports.GraphSvg = GraphSvg;
//# sourceMappingURL=GraphSvg.js.map
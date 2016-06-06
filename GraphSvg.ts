export module GraphSvg {
	export interface IPoint {
		x: number;
		y: number;
	}

	export interface IGraph {
		vertices: IPoint [];
		edges: number[][];

		verticesImagesUrl: string[]; // optional
		verticesLabel: string[]; // optional
		verticesHoverLabel: string[]; // optional
		edgesWeight: number[]; // optional
	}

	export interface ISettings {
		width: number;
		height: number;
		vertexStrokeWidth: number;
		vertexRadius: number;
		edgeWidth: number;
		svgViewBox: number[]; // optional
		edgeColor: string; // optional
		vertexFillColor: string; // optional
		vertexStrokeColor: string; // optional
		labelColor: string; // optional
	}
}


export class GraphSvg {
	static defaultEdgeColor = `black`;
	static defaultVertexFillColor = `black`;
	static defaultVertexStrokeColor = `black`;
	static defaultLabelColor = `white`;

	static toSvg(elementId: string, graph: GraphSvg.IGraph, settings: GraphSvg.ISettings): string {
		const svgBuilder: string[] = [];

		svgBuilder.push(`<svg `,
			`id="${elementId}" `,
			`width="${settings.width}" `,
			`height="${settings.height}" `,
			`version="1.1" `,
			`xmlns="http://www.w3.org/2000/svg" `,
			`xmlns:xlink="http://www.w3.org/1999/xlink" `,
			(settings.svgViewBox) ? `viewBox="${settings.svgViewBox}" ` : ``,
			`>`);

		if (graph.verticesImagesUrl)
			GraphSvg._drawVerticesClipPath(elementId, svgBuilder, graph, settings);

		svgBuilder.push(`<g>`);

		GraphSvg._drawEdges(svgBuilder, graph, settings);
		GraphSvg._drawVertices(svgBuilder, graph, settings);

		svgBuilder.push(`</g>`);

		if (graph.verticesImagesUrl)
			GraphSvg._drawVerticesImage(elementId, svgBuilder, graph, settings);
		else if (graph.verticesLabel)
			GraphSvg._drawVerticesLabels(svgBuilder, graph, settings);

		svgBuilder.push(`</svg>`);

		return svgBuilder.join(``);
	}

	private static _drawVertices(svgBuilder: string[], graph: GraphSvg.IGraph, settings: GraphSvg.ISettings): void {
		var vertexFillColor = settings.vertexFillColor;
		if (!vertexFillColor)
			vertexFillColor = GraphSvg.defaultVertexFillColor;
		var vertexStrokeColor = settings.vertexStrokeColor;
		if (!vertexStrokeColor)
			vertexStrokeColor = GraphSvg.defaultVertexStrokeColor;
		svgBuilder.push(`<g style="`,
			`fill:${vertexFillColor};`,
			`stroke:${vertexStrokeColor};`,
			`stroke-width:${settings.vertexStrokeWidth}px;`,
			`">`);
		for (var v = 0; v < graph.vertices.length; v++) {
			svgBuilder.push(`<circle `,
				`cx="${graph.vertices[v].x}" `,
				`cy="${graph.vertices[v].y}" `,
				`r="${settings.vertexRadius}" `,
				`>`);
			if (graph.verticesHoverLabel)
				svgBuilder.push(`<title>${graph.verticesHoverLabel[v]}</title>`);
			svgBuilder.push("</circle>");
		}
		svgBuilder.push("</g>");
	}

	private static _drawEdges(svgBuilder: string[], graph: GraphSvg.IGraph, settings: GraphSvg.ISettings): void {
		var edgeColor: string = settings.edgeColor;
		if (!edgeColor)
			edgeColor = GraphSvg.defaultEdgeColor;
		svgBuilder.push(`<g style="`,
			`stroke:${edgeColor};`,
			`stroke-width:${settings.edgeWidth}px;`,
			`">`);
		for (var i = 0; i < graph.edges.length; i++) {
			var e = graph.edges[i];
			var strokeWidth = (graph.edgesWeight && graph.edgesWeight[i] !== 1)
				? ` stroke-width="${settings.edgeWidth * graph.edgesWeight[i]}px" `
				: ``;
			svgBuilder.push(`<line `,
				`x1="${graph.vertices[e[0]].x}" `,
				`y1="${graph.vertices[e[0]].y}" `,
				`x2="${graph.vertices[e[1]].x}" `,
				`y2="${graph.vertices[e[1]].y}" `,
				strokeWidth,
				`/>`);
		}
		svgBuilder.push(`</g>`);
	}

	private static _drawVerticesClipPath(elementId: string, svgBuilder: string[], graph: GraphSvg.IGraph, settings: GraphSvg.ISettings): void {
		svgBuilder.push(`<defs>`);
		for (var v = 0; v < graph.vertices.length; v++) {
			svgBuilder.push(`<clipPath id="${elementId}-v${v}">`);
			svgBuilder.push(`<circle `,
				`cx="${graph.vertices[v].x}" `,
				`cy="${graph.vertices[v].y}" `,
				`r="${settings.vertexRadius}" `,
				`></circle>`);
			svgBuilder.push(`</clipPath>`);
		}
		svgBuilder.push(`</defs>`);
	}

	private static _drawVerticesImage(elementId: string, svgBuilder: string[], graph: GraphSvg.IGraph, settings: GraphSvg.ISettings): void {
		svgBuilder.push(`<g>`);
		for (var v = 0; v < graph.vertices.length; v++) {
			svgBuilder.push(`<image `,
				`xlink:href="${graph.verticesImagesUrl[v]}" `,
				`clip-path="url(#${elementId}-v${v})" `,
				`x="${graph.vertices[v].x - settings.vertexRadius}" `,
				`y="${graph.vertices[v].y - settings.vertexRadius}" `,
				`width="${2 * settings.vertexRadius + 1}" `,
				`height="${2 * settings.vertexRadius + 1}" `,
				`>`);
			if (graph.verticesHoverLabel)
				svgBuilder.push(`<title>${graph.verticesHoverLabel[v]}</title>`);
			svgBuilder.push(`</image>`);
		}
		svgBuilder.push(`</g>`);
	}

	private static _drawVerticesLabels(svgBuilder: string[], graph: GraphSvg.IGraph, settings: GraphSvg.ISettings): void {
		var textColor = settings.labelColor;
		if (!textColor)
			textColor = GraphSvg.defaultLabelColor;
		svgBuilder.push(`<g style="text-anchor: middle; fill: ${textColor}">`);
		for (var v = 0; v < graph.vertices.length; v++) {
			svgBuilder.push(`<text `,
				`x="${graph.vertices[v].x}" `,
				`y="${graph.vertices[v].y}" `,
				`style="dominant-baseline: central;"`,
				`>`);
			svgBuilder.push(graph.verticesLabel[v]);
			if (graph.verticesHoverLabel)
				svgBuilder.push(`<title>${graph.verticesHoverLabel[v]}</title>`);
			svgBuilder.push(`</text>`);
		}
		svgBuilder.push(`</g>`);
	}
}

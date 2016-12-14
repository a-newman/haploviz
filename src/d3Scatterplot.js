import * as d3 from "d3";

var SELECTORS = {
	PLOT: 'd3-plot', 
	POINT_CONTAINER: 'd3-point-container',
	POINT: 'd3-point'
};

class D3Scatterplot {

	constructor(DOMelt, dataOptions, width, height) {
		//dataOptions: data, xMax, yMax, xConvert, yConvert, xTicks
		this.DOMelt = DOMelt;
		this.dataOptions = dataOptions
		this.width = width;
		this.height =  height;
		this.margins = {
			L: 30,
			R: 10,
			T: 10,
			B: 20
		}
	}

	create() {
		//Construct the chart given the data passed in earlier

		//Create an svg canvas, with specified width and height
		var svg = d3.select(this.DOMelt).append('svg')
			.attr('class', SELECTORS.PLOT)
			.attr('width', this.width + this.margins.L + this.margins.R)
			.attr('height', this.height + this.margins.T + this.margins.B)

		//create a group of svg elts that will represent the points on the graph
		svg.append('g')
			.attr('class', SELECTORS.POINT_CONTAINER)

		this.svg = svg;
		this.update(this.dataOptions);
	}

	update(dataOptions) {
		console.log('data', dataOptions.data);
		this.dataOptions = dataOptions;
		this._drawPoints(dataOptions)
	}

	_drawPoints(dataOptions) {
		if (!dataOptions) {
			return;
		}
		var scales = this._generateScales(dataOptions);
		var xConvert = dataOptions.xConvert;
		var yConvert = dataOptions.yConvert;

		var xMap = function(data) {
			return scales.xScale(xConvert(data))
		}

		var yMap = function(data) {
			return scales.yScale(yConvert(data))
		}

		this._drawAxes(scales.xScale, scales.yScale, dataOptions);

		var g = d3.select(this.DOMelt).selectAll('.' + SELECTORS.POINT_CONTAINER);

		g.selectAll('.' + SELECTORS.POINT)
			.data(dataOptions.data) //pairs up DOM elts to data
		.enter().append('circle') //creates new elts if not node already
			.attr('class', elt => SELECTORS.POINT + ' ' + elt.chr + ' ' + elt.position)
			.attr("r", 3.5)
			.attr("cx", elt => xMap(elt) + this.margins.L)
			.attr("cy", elt => yMap(elt) + this.margins.T)
			.style("fill", elt => scales.colorScale(elt))
	}

	_drawAxes(xScale, yScale, dataOptions) {

		var xVerticalOffset = this.height + this.margins.T;
		var xAxis = this.svg.append('g')
			.attr('transform', 'translate(' + this.margins.L + ',' + xVerticalOffset + ')')
			.attr('class', 'axis')
			.call(d3.axisBottom(xScale)
				.tickValues(dataOptions.xTicks)
				.tickFormat(dataOptions.xLabels)
			)

		var yAxis = this.svg.append('g')
			.attr('transform', 'translate(' + this.margins.L + ', ' + this.margins.T + ')')
			.attr('class', 'axis')
			.call(d3.axisLeft(yScale)
				.tickSizeOuter([0])
		)
	}

	_generateScales(dataOptions) {
		var xMax = dataOptions.xMax;
		var yMax = dataOptions.yMax; 
		var xConvert = dataOptions.xConvert;
		var yConvert = dataOptions.yConvert; 

		var verticalBuffer = yMax/100;

		var xScale = d3.scaleLinear()
			.range([0, this.width])
			.domain([0, xMax])

		var yScale = d3.scaleLinear()
			.range([this.height, 0])
			.domain([-verticalBuffer, yMax + verticalBuffer])

		var colorRange = d3.scaleLinear()
			.range([0, 1])
			.domain([1, 23])

		var colorScale = function(x) {
			return d3.interpolateRainbow(colorRange(x.chr))
		}

		var scales = {
			xScale: xScale, 
			yScale: yScale,
			colorScale: colorScale
		}

		return scales;
	}
}

export default D3Scatterplot;
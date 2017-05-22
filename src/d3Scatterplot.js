import * as d3 from "d3";

const SELECTORS = {
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
			L: 50,
			R: 10,
			T: 10,
			B: 30
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
		console.log('data in the scatterplot', dataOptions.data);
		this.dataOptions = dataOptions;
		this._setScales();
		this._drawPoints(dataOptions);
		this._drawAxes(this.xScale, this.yScale, dataOptions);
	}

	_setScales() {
		//var verticalBuffer = yMax/100;

		this.xScale = d3.scaleLinear()
			.range([0, this.width])
			.domain(this._getXRange());

		this.yScale = d3.scaleLinear()
			.range([this.height, 0])
			.domain(this._getYRange());
	}

	_drawPoints(dataOptions) {
		if (!dataOptions) {
			return;
		}
		var scales = this._generateScales(dataOptions);
		var xConvert = dataOptions.xConvert;
		var yConvert = dataOptions.yConvert;

		var xMap = (snp) => this.xScale(this.dataOptions.xConvert(snp));

		var yMap = (snp) => this.yScale(this.dataOptions.yConvert(snp));

		//this._drawAxes(scales.xScale, scales.yScale, dataOptions);

		var g = d3.select(this.DOMelt).selectAll('.' + SELECTORS.POINT_CONTAINER);

		g.selectAll('.' + SELECTORS.POINT)
			.data(dataOptions.data) //pairs up DOM elts to data
		.enter().append('circle') //creates new elts if not node already
			.attr('class', elt => SELECTORS.POINT + ' ' + elt.rsid)
			.attr("r", 3.5)
			.attr("cx", elt => xMap(elt) + this.margins.L)
			.attr("cy", elt => yMap(elt) + this.margins.T)
			.style("fill", "red");
			//.style("fill", elt => scales.colorScale(elt))
	}

	_drawAxes(xScale, yScale, dataOptions) {

		var xVerticalOffset = this.height + this.margins.T;
		var xAxis = this.svg.append('g')
			.attr('transform', 'translate(' + this.margins.L + ',' + xVerticalOffset + ')')
			.attr('class', 'axis')
			.call(d3.axisBottom(xScale)
				.ticks(this.width/70)
			)

		//x-axis label
		this.svg.append('text')
			.attr('class', 'label')
			.attr('x', this.width/2 + this.margins.L)
			.attr('y', this.height + this.margins.T + this.margins.B)
			.style('text-anchor', 'middle')
			.style('font-color', 'black')
			.text(dataOptions.xLabel);

		var yAxis = this.svg.append('g')
			.attr('transform', 'translate(' + this.margins.L + ', ' + this.margins.T + ')')
			.attr('class', 'axis')
			.call(d3.axisLeft(yScale)
				.tickSizeOuter([0])
			)

		//y-axis label
		this.svg.append('text')
			.attr('class', 'label')
			.attr('x', -this.margins.T - this.height/2)
			.attr('y', this.margins.L/7)
			.attr('transform', 'rotate(-90)')
			.style('text-anchor', 'middle')
			.style('font-color', 'black')
			.text(dataOptions.yLabel);
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

	_getRange(conversionFunction) {
		var data = this.dataOptions.data;
		var max = null;
		var min = null; 

		for (var i in data) {
			var item = data[i]; 
			var value = conversionFunction(item);
			if (min == null || value < min) {
				min = value;
			}

			if (max == null || value > max) {
				max = value;
			}
		}

		return [min, max];
	}

	/**
	 * Gets the min and max x value, using dataOptions.xConvert
	 * Returns an array [min, max]
	*/
	_getXRange() {
		return this._getRange(this.dataOptions.xConvert);
	}

	_getYRange() {
		return this._getRange(this.dataOptions.yConvert);
	}
}

export default D3Scatterplot;
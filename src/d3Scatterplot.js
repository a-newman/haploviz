import * as d3 from "d3";

var SELECTORS = {
	PLOT: 'd3-plot', 
	POINT_CONTAINER: 'd3-point-container',
	POINT: 'd3-point'
};

class D3Scatterplot {

	constructor(DOMelt, dataOptions, width, height) {
		//dataOptions: data, xMax, yMax, xConvert, yConvert
		this.DOMelt = DOMelt;
		this.dataOptions = dataOptions
		this.width = width;
		this.height =  height;
	}

	create() {
		//Construct the chart given the data passed in earlier

		//Create an svg canvas, with specified width and height
		var svg = d3.select(this.DOMelt).append('svg')
			.attr('class', SELECTORS.PLOT)
			.attr('width', this.width)
			.attr('height', this.height)

		//create a group of svg elts that will represent the points on the graph
		svg.append('g')
			.attr('class', SELECTORS.POINT_CONTAINER)

		this.update(this.dataOptions);
	}

	update(dataOptions) {
		this.dataOptions = dataOptions;
		this._drawPoints(dataOptions)
	}

	_drawPoints(dataOptions) {
		if (!dataOptions) {
			console.log('returning');
			return;
		}
		var scales = this._generateScales(dataOptions);
		var xMap = scales[0];
		var yMap = scales[1];

		var g = d3.select(this.DOMelt).selectAll('.' + SELECTORS.POINT_CONTAINER);

		g.selectAll('.' + SELECTORS.POINT)
			.data(dataOptions.data) //pairs up DOM elts to data
		.enter().append('circle') //creates new elts if not node already
			.attr('class', SELECTORS.POINT)
			.attr("r", 3.5)
			.attr("cx", xMap)
			.attr("cy", yMap)
			.style("fill", d =>'red')
	}

	_generateScales(dataOptions) {
		var xMax = dataOptions.xMax;
		var yMax = dataOptions.yMax; 
		var xConvert = dataOptions.xConvert;
		var yConvert = dataOptions.yConvert; 

		var xScale = d3.scaleLinear()
			.range([0, this.width])
			.domain([0, xMax])

		var xMap = function(data) {
			return xScale(xConvert(data))
		}

		var yScale = d3.scaleLinear()
			.range([this.height, 0])
			.domain([0, yMax])

		var yMap = function(data) {
			return yScale(yConvert(data))
		}

		return [xMap, yMap];

	}
}

export default D3Scatterplot;
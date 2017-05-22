import * as d3 from "d3";

const SELECTORS = {
	CHART: 'd3-chart',
	BAR_CONTAINER: 'd3-char-bar-container', 
	BAR: 'd3-chart-bar'
};

const BAR_HEIGHT = 30;

const BAR_WIDTH_FACTOR = 1000;

class D3BarChart {

	constructor(DOMelt, width, height) {
		this.DOMelt = DOMelt;
		this.margins = {
			L: 100,
			R: 10,
			T: 10,
			B: 30
		},
		this.width = width - this.margins.L - this.margins.R;
		this.height = height - this.margins.T - this.margins.B;
	}

	create() {
		//Create an svg canvas, with specified width and height
		var svg = d3.select(this.DOMelt).append('svg')
			.attr('class', SELECTORS.CHART)
			.attr('width', this.width + this.margins.L + this.margins.R)
			.attr('height', this.height + this.margins.T + this.margins.B);

		var bars = svg.append('g')
			.attr('class', SELECTORS.BAR_CONTAINER)
			.attr("transform", "translate(" + this.margins.L + "," + this.margins.T + ")");

		var xScale = d3.scaleLinear()
			.domain([0, 1])
			.range([0, BAR_WIDTH_FACTOR]);
		var xAxis = d3.axisBottom(xScale);

		bars.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + this.height + ")")
			.call(xAxis);

		this.svg = svg;
	}

	update(topWeights) {
		if (!topWeights) {
			return;
		}

		var g = d3.select(this.DOMelt).selectAll('.' + SELECTORS.BAR_CONTAINER);

		var bar = g.selectAll('.' + SELECTORS.BAR)
				.data(topWeights) //ADD DATA
			.enter().append("g")
				.attr("transform", function(d, i) { return "translate(0," + i * BAR_HEIGHT + ")"; }) //position the bars correctly 

			bar.append("rect")
				.classed(SELECTORS.BAR, true) //adds the class name 
				//.attr("transform", function(d, i) { return "translate(0," + i * BAR_HEIGHT + ")"; }) //position the bars correctly 
				.attr("height", BAR_HEIGHT + "px") //set the height of each bar 
				.attr("width", function(d) {return d.w*BAR_WIDTH_FACTOR + "px";}) //set the width of each bar as a function of their weight 
				.style("fill", "red");

			bar.append("text")
				.attr("transform", function(d, i) {return "translate(0," + BAR_HEIGHT/2 + ")"; })
				.text(function(d) {return d.name});
	}
}

export default D3BarChart;
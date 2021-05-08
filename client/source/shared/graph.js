import * as d3 from "d3";

import { top_speed } from './constants';

export class SpeedGraph {
    constructor(cssIdSelector, speeds) {
    	this.graphId = cssIdSelector;
    	this.topSpeed = top_speed;
    	this.speeds = speeds;

		// define dimensions of graph
		this.margin = ({top: 20, right: 30, bottom: 30, left: 40});
		this.height = 400;
		this.width = 1000;

		this.minimumExpectedReadings = 100;
		this.minimumSpeed = 800;

		this._initGraph();
		this._redrawGraph();
    }

    setTopSpeed (topSpeed) {
    	this.topSpeed = topSpeed;
    	this._redrawGraph();
    }

    _getXDomain () {
    	return [0, d3.max([this.speeds.length, this.minimumExpectedReadings])];
    }

    _getYDomain() {
    	const context = this;
		return [0, d3.max([this.minimumSpeed, ...this.speeds.filter(d => d < context.topSpeed)])];
    }

    _initGraph () {
    	/* implementation heavily influenced by http://bl.ocks.org/1166403 */ 
		/* look into 3883195 and 3808218 */

		const context = this;

		this.x = d3.scaleLinear().domain(this._getXDomain()).range([this.margin.left, this.width - this.margin.right]);
		this.y = d3.scaleLinear().domain(this._getYDomain()).range([this.height - this.margin.bottom, this.margin.top]);

		// create a line function that can convert data[] into x and y points
		this.line = d3.line()
				.defined(d => d < this.topSpeed)
				// assign the X function to plot our line as we wish
				.x(function(d,i){
					// return the X coordinate where we want to plot this datapoint
					return context.x(i+1);
				})
				.y(function (d) {
					// return the Y coordinate where we want to plot this datapoint
					return context.y(d);
				});


		this.xAxis = function (g) {
			return g
	    	.attr("transform", `translate(0,${context.height - context.margin.bottom})`)
	    	.call(d3.axisBottom(context.x).ticks(context.width / 80).tickSizeOuter(0));
	    };

		this.yAxis = function (g) {
			return g
		    .attr("transform", `translate(${context.margin.left},0)`)
		    .call(d3.axisLeft(context.y))
		    .call(g => g.select(".domain").remove())
		    .call(g => g.select(".tick:last-of-type text").clone()
		        .attr("x", 3)
		        .attr("text-anchor", "start")
		        .attr("font-weight", "bold")
		        .text("RPMs"));
		};

		// Add an SVG element with the desired dimensions and margin.
		this.graph = d3.select(this.graphId).append("svg")
			.attr("class", "chart")
			.attr("width", this.width + this.margin.left + this.margin.right)
			.attr("height", this.height + this.margin.top + this.margin.bottom);
				
		// Add the x-axis
		this.graph.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0, 0)")
			.call(this.xAxis);

		// Add the y-axis to the left
		this.graph.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(0, 0)")
			.call(this.yAxis)
			.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", "0.71em")
				.style("text-anchor", "end")
				.text("Number Of Messages");

		// Add the line by appending an svg:path element with the data line we created above
		// do this AFTER the axes above so that the line is above the tick-lines
		this.graph.append("svg:path")
				.attr("fill", "none")
				.attr("stroke", "steelblue")
				.attr("stroke-width", "1.5")
				.attr("stroke-opacity", "1");
				//.attr("d", this.line(this.speeds));
    }

    update ( speeds ) {
    	this.speeds = speeds;
    	this._redrawGraph();
    }

    _redrawGraph () {
    	// update the domain of the graph
 		// X scale will fit all values from data[] within pixes 0-w
		this.x.domain(this._getXDomain()).range([this.margin.left, this.width - this.margin.right]);
		this.y.domain(this._getYDomain()).range([this.height - this.margin.bottom, this.margin.top]);

		// update axis labels
		this.graph.selectAll("g.y.axis").call(this.yAxis);
		this.graph.selectAll("g.x.axis").call(this.xAxis);

		// re-draw data
		this.graph.selectAll("path").attr("d", this.line(this.speeds));
    }
}
import * as d3 from "d3";

export const graphSpeeds = function (speeds, top_speed) {
	/* implementation heavily influenced by http://bl.ocks.org/1166403 */ 
	/* look into 3883195 and 3808218 */

	// define dimensions of graph
	const margin = ({top: 20, right: 30, bottom: 30, left: 40});
	const height = 400;
	const width = 1000;

	// X scale will fit all values from data[] within pixes 0-w
	const x = d3.scaleLinear().domain([0, speeds.length]).range([margin.left, width - margin.right]);
	const y = d3.scaleLinear().domain([0, d3.max(speeds.filter(d => d < top_speed))]).range([height - margin.bottom, margin.top]);

	// create a line function that can convert data[] into x and y points
	const line = d3.line()
			.defined(d => d < top_speed)
			// assign the X function to plot our line as we wish
			.x(function(d,i){
				// return the X coordinate where we want to plot this datapoint
				return x(i+1);
			})
			.y(function (d) {
				// return the Y coordinate where we want to plot this datapoint
				return y(d);
			});

	const xAxis = function (g) {
		return g
    	.attr("transform", `translate(0,${height - margin.bottom})`)
    	.call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));
    };

	const yAxis = function (g) {
		return g
	    .attr("transform", `translate(${margin.left},0)`)
	    .call(d3.axisLeft(y))
	    .call(g => g.select(".domain").remove())
	    .call(g => g.select(".tick:last-of-type text").clone()
	        .attr("x", 3)
	        .attr("text-anchor", "start")
	        .attr("font-weight", "bold")
	        .text("RPMs"));
	};

	// Add an SVG element with the desired dimensions and margin.
	const graph = d3.select("#graph").append("svg")
		.attr("class", "chart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom);
			
	// Add the x-axis
	graph.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0, 0)")
		.call(xAxis);

	// Add the y-axis to the left
	graph.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(0, 0)")
		.call(yAxis)
		.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", "0.71em")
			.style("text-anchor", "end")
			.text("Number Of Messages");

	// Add the line by appending an svg:path element with the data line we created above
	// do this AFTER the axes above so that the line is above the tick-lines
	graph.append("svg:path")
			.attr("fill", "none")
			.attr("stroke", "steelblue")
			.attr("stroke-width", "1.5")
			.attr("stroke-opacity", "1")
			.attr("d", line(speeds));
};
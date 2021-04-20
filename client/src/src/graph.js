import { detectPeaks } from './peak-detection';
import axios from 'axios';
import * as d3 from "d3";

export const top_speed = 2000;

Number.prototype.pad = function (size) {
	let s = String(this);
	while ( s.length < ( size || 2)) { s = "0" + s;}
	return s;
}

export function count_sprints(speeds) {
	// I know that the reporter is using a different threshold for
	// determining sprint boundry. Tests suggested this had be the 
	// case, and I hope to come up with a better determinate someday.
    let sprint_count = 0;
    const gap = 1;

    for (let i = 0; i < speeds.length - gap; i+=gap ) {
        if (speeds[i] > 400 && speeds[i+gap] < 400) {
            sprint_count += 1;
        }
    }

    return sprint_count;
}

export const generate_report = (speeds, start_time, stop_time) => {		
	const sprint_differential = 200;

	const length_of_workout = speeds.length;

	const sprintings = speeds.filter(d => d > sprint_differential).filter(d => d < top_speed);
	const average_speed_during_sprint = sprintings.reduce((acc, itm) => acc + itm, 0) / sprintings.length;
	const highest_speed = Math.max(...speeds.filter(d => d < top_speed));

	const last_sprint_timecount = speeds.reduce((acc, itm) => { return [itm > sprint_differential ? acc[1] : acc[0], acc[1] + 1];}, [0, 0])[0];
	const cooldown_time = (speeds.length - last_sprint_timecount);

	const bad_readings = speeds.filter(d => d >= top_speed).length;

	const sprint_count = count_sprints(speeds);
	const avg_sprint_length = sprintings.length / sprint_count;

	// Sensor readings are taken about once a second, so readings and seconds are used interchangably.
	return {date: +new Date(), // The now of when the report was generated, allowing for data re-retrieval
			startTime: start_time,
			stopTime: stop_time,
			lengthOfWorkout: length_of_workout, // in readings 
			averageSpeedDuringSprint: average_speed_during_sprint,  // in RPMs
			cooldownTime: cooldown_time, // in readings
			faultyReadingCount: bad_readings, // in readings above the plausability threshold
			sprintCount: sprint_count, // self explanitory
			avgSprintLength: avg_sprint_length,  // in readings
			topSpeed: highest_speed}; // in RPMs
};

export async function updateRemarks(id, comment) {
  try {
  	await axios.patch("./report", {id:id, remarks:comment});
  } catch (error) {
    console.error(error);
  }
};

export const months = {0: "January",1:"February",2:"March",3:"April",4:"May",5:"June",6:"July",7:"August",8:"September",9:"October",10:"November",11:"December"};
export const days = {0:"Sunday", 1:"Monday",2:"Tuesday",3:"Wednesday",4:"Thursday",5:"Friday",6:"Saturday"};
export const days_abreviated = {0:"Sun",1:"Mon",2:"Tue",3:"Wed",4:"Thu",5:"Fri",6:"Sat"};

export const load_summary = (report, peaks_element) => {
	const startTime = new Date(parseInt(report.startTime)*1000);
	const stopTime = new Date(parseInt(report.stopTime)*1000);
	const date = new Date(parseInt(report.date));

	const display_string = `${months[startTime.getMonth()]} ${startTime.getDate()}, ${startTime.getFullYear()}`;
	
	const summary_pane = document.getElementById("summary");
	summary_pane.innerHTML = `<div class="summary-grid">
								<div class="summary-grid-item">ID</div>
								<div class="summary-grid-item">${report.id}</div>
								<div class="summary-grid-item">Top Speed</div>
								<div class="summary-grid-item">${report.topSpeed}</div>
								<div class="summary-grid-item">Avg. Sprint Speed</div>
								<div class="summary-grid-item">${Math.round(report.averageSpeedDuringSprint * 100)/100}</div>
								<div class="summary-grid-item">Avg. Sprint Length</div>
								<div class="summary-grid-item">${Math.round(report.avgSprintLength * 100)/100}</div>
								<div class="summary-grid-item">Cool Down</div>
								<div class="summary-grid-item">${Math.floor(report.cooldownTime/60)}:${(report.cooldownTime%60).pad(2)} (${report.cooldownTime})</div>
								<div class="summary-grid-item">Date</div>
								<div class="summary-grid-item">${display_string}</div>
								<div class="summary-grid-item">Faulty Reading Count</div>
								<div class="summary-grid-item">${report.faultyReadingCount}</div>
								<div class="summary-grid-item">Workout Length</div>
								<div class="summary-grid-item">${Math.floor(report.lengthOfWorkout/60)}:${(report.lengthOfWorkout%60).pad(2)} (${report.lengthOfWorkout})</div>
								<div class="summary-grid-item">Sprint Count</div>
								<div class="summary-grid-item">${report.sprintCount}</div>
								<div class="summary-grid-item">Start Time</div>
								<div class="summary-grid-item">${startTime.toLocaleTimeString()}</div>
								<div class="summary-grid-item">Stop Time</div>
								<div class="summary-grid-item">${stopTime.toLocaleTimeString()}</div>
							 </div>`;

	summary_pane.append(peaks_element);

	const textEl = document.createElement("textarea");
	textEl.className = "comment-textarea";

	textEl.addEventListener("blur", function (event) {
		updateRemarks(report.id, textEl.value);
	});

	if (report.remarks) {
		textEl.value = report.remarks;
	}

	summary_pane.append(textEl);
};

export const load_peak = peaks => {
	// DOMSubtreeModified
	const peak_pane = document.createElement("div");
	peak_pane.className = "peak-info-div peaks-grid";

	const peak_idx_header_element = document.createElement("div");
	peak_idx_header_element.className = "peaks-grid-item peaks-grid-index peaks-grid-header";
	peak_idx_header_element.innerText = "Index";
	peak_pane.append(peak_idx_header_element);

	const peak_speed_header_element = document.createElement("div");
	peak_speed_header_element.className = "peaks-grid-item peaks-grid-speed peaks-grid-header";
	peak_speed_header_element.innerText = "Speed";
	peak_pane.append(peak_speed_header_element);

	for ( let itm of peaks) {
		const peak_idx_element = document.createElement("div");
		peak_idx_element.className = "peaks-grid-item peaks-grid-index";
		peak_idx_element.innerText = itm.idx;
		peak_pane.append(peak_idx_element);

		const peak_element = document.createElement("div");
		peak_element.className = "peaks-grid-item peaks-grid-speed";
		peak_element.innerText = itm[0];
		peak_pane.append(peak_element);
	}

	return peak_pane;
};

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

export const runOnLoad = function (event) {
	const queryParams = Object.fromEntries([... new URLSearchParams(window.location.search)]);

	const params = {};

	if (Object.keys(queryParams).includes("start") && Object.keys(queryParams).includes("stop")) {
		params.start = queryParams.start;
		params.stop = queryParams.stop;
	} else if (Object.keys(queryParams).includes("base")) {
		const baseTimecode = parseInt(queryParams.base);
		params.start = Math.round(baseTimecode/1000) - (24*60*60);
		params.stop = Math.round(baseTimecode/1000);
	}

	axios.get("http://127.0.0.1:5000/readings", {params:params}).then(function (response) {
		// create a simple data array that we'll plot with a line (this array represents only the Y values, X will just be the index location)
		const speeds = response.data.result.map(item => item[0]);

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

		const peaksIndexes = detectPeaks(response.data.result.filter(d => d[0] < top_speed), d => d[0],
									{ 
									  lookaround: 20,  // the number of neighbors to compare to on each side
									  sensitivity: 0.5, // sensitivity, in terms of standard deviations above the mean
									  coalesce: 5     // coalesce together peaks within this distance of each other
									});

		const peakSet = new Set(peaksIndexes);
		const peaks = response.data.result.map((itm, idx) => ({idx:idx, ...itm})).filter((itm, idx) => peakSet.has(idx));
		const peaks_element = load_peak(peaks);

		// Think about filing a metadata report.
		axios.get("http://127.0.0.1:5000/report").then(function (response) {
			if ("id" in queryParams) {
				const id = parseInt(queryParams["id"]);
				const relevant_report = response.data.reports.filter(itm => itm.id === id)[0];
				load_summary(relevant_report, peaks_element);
			} else {
				const latest_report = response.data.reports.reduce((itm, acc) => itm.startTime > acc.startTime ? itm : acc, {startTime: 0});
				load_summary(latest_report, peaks_element);
			}

			axios.get("http://127.0.0.1:5000/last-timecode").then(function (timecodeResponse) {
				const timecode = timecodeResponse.data.result;

				axios.get("http://127.0.0.1:5000/readings", {params:{start: timecode - (2 * 60 * 60), stop: timecode}}).then(function (readingsResponse) {
					const timecodes = readingsResponse.data.result.map(item => item[1]);

					const start_time = Math.min(...timecodes);
					const stop_time  = Math.max(...timecodes);
					const last_report = response.data.reports[response.data.reports.length-1];
					const report = generate_report(speeds, start_time, stop_time);

					axios.get("/schedules").then(function (schedulesResponse) {
						const default_schedule = schedulesResponse.data.default;

						report.scheduleId = default_schedule.id;
						report.scheduleName = default_schedule.name;

						if (response.data.reports.filter(r => r.startTime == start_time).length === 0) {
							const different_reports = Object.keys(report).filter(k => k !== "date").filter(k => last_report[k] !== report[k]).length > 0;

							if ( different_reports ) {
								axios.post("http://127.0.0.1:5000/report", report).catch(function(problem) {
						        	console.warn(problem);
						      	});
							} else {
								console.log("Chart Created Using Archived Data.");
							}
						} else {
							console.log("Chart Created Using Archived Data. - Overlapping Start Times.");
						}
					}).catch(function(problem) {
    					console.warn(problem);
  					});
				}).catch(function(problem) {
    				console.warn(problem);
  				});
			}).catch(function(problem) {
    			console.warn(problem);
  			});
		}).catch(function(problem) {
    		console.warn(problem);
  		});
  	}).catch(function(problem) {
    	console.warn(problem);
  	});
};
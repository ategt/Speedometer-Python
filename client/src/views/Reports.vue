<template>
	<div id="reports"></div>
</template>

<script>
import axios from 'axios';

import { top_speed, days_abreviated, days, months } from '../src/constants';

export default {
	name: "Reports",
	methods: {
		getReports: async function () {
		  try {
		    const response = await axios.get("http://127.0.0.1:5000/report");
		    const reports = response.data.reports.map(r => Object.assign({}, {remarks:""}, r));

		    return reports;

		  } catch (error) {
		    console.error(error);
		  }
		},
		getReadings: async function (startTime, stopTime) {
		  try {
			const readingsResponse = await axios.get("http://127.0.0.1:5000/readings", {params:{start: startTime, stop: stopTime}});

			return readingsResponse.data.result;

		  } catch (error) {
		    console.error(error);
		  }
		},
		buildReport: async function (startTime, stopTime) {
		  try {
		  	const reports = await getReports();
		  	const readings = await getReadings(startTime, stopTime);

			const timecodes = readings.map(item => item[1]);
			const speeds = readings.map(item => item[0]);

			const start_time = Math.min(...timecodes);
			const stop_time  = Math.max(...timecodes);

			const report = generate_report(speeds, start_time, stop_time);

			if (reports.filter(r => r.startTime == start_time).length === 0) {
				await axios.post("http://127.0.0.1:5000/report", report);
			} else {
				console.log("Report Submission Refused - Start Time Overlaps With Existing Report.");
			}

		  } catch (error) {
		    console.error(error);
		  }
		},
		sortByStartingTime: function (reportA, reportB) {
			return reportA.startTime - reportB.startTime;
		},
		printReports: async function () {
		  try {
		    const response = await axios.get("http://127.0.0.1:5000/report");
		    const reports = response.data.reports.map(r => Object.assign({}, {remarks:""}, r)).sort(sortByStartingTime);

		    const reportEl = document.getElementById("reports");

		    for (let report of reports) {
		        const d = new Date(parseInt(report.startTime)*1000);
		        const display_string = `<div class="report-item"><a id="retire-report-${report.id}" class="retire-report" data-report="${report.id}">X</a>&nbsp;<a href="/d3?start=${report.startTime}&stop=${report.stopTime}&id=${report.id}">${report.id}: ${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${d.toLocaleTimeString()}</a><span class="remarks">${report.remarks}</span></div>`;

		        reportEl.innerHTML += display_string;
		    }

		    Array.from(document.getElementsByClassName("retire-report")).forEach(element => element.addEventListener("click", function(event) {
	    		retireReport(event.target.dataset.report);
			}));

		  } catch (error) {
		    console.error(error);
		  }
		},	
		updateRemarks: async function (id, comment) {
		  try {
		  	await axios.patch("http://127.0.0.1:5000/report", {id:id, remarks:comment});
		  } catch (error) {
		    console.error(error);
		  }
		},
		retireReport: async function (id) {
		  try {
		  	await axios.delete(`http://127.0.0.1:5000/report/${id}`);
		  } catch (error) {
		    console.error(error);
		  }
		},
		updateTimes: async function (id) {
		  try {
		    const response = await axios.get("http://127.0.0.1:5000/report");
		    const reports = response.data.reports.map(r => Object.assign({}, {remarks:""}, r));

			const report = reports.filter(r => r.id === id)[0];
			const baseTimecode = report.date;

			const params = {};

			params.start = Math.round(baseTimecode/1000) - (24*60*60);
			params.stop = Math.round(baseTimecode/1000) + (2*60*60);

			const readings = (await axios.get("http://127.0.0.1:5000/readings", {params:params})).data.result;

			const speeds = readings.map(item => item[0]);
			const timecodes = readings.map(item => item[1]);
			const start_time = Math.min(...timecodes);
			const stop_time  = Math.max(...timecodes);

		  	axios.patch("http://127.0.0.1:5000/report", {id:id, startTime: start_time, stopTime: stop_time});
		  } catch (error) {
		    console.error(error);
		  }
		},
		runUpdateReports: async function () {
		  try {
		    const response = await axios.get("http://127.0.0.1:5000/report");
		    const reports = response.data.reports.map(r => Object.assign({}, {remarks:""}, r));

		    for (let report of reports) {
		    	if (!Object.keys(report).includes("startTime") || !Object.keys(report).includes("stopTime")) {
		    		console.log("Updating", report.id);
		    		updateTimes(report.id);
		    		console.log("Done.");
		    	}
		    }
		  } catch (error) {
		    console.error(error);
		  }
		},
		count_sprints: function (speeds) {
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
		},
		generate_report: function(speeds, start_time, stop_time) {		
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
		},
	},
	mounted () {
		this.printReports();
	}
}
	// function runTests() {
	// 	const testReports = [{id: 2, date: 1616207821217, startTime: 1612556555, stopTime: 1612831634},
	// 	 					 {id: 3, date: 1616207878565, startTime: 1616175953, stopTime: 1616177165},
	// 	 					 {id: 1, date: 1616207821217, startTime: 1612, stopTime: 1615}];

	// 	const sortResults = testReports.sort(sortByStartingTime).map(r => r.id);
	// 	const sortTestExpectations = [1,2,3];

	// 	if (!sortResults.map((n,i) => sortResults[i] === n).some(v => v === false)) {
	// 		console.log("Sort test passed.");
	// 	} else {
	// 		console.error("Sort test failure", sortResults);
	// 	}
</script>
<style type="text/css">
	/* tell the SVG path to be a thin blue line without an area fill */
	path {
		stroke-linejoin: round;
  		stroke-linecap: round;
	}

	.axis {
		shape-rendering: crispEdges;
	}

	.x.axis line {
		stroke: lightgrey;
	}

	.x.axis .minor {
		stroke-opacity: 0.5;
	}

	.x.axis path {
		display: none;
	}

	.y.axis line, .y.axis path {
		fill: none;
		stroke: orange;
	}

	.report-item {
		padding: 2px;
		font-size: large;
	}

	.report-item a {
		text-decoration: none;
		color: currentcolor;
	}

	.remarks {
		margin: 1rem;
	}

	.retire-report {
		cursor: pointer;
	    border: 1px solid black;
	    padding: 1px;
	    border-radius: 3px;
	}
</style>
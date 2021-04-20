import axios from 'axios';

export const getReports = function () {
	return new Promise(function (resolve, reject) {
		axios.get("http://127.0.0.1:5000/report").then(function (response) {
		    const reports = response.data.reports.map(r => Object.assign({}, {remarks:""}, r));
		    resolve(reports);
		}).catch(function (error) {reject(error)});
	});
};

export const getReadings = async function (startTime, stopTime) {
		  try {
			const readingsResponse = await axios.get("http://127.0.0.1:5000/readings", {params:{start: startTime, stop: stopTime}});

			return readingsResponse.data.result;

		  } catch (error) {
		    console.error(error);
		  }
		};

export const buildReport = async function (startTime, stopTime) {
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
		};

export const sortByStartingTime =  function (reportA, reportB) {
			return reportA.startTime - reportB.startTime;
		};
export const updateRemarks = async function (id, comment) {
		  try {
		  	await axios.patch("http://127.0.0.1:5000/report", {id:id, remarks:comment});
		  } catch (error) {
		    console.error(error);
		  }
		};

export const retireReport = async function (id) {
		  try {
		  	await axios.delete(`http://127.0.0.1:5000/report/${id}`);
		  } catch (error) {
		    console.error(error);
		  }
		};

export const updateTimes = async function (id) {
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
		};

export const runUpdateReports = async function () {
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
		};

export const printReports = function () {
			return new Promise(function (resolve, reject) {
			    axios.get("http://127.0.0.1:5000/report").then(function (response) {
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
			    });
			});
		};
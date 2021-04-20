import axios from 'axios';

export const getReports = function () {
	return new Promise(function (resolve, reject) {
		axios.get("http://127.0.0.1:5000/report").then(function (response) {
		    const reports = response.data.reports.map(r => Object.assign({}, {remarks:""}, r));
		    resolve(reports);
		}).catch(reject);
	});
};

export const getReport = function (reportId) {
	return new Promise(function (resolve, reject) {
		getReports().then(function (reports) {
			const relevant_report = reports.filter(itm => itm.id === reportId)[0];
			resolve(relevant_report);
		}).catch(reject);
	});
};

export const getReadings = function (startTime, stopTime) {
	return new Promise(function (resolve, reject) {
		axios.get("http://127.0.0.1:5000/readings", {params:{start: startTime, stop: stopTime}}).then(function (readingsResponse) {
			resolve(readingsResponse.data.result);
		}).catch(reject);
	});
};

export const buildReport = function (startTime, stopTime) {
	return new Promise(function (resolve, reject) {
		getReports().then(function (reports) {
			getReadings(startTime, stopTime).then(function (readings) {
				const timecodes = readings.map(item => item[1]);
				const speeds = readings.map(item => item[0]);

				const start_time = Math.min(...timecodes);
				const stop_time  = Math.max(...timecodes);

				const report = generate_report(speeds, start_time, stop_time);
				
				if (reports.filter(r => r.startTime == start_time).length === 0) {
					axios.post("http://127.0.0.1:5000/report", report).then(resolve).catch(reject);
				} else {
					console.log("Report Submission Refused - Start Time Overlaps With Existing Report.");
				}
			}).catch(function (error) {reject(error)});
		}).catch(function (error) {reject(error)});
	});
};

export const sortByStartingTime =  function (reportA, reportB) {
			return reportA.startTime - reportB.startTime;
		};
export const updateRemarks = function (id, comment) {
	return new Promise(function (resolve, reject) {
		axios.patch("http://127.0.0.1:5000/report", {id:id, remarks:comment}).then(resolve).catch(reject);
	});
};

export const retireReport = function (id) {
	return new Promise(function (resolve, reject) {
		axios.delete(`http://127.0.0.1:5000/report/${id}`).then(resolve).catch(reject);
	});
};

export const updateTimes = function (id) {
	return new Promise(function (resolve, reject) {
		axios.get("http://127.0.0.1:5000/report").then(function (response) {
		    const reports = response.data.reports.map(r => Object.assign({}, {remarks:""}, r));

			const report = reports.filter(r => r.id === id)[0];
			const baseTimecode = report.date;

			const params = {};

			params.start = Math.round(baseTimecode/1000) - (24*60*60);
			params.stop = Math.round(baseTimecode/1000) + (2*60*60);

			axios.get("http://127.0.0.1:5000/readings", {params:params}).then(function (readingsResponse) {
				const readings = readingsResponse.data.result;

				const speeds = readings.map(item => item[0]);
				const timecodes = readings.map(item => item[1]);
				const start_time = Math.min(...timecodes);
				const stop_time  = Math.max(...timecodes);

				axios.patch("http://127.0.0.1:5000/report", {id:id, startTime: start_time, stopTime: stop_time}).then(resolve).catch(reject);
			}).catch(reject);
		}).catch(reject);
	});
};

export const runUpdateReports = function () {
	return new Promise(function (resolve, reject) {
		axios.get("http://127.0.0.1:5000/report").then(function (response) {
		    const reports = response.data.reports.map(r => Object.assign({}, {remarks:""}, r));

		    for (let report of reports) {
		    	if (!Object.keys(report).includes("startTime") || !Object.keys(report).includes("stopTime")) {
		    		console.log("Updating", report.id);
		    		updateTimes(report.id);
		    		console.log("Done.");
		    	}
		    }
		}).catch(reject);
	});
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
			    }).catch(reject);
			});
		};
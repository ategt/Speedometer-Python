import { createReport, getReports, getReport } from "../api/reports";
import { getReadings } from "../api/readings";

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
					createReport(report).then(resolve).catch(reject);
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

export const rebuiltTimes = function (reportId) {
	return new Promise(function (resolve, reject) {
		getReport(reportId).then(function (report) {
			const baseTimecode = report.date;

			const start = Math.round(baseTimecode/1000) - (24*60*60);
			const stop = Math.round(baseTimecode/1000) + (2*60*60);

			getReadings(start, stop).then(function (readingsResponse) {
				const readings = readingsResponse.data.result;

				const speeds = readings.map(item => item[0]);
				const timecodes = readings.map(item => item[1]);
				const start_time = Math.min(...timecodes);
				const stop_time  = Math.max(...timecodes);

				updateTimes(id, start_time, stop_time).then(resolve);
			}).catch(reject);
		}).catch(reject);
	});
};

export const runUpdateReports = function () {
	return new Promise(function (resolve, reject) {
		getReports().then(function (reports) {
		    for (let report of reports) {
		    	if (!Object.keys(report).includes("startTime") || !Object.keys(report).includes("stopTime")) {
		    		console.log("Updating", report.id);
		    		rebuiltTimes(report.id);
		    		console.log("Done.");
		    	}
		    }
		    resolve();
		}).catch(reject);
	});
};

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

export const prepare_report = (readings, schedule = undefined) => {
	  const parsed_readings = readings.map(reading => Object.assign({}, reading, {timestamp: parseFloat(reading.timestamp)});

	  const sortedHistory = Array.from(parsed_readings).sort(function (a,b) {
        return a.timestamp - b.timestamp;
      });

      const timecodes = sortedHistory.map(item => item.timestamp);
      const speeds = sortedHistory.map(item => item['currentRevsPerMin']);

      const start_time = Math.min(...timecodes);
      const stop_time  = Math.max(...timecodes);
      const report = generate_report(speeds, start_time, stop_time);

      report.scheduleId = schedule.id;
      report.scheduleName = schedule.name;

      return report;
}
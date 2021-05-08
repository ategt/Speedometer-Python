import { convertTimestampToClient, convertTimestampToServer } from '../shared/server_adaption';
import { top_speed } from '../shared/constants';

export const sortByStartingTime =  function (reportA, reportB) {
	return reportA.startTime - reportB.startTime;
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

const extract_timestamp = ( reading ) => {

	if ( reading.timestamp ) {
		return parseFloat(reading.timestamp);
	} else if ( reading.recieved ) {
		return convertTimestampToServer( reading.recieved );
	}
}

export const sort_readings = ( readings ) => {
	const parsed_readings = readings.map(reading => Object.assign({}, reading, {timestamp: extract_timestamp(reading)}));

	const sortedHistory = Array.from(parsed_readings).sort(function (a,b) {
        return a.timestamp - b.timestamp;
    });	

    return sortedHistory;
}

export const prepare_report = (readings, schedule = undefined) => {
	  const sortedHistory = sort_readings(readings);

      const timecodes = sortedHistory.map(item => item.timestamp);
      const speeds = sortedHistory.map(item => item['currentRevsPerMin']);

      const start_time = Math.min(...timecodes);
      const stop_time  = Math.max(...timecodes);
      const report = generate_report(speeds, start_time, stop_time);

      report.scheduleId = schedule.id;
      report.scheduleName = schedule.name;

      return report;
}
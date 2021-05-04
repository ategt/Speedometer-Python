import './decorate-number-pad';

export const defaultSchedule = {name: "Default",
				  default: true,
				  id: 0,
				  items:
				 	 [{id: 1, activity:"Warmup",    interval: 2*60},
	      	          {id: 2, activity:"Sprint!",   interval: 30},
	        	      {id: 3, activity:"Recover",   interval: 3*60},
	            	  {id: 4, activity:"Sprint!",   interval: 30},
		              {id: 5, activity:"Recover",   interval: 3*60},
	              	  {id: 6, activity:"Sprint!",   interval: 30},
	                  {id: 7, activity:"Recover",   interval: 3*60},
	              	  {id: 8, activity:"Sprint!",   interval: 30},
	              	  {id: 9, activity:"Recover",   interval: 3*60},
	              	  {id:10, activity:"Sprint!",   interval: 30},
	              	  {id:11, activity:"Cool Down", interval: 3*60}]
	              };

export const prettyTime = function (seconds) {
	return `${Math.floor(seconds/60)}:${(seconds%60).pad(2)}`;
};

export const loadScheduleFromStorage = function () {
	try{
		return JSON.parse(sessionStorage['schedule']);
	} catch (ex) {
		return defaultSchedule;
	}
};

export const saveScheduleToStorage = function () {
	if (!('schedule' in sessionStorage)) {
		 context.schedule = data.default;
	}
};

export const saveScheduleLocally = function (schedule) {
	sessionStorage['schedule'] = JSON.stringify(schedule);
};

export const newSchedule = function () {
	const schedule = {
		name: "New Schedule",
		default: true,
		items: new Array(),
	};

	const scheduleNameElement = document.getElementById("schedule-name");
	window.setTimeout(() => scheduleNameElement.select(), 100);

	return schedule;
};

export const saveSchedule = function (schedule) {
	saveScheduleLocally(schedule);

	if (Object.keys(schedule).includes("id")) {
		updateSchedule(schedule);
	} else {
		createSchedule(schedule);
	}
};

export const saveAsSchedule = function (schedule) {
	saveScheduleLocally(schedule);
	createSchedule(schedule);
};

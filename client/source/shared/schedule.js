import './decorate-number-pad';

const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: "base"});

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
		return JSON.parse(localStorage['schedule']);
	} catch (ex) {
		return defaultSchedule;
	}
};

export const isScheduleInStorage = function () {
	return ('schedule' in localStorage);
};

export const saveScheduleLocally = function (schedule) {
	localStorage['schedule'] = JSON.stringify(schedule);
};

export const clearLocalSchedule = function () {
	delete localStorage['schedule'];
};

export const newSchedule = function () {
	const schedule = {
		name: "New Schedule",
		default: true,
		items: new Array(),
	};

	return Object.assign({}, schedule);
};

/**
*  Determines if a schedule is on the remote server.
*  Useful for deciding between creating and updating
*    a schedule.
*/
export const isScheduleRemote = function (schedule) {
	return (Object.keys(schedule).includes("id"));
};

export const sortById =  function (scheduleA, scheduleB) {
	return scheduleA.id - scheduleB.id;
};

export const sortByName =  function (scheduleA, scheduleB) {
	return collator.compare(scheduleA.name, scheduleB.name);
};

export const sortByCreated =  function (scheduleA, scheduleB) {
	return collator.compare(scheduleA.created, scheduleB.created);
};

export const sortByUpdated =  function (scheduleA, scheduleB) {
	function getUpdated (schedule) {
		return schedule.updated ? schedule.updated : schedule.created;
	}

	return collator.compare(getUpdated(scheduleA), getUpdated(scheduleB));
};
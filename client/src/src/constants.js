export const months = {0: "January",1:"February",2:"March",3:"April",4:"May",5:"June",6:"July",7:"August",8:"September",9:"October",10:"November",11:"December"};
export const days = {0:"Sunday", 1:"Monday",2:"Tuesday",3:"Wednesday",4:"Thursday",5:"Friday",6:"Saturday"};
export const days_abreviated = {0:"Sun",1:"Mon",2:"Tue",3:"Wed",4:"Thu",5:"Fri",6:"Sat"};
export const months_abreviated = {0: "Jan",1:"Feb",2:"Mar",3:"Apr",4:"May",5:"June",6:"July",7:"Aug",8:"Sept",9:"Oct",10:"Nov",11:"Dec"};

export const top_speed = 2000;

export const ROOT_URL = "http://127.0.0.1:5000";

export const SCHEDULE_LIST_EVENTS = {
	setDefaultSchedule: "set-default-schedule", 
	retireSchedule: "retire-schedule",
	switchActiveSchedule: "switch-active-schedule",
};

export const SCHEDULE_BUTTONS_EVENTS = {
	saveAsSchedule: "save-as-schedule",
	saveSchedule: "save-schedule",
	newSchedule: "new-schedule",
};

export const SCHEDULE_INDEX_EVENTS = {
	...SCHEDULE_LIST_EVENTS, 
	...SCHEDULE_BUTTONS_EVENTS,
};

export const SCHEDULE_EDITOR_EVENTS = {
	updateInterval: "update-editor-interval",
	retireScheduleItem: "retire-schedule-item",
	addScheduleItem: "add-schedule-item",
	scheduleItemsChanged: "schedule-items-changed",
};
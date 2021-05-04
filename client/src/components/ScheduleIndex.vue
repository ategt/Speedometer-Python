<template>
	<div class="right-panel schedule-panel right-schedule-panel">
		<ScheduleButtons v-on="scheduleButtonListeners"></ScheduleButtons>
		<ScheduleList v-bind:schedules="schedules" v-bind:defaultScheduleId="defaultScheduleId" v-on="scheduleListListeners"></ScheduleList>
	</div>
</template>
<script>
import ScheduleButtons from "./ScheduleButtons";
import ScheduleList from "./ScheduleList";
import { SCHEDULE_BUTTONS_EVENTS, SCHEDULE_LIST_EVENTS, SCHEDULE_INDEX_EVENTS } from "../src/constants";

export default {
	name: "ScheduleIndex",
	props: ['schedules', 'defaultScheduleId'],
	components: {
		ScheduleButtons,
		ScheduleList,
	},
	computed: {
	  	scheduleListListeners: function () {
	  		//input: function (event) { // Use this format
	  		const vm = this;
	  		const result = {};

			for (const [methodName, eventTag] of Object.entries(SCHEDULE_LIST_EVENTS)) {
				//result[eventTag] = this[methodName];
				result[eventTag] = function (event) {
					vm.$emit(eventTag, event);
				};
			}

			return result;
	  	},
	  	scheduleButtonListeners: function () {
	  		//input: function (event) { // Use this format
	  		const vm = this;
	  		const result = {};

			for (const [methodName, eventTag] of Object.entries(SCHEDULE_BUTTONS_EVENTS)) {
				result[eventTag] = function (event) {
					vm.$emit(eventTag, event);
				};
			}

			return result;
	  	},
	}
}	
</script>
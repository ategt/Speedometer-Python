<template>
	<div class="right-pane button-panel">
		<div id="save-schedule-button" v-on:click="$emit('saveAsSchedule')" class="timer-button schedule-button">
			DUPLICATE SCHEDULE
		</div>
		<div id="save-schedule-button" v-on:click="$emit('savechedule')" class="timer-button schedule-button">
			UPDATE SCHEDULE
		</div>
		<div id="new-schedule-button" v-on:click="$emit('new-schedule')" class="timer-button schedule-button">
			NEW SCHEDULE
		</div>
	</div>
</template>
<script>
import { SCHEDULE_BUTTONS_EVENTS } from "./scr/constants";
export default {
	name: "ScheduleButtons",
}	
</script>
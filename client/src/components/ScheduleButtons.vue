<template>
	<div class="right-pane button-panel">
		<div id="save-schedule-button" v-on:click="$emit(saveAsSchedule)" class="timer-button schedule-button">
			DUPLICATE SCHEDULE
		</div>
		<div id="save-schedule-button" v-on:click="$emit(saveSchedule)" class="timer-button schedule-button">
			UPDATE SCHEDULE
		</div>
		<div id="new-schedule-button" v-on:click="$emit(newSchedule)" class="timer-button schedule-button">
			NEW SCHEDULE
		</div>
	</div>
</template>
<script>
import { SCHEDULE_BUTTONS_EVENTS } from "../src/constants";
export default {
	name: "ScheduleButtons",
	data () {
		return SCHEDULE_BUTTONS_EVENTS;
	}
}	
</script>
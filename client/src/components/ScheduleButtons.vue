<template>
	<div class="right-pane button-panel">
		<div id="save-schedule-button" v-on:click="saveAsSchedule" class="timer-button schedule-button">
			DUPLICATE SCHEDULE
		</div>
		<div id="save-schedule-button" v-on:click="saveSchedule" class="timer-button schedule-button">
			UPDATE SCHEDULE
		</div>
		<div id="new-schedule-button" v-on:click="newSchedule" class="timer-button schedule-button">
			NEW SCHEDULE
		</div>
	</div>
</template>
<script>
export default {
	name: "ScheduleButtons",
	
}	
</script>
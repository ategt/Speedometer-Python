<template>
	<div class="right-panel schedule-panel right-schedule-panel">
		<ScheduleButtons></ScheduleButtons>
		<ScheduleList></ScheduleList>
	</div>
</template>
<script>
import ScheduleButtons from "./ScheduleButtons";
import ScheduleList from "./ScheduleList";

export default {
	name: "ScheduleIndex",
	props: ['schedules', 'defaultScheduleId'],
	components: {
		ScheduleButtons,
		ScheduleList,
	},
}	
</script>
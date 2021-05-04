<template>
	<div id="schedule-area" class="schedule-area">
		<ScheduleEditor v-bind:schedule="schedule" v-on="editorListeners"></ScheduleEditor>
		<ScheduleIndex v-bind:schedules="otherSchedules" v-bind:defaultScheduleId="defaultScheduleId" v-on="indexListeners"></ScheduleIndex>
	</div>
</template>

<script>
import ScheduleEditor from '../components/ScheduleEditor.vue';
import ScheduleIndex from '../components/ScheduleIndex.vue';
import { SCHEDULE_BUTTONS_EVENTS, SCHEDULE_LIST_EVENTS, SCHEDULE_INDEX_EVENTS } from "./scr/constants";
import { loadScheduleFromStorage, defaultSchedule, saveScheduleLocally, newSchedule, saveSchedule, saveAsSchedule } from './src/schedule';

export default {
	  name: "Schedule",
	  data () {
	  	let schedule;

	  	if ( 'schedule' in sessionStorage ) {
	  		schedule = loadScheduleFromStorage();
	  	} else if ( this.$store.schedules.length > 0 ) {
			schedule = this.$store.schedules[0];
	  	} else {
	  		schedule = defaultSchedule;
	  	}

	  	return { schedule };
	  },
	  components: {
		ScheduleEditor,
		ScheduleIndex,
	  },
	  methods: {
	  	newSchedule: function (event) {
	  		this.schedule = newSchedule();
	  	}, 
	  	saveSchedule: function (event) {
	  		saveSchedule(this.schedule);
	  	}, 
	  	saveAsSchedule: function (event) {
	  		saveAsSchedule(this.schedule);
	  	}, 
	  	loadSchedule: function (event) {
			const schedule_id = event.currentTarget.dataset['id'];
			this.schedule = this.otherSchedules.find(itm => itm.id == schedule_id);
	  	},
	  },
	  computed: {
	  	defaultScheduleId: function () {
	  		return this.$store.getters["schedules/getDefaultScheduleId"];
	  	},
	  	otherSchedules: function () {
	  		return this.$store.getters["schedules/getSchedules"];
	  	},
	  	indexListeners: function () {
	  		//input: function (event) { // Use this format
	  		const result = {};

			for (const [methodName, eventTag] of Object.entries(SCHEDULE_INDEX_EVENTS)) {
				result[eventTag] = this[methodName];
			}

			return result;
	  	},
	  },
	  created () {
	  	this.$store.dispatch("schedules/populateSchedules");
	  },
	  mounted () {},
	};
</script>
<style type="text/css">
</style>
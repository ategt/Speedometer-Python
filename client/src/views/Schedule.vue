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
			schedule = this.$store.getters['schedules/getDefaultSchedule'];
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
			this.schedule = {name: "New Schedule",
				  			default: true,
				  			items: new Array()};
			
			const scheduleNameElement = document.getElementById("schedule-name");
			window.setTimeout(() => scheduleNameElement.select(), 100);
	  	},
	  	saveSchedule: function (event) {
			saveScheduleLocally(this.schedule);

			if (Object.keys(this.schedule).includes("id")) {
				this.updateSchedule(this.schedule);
			} else {
				this.createSchedule(this.schedule);
			}
	  	},
	  	saveAsSchedule: function (event) {
			saveScheduleLocally(this.schedule);
			this.createSchedule(this.schedule);
	  	},
	  	setActiveSchedule: function (event) {
			const schedule_id = parseInt(event.currentTarget.dataset['id']);
			this.$store.commit("schedules/setActiveSchedule", schedule_id);
	  	},
	  	retire: function (event) {
	  		const retire_id = event.currentTarget.dataset['id'];
	  		this.$store.commit("schedules/removeActiveScheduleItem", retire_id);
	  	},
	  	addScheduleItem: function (event) {
	  		this.$store.commit("schedules/addActiveScheduleItem");
	  	},
	  	createSchedule: function (schedule) {
	  		this.$store.dispatch("schedules/createSchedule", schedule);
	  	},
	  	updateSchedule: function (schedule) {
	  		this.$store.dispatch("schedules/updateSchedule", schedule);
	  	},
	  	retireSchedule: function (event) {
	  		const retire_id = event.currentTarget.dataset['id'];
	  		this.$store.dispatch("schedules/retireSchedule", retire_id);
	  	},
	  	updateInterval: function (event) {
	  		const updated_id = event.currentTarget.dataset['id'];
	  		const evaluated_value = eval(event.currentTarget.value);
	  		//event.currentTarget.value = evaluated_value;
	  		this.$store.commit("schedules/updateActiveScheduleItemInterval", {id: updated_id, value: evaluated_value});
	  	},
	  	loadOtherSchedules: function () {
	  		this.$store.dispatch("schedules/populateSchedules");
	  	},
	  	setDefault: function (event) {
			const schedule_id = parseInt(event.currentTarget.dataset['id']);
			this.$store.dispatch("schedules/putDefault", schedule_id);
	  	},

	  },
	  computed: {
	  	schedule: function () {
	  		
	  	},
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
<template>
	<div id="schedule-area" class="schedule-area">
		<ScheduleEditor v-bind:scheduleEdit="schedule" v-on="editorListeners"></ScheduleEditor>
		<ScheduleIndex v-bind:schedules="otherSchedules" v-bind:defaultScheduleId="defaultScheduleId" v-on="indexListeners"></ScheduleIndex>
	</div>
</template>

<script>
import ScheduleEditor from '../components/ScheduleEditor.vue';
import ScheduleIndex from '../components/ScheduleIndex.vue';
import { SCHEDULE_BUTTONS_EVENTS, SCHEDULE_LIST_EVENTS, SCHEDULE_INDEX_EVENTS, SCHEDULE_EDITOR_EVENTS } from "../src/constants";
import { loadScheduleFromStorage, defaultSchedule, saveScheduleLocally, newSchedule, saveSchedule, saveAsSchedule } from '../src/schedule';

export default {
	  name: "Schedule",
	  components: {
		ScheduleEditor,
		ScheduleIndex,
	  },
	  methods: {
	  	newSchedule: function (event) {
	  		this.$store.commit("schedules/newSchedule");

			const scheduleNameElement = document.getElementById("schedule-name");
			window.setTimeout(() => scheduleNameElement.select(), 100);
	  	},
	  	saveSchedule: function (event) {
			this.$store.dispatch("schedules/saveActiveSchedule");
	  	},
	  	saveAsSchedule: function (event) {
			this.$store.dispatch("schedules/createActiveSchedule");
	  	},
	  	switchActiveSchedule: function (event) {
			const schedule_id = parseInt(event.currentTarget.dataset['id']);
			this.$store.commit("schedules/switchActiveSchedule", schedule_id);
	  	},
	  	retireScheduleItem: function (event) {
	  		const retire_id = event.currentTarget.dataset['id'];
	  		this.$store.commit("schedules/removeActiveScheduleItem", retire_id);
	  	},
	  	addScheduleItem: function (event) {
	  		this.$store.commit("schedules/addActiveScheduleItem");
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
	  	setDefaultSchedule: function (event) {
			const schedule_id = parseInt(event.currentTarget.dataset['id']);
			this.$store.dispatch("schedules/putDefault", schedule_id);
	  	},
		scheduleItemsChanged: function (scheduleItems) {
			this.$store.commit("schedules/replaceItems", scheduleItems);
		},
	  },
	  computed: {
	  	schedule: function () {
	  		return this.$store.getters["schedules/getActiveSchedule"];
	  	},
	  	defaultScheduleId: function () {
	  		return this.$store.getters["schedules/getDefaultScheduleId"];
	  	},
	  	otherSchedules: function () {
	  		return this.$store.getters["schedules/getSortedSchedules"];
	  	},
	  	indexListeners: function () {
	  		//input: function (event) { // Use this format
	  		const result = {};

			for (const [methodName, eventTag] of Object.entries(SCHEDULE_INDEX_EVENTS)) {
				result[eventTag] = this[methodName];
			}

			return result;
	  	},
	  	editorListeners: function () {
	  		const result = {};

			for (const [methodName, eventTag] of Object.entries(SCHEDULE_EDITOR_EVENTS)) {
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
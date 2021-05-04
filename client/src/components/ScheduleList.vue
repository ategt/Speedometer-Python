<template>	
<div id="schedule-list" class="schedule-field other-schedules-field" v-if="schedules.length">
	<table class="other-schedule-table">
		<thead>
			<tr>
				<th>ID</th>
				<th class="schedule-name-display-header">Name</th>
				<th>Items</th>
				<th>Status</th>
				<th>Action</th>
			</tr>
		</thead>
		<tr v-for="(item, index) in schedules"
                    v-bind:index="index"
                    v-bind:key="item.id"
                    class="schedule-row">
    		<td class="schedule-id-column" v-bind:data-id="item.id" v-on:click="loadSchedule">
    			{{item.id}}
    		</td>
    		<td class="schedule-name-display" v-bind:data-id="item.id" v-on:click="loadSchedule">
    			{{ item.name }}
    		</td>
    		<td class="items-count" v-bind:data-id="item.id" v-on:click="loadSchedule">
    			{{ item.items.length }}
    		</td>
    		<td class="schedule-status" v-if="item.id == defaultScheduleId">
    			DEFAULT
    		</td>
    		<td class="schedule-status" v-else>
    			<span class="set-default-button" v-bind:data-id="item.id" v-on:click="setDefault">SET DEFAULT</span>
    		</td>
    		<td class="retire-schedule delete-button retire-schedule-button cannot-do-this-button" v-on:click="cannotRetire" v-if="item.id == defaultScheduleId">
    			-
    		</td>
    		<td class="retire-schedule delete-button retire-schedule-button" v-bind:data-id="item.id" v-on:click="retireSchedule" v-else>
    			DELETE
    		</td>
  		</tr>
	</table>
</div>
<div class="nothing-yet" v-else>
		<p><h1>- No HIIT Schedules -</h1></p>
		<p><h3>Press New Schedule To Get Started</h3></p>
</div>	
</template>
<script>
import { SCHEDULE_LIST_EVENTS } from "../src/constants";

export default {
	name: "ScheduleList",
    props: ['schedules', 'defaultScheduleId'],
    methods: {
        loadSchedule: function (event) {
            this.$emit(SCHEDULE_LIST_EVENTS.switchActiveSchedule, event);
        },
        setDefault: function (event) {
            this.$emit(SCHEDULE_LIST_EVENTS.setDefaultSchedule, event);
        },
        cannotRetire: function (event) {
            window.alert("Cannot Delete Default Schedule\nYou must set another schedule as default first.");
        },
        retireSchedule: function (event) {
            this.$emit(SCHEDULE_LIST_EVENTS.retireSchedule, event);
        },
    },
}	
</script>
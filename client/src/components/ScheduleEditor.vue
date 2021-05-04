<template>
	<div class="left-schedule-panel schedule-panel">
		<div class="sub-banner schedule-sub-banner">
			<div class="half-pane left-pane schedule-meta">
				<h2>Schedule:</h2>
				<span class="schedule-name">
					<input type="text" id="schedule-name" name="schedule-name" class="schedule-name-input" v-model="scheduleName"></input>
				</span>
			</div>
		</div>
		<div id="schedule" class="schedule-field" v-if="schedule.items.length">
			<table class="schedule-table">
				<tr v-for="item in schedule.items"
	                        v-bind:key="item.id"
	                        class="schedule-row">
	        		<td class="retire-report delete-button" v-bind:data-id="item.id" v-on:click="$emit(retireScheduleItem)">X</td>
	        		<td class="schedule-id">{{item.id}}</td>
	        		<td>
	        			<input type="text" maxlength="10" name="activity" v-model="item.activity" class="activity-input"></input>
	        		</td>
	        		<td>
	        			<input type="text" name="interval" v-bind:data-id="item.id" v-on:blur="$emit(updateInterval)" class="interval-input" v-bind:value="item.interval"></input>
	        		</td>
	        		<td>
	        			<span v-text="prettyTime(item.interval)"></span>
	        		</td>
	      		</tr>
			</table>
		</div>
		<div class="nothing-yet" v-else>
	  		<p><h1>- No HIIT Items Scheduled - Using Default -</h1></p>
	  		<p><h3>Press Add Schedule Item To Get Started</h3></p>
		</div>
		<div id="add-schedule-button" v-on:click="$emit(addScheduleItem)" class="timer-button schedule-button">
			+ ADD SCHEDULE ITEM
		</div>
	</div>
</template>
<script>
import { SCHEDULE_EDITOR_EVENTS } from "./scr/constants";
import { prettyTime	} from '../src/schedule';
export default {
  name: "ScheduleEditor",
  props: ['scheduleEdit'],
  data () {
	return SCHEDULE_EDITOR_EVENTS;
  },
  computed: {
    schedule: {
      get () {
        return Object.assign({}, this.scheduleEdit, {items: this.scheduleEdit.items});
      },
      set (value) {
        this.$store.commit('schedule/updateScheduleEdit', value);
      }
    },
    scheduleName: {
      get () {
        return this.schedule.name;
      },
      set (value) {
        this.$store.commit('schedule/updateScheduleEdit', {...this.schedule, name: value});
      }
    },
  },
  methods: {
  	prettyTime,
  },
}
</script>
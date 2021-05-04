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
	        		<td class="retire-report delete-button" v-bind:data-id="item.id" v-on:click="retire">X</td>
	        		<td class="schedule-id">{{item.id}}</td>
	        		<td>
	        			<input type="text" maxlength="10" name="activity" v-model="item.activity" class="activity-input"></input>
	        		</td>
	        		<td>
	        			<input type="text" name="interval" v-bind:data-id="item.id" v-on:blur="updateInterval" class="interval-input" v-bind:value="item.interval"></input>
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
		<div id="add-schedule-button" v-on:click="addScheduleItem" class="timer-button schedule-button">
			+ ADD SCHEDULE ITEM
		</div>
	</div>
</template>
<script>
import { prettyTime	} from '../src/schedule';
export default {
  name: "ScheduleEditor",
  props: ['scheduleEdit'],
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
   	addScheduleItem: function (event) {
  		const new_id = this.internalSchedule.items.map(item => item.id).reduce((itm, acc) => itm > acc ? itm : acc, 0) + 1;
  		this.schedule.items.push({id:new_id, activity:"Activity", interval: 5});
  	},
  	prettyTime,
	retire: function (event) {
  		const retire_id = event.currentTarget.dataset['id'];
  		this.$store.commit('schedule/', {...this.schedule, name: value});
  		this.schedule.items = this.internalSchedule.items.filter(item => item.id != retire_id);
	},
	updateInterval: function (event) {
  		const updated_id = event.currentTarget.dataset['id'];
  		const evaluated_value = eval(event.currentTarget.value);
  		event.currentTarget.value = evaluated_value;
  		this.schedule.items.filter(item => item.id == updated_id)[0].interval = evaluated_value;
  	},
  },
}
</script>
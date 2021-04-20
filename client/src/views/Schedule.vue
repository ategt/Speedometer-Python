<template>
	<div id="schedule-area" class="schedule-area">
		<div class="left-schedule-panel schedule-panel">
			<div class="sub-banner schedule-sub-banner">
				<div class="half-pane left-pane schedule-meta">
					<h2>Schedule:</h2>
					<span class="schedule-name">
						<input type="text" id="schedule-name" name="schedule-name" class="schedule-name-input" v-model="schedule.name"></input>
					</span>
				</div>
			</div>
			<div id="schedule" class="schedule-field" v-if="schedule.items.length">
				<table class="schedule-table">
					<tr v-for="(item, index) in schedule.items"
		                        v-bind:index="index"
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
		<div class="right-panel schedule-panel right-schedule-panel">
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

			<div id="schedule-list" class="schedule-field other-schedules-field" v-if="otherSchedules.length">
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
					<tr v-for="(item, index) in otherSchedules"
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

		</div>
	</div>
</template>

<script>

import axios from 'axios';

const schedule = {name: "Default",
				  default: true,
				  id: 0,
				  items:
				 	 [{id: 1, activity:"Warmup",    interval: 2*60},
	      	          {id: 2, activity:"Sprint!",   interval: 30},
	        	      {id: 3, activity:"Recover",   interval: 3*60},
	            	  {id: 4, activity:"Sprint!",   interval: 30},
		              {id: 5, activity:"Recover",   interval: 3*60},
	              	  {id: 6, activity:"Sprint!",   interval: 30},
	                  {id: 7, activity:"Recover",   interval: 3*60},
	              	  {id: 8, activity:"Sprint!",   interval: 30},
	              	  {id: 9, activity:"Recover",   interval: 3*60},
	              	  {id:10, activity:"Sprint!",   interval: 30},
	              	  {id:11, activity:"Cool Down", interval: 3*60}]
	              };

function loadScheduleFromStorage () {
	try{
		return JSON.parse(sessionStorage['schedule']);
	} catch (ex) {
		return schedule;
	}
}

Number.prototype.pad = function (size) {
	let s = String(this);
	while ( s.length < ( size || 2)) { s = "0" + s;}
	return s;
}


export default {
	  name: "Schedule",
	  data () {
	  	return {
	   		schedule: 'schedule' in sessionStorage ? loadScheduleFromStorage() : schedule,
	    	otherSchedules: new Object(),
	    	defaultScheduleId: 0,
	  	}
	  },
	  methods: {
	  	retire: function (event) {
	  		const retire_id = event.currentTarget.dataset['id'];
	  		this.schedule.items = this.schedule.items.filter(item => item.id != retire_id);
	  	},
	  	addScheduleItem: function (event) {
	  		const new_id = this.schedule.items.map(item => item.id).reduce((itm, acc) => itm > acc ? itm : acc, 0) + 1;
	  		this.schedule.items.push({id:new_id, activity:"Activity", interval: 5});
	  	},
	  	buildSchedule: function () {
	  		return this.schedule.items;
	  	},
	  	saveSchedule: function (event) {
			this.saveScheduleLocally(this.schedule);

			if (Object.keys(this.schedule).includes("id")) {
				this.updateSchedule(this.schedule);
			} else {
				this.createSchedule(this.schedule);
			}
	  	},
	  	saveAsSchedule: function (event) {
			this.saveScheduleLocally(this.schedule);
			this.createSchedule(this.schedule);
	  	},
	  	saveScheduleLocally: function (schedule) {
			sessionStorage['schedule'] = JSON.stringify(schedule);
	  	},
	  	createSchedule: function (schedule) {
	  		const context = this;
			axios.post("/schedules", {...schedule, created: +new Date()}).then(function (response) {
				context.loadOtherSchedules();
			});
	  	},
	  	updateSchedule: function (schedule) {
	  		const context = this;
			axios.patch("./schedules", {...schedule, updated: +new Date()}).then(function (response) {
				context.loadOtherSchedules();
			}).catch(function (error) {
				alert("Something went wrong - see log for details");
				console.error(error);
			});
	  	},
	  	newSchedule: function (event) {
			this.schedule = {name: "New Schedule",
				  			default: true,
				  			items: new Array()};
			
			const scheduleNameElement = document.getElementById("schedule-name");
			window.setTimeout(() => scheduleNameElement.select(), 100);
	  	},
	  	retireSchedule: function (event) {
	  		const retire_id = event.currentTarget.dataset['id'];
	  		this.otherSchedules = this.otherSchedules.filter(item => item.id != retire_id);
	  		axios.delete(`/schedules/${retire_id}`);
	  	},
	  	cannotRetire: function (event) {
	  		alert("Cannot Delete Default Schedule\nYou must set another schedule as default first.");
	  	},
	  	updateInterval: function (event) {
	  		const updated_id = event.currentTarget.dataset['id'];
	  		const evaluated_value = eval(event.currentTarget.value);
	  		event.currentTarget.value = evaluated_value;
	  		this.schedule.items.filter(item => item.id == updated_id)[0].interval = evaluated_value;
	  	},
	  	loadOtherSchedules: function () {
	  		const context = this;
	  		return new Promise(function (resolve, reject) {
	  			axios.get("/schedule").then(function (response) {
		  			context.otherSchedules = response.data.schedules;
		  			context.defaultScheduleId = response.data.default.id;
		  			resolve(response.data);
		  		});
	  		});
	  	},
	  	prettyTime: function (seconds) {
		    return `${Math.floor(seconds/60)}:${(seconds%60).pad(2)}`;
	  	},
	  	loadSchedule: function (event) {
			const schedule_id = event.currentTarget.dataset['id'];
			this.schedule = this.otherSchedules.filter(itm => itm.id == schedule_id)[0];
	  	},
	  	setDefault: function (event) {
			const schedule_id = parseInt(event.currentTarget.dataset['id']);
			this.defaultScheduleId = schedule_id;
			axios.put("./schedule", {id:schedule_id});
	  	},
	  },
	  computed: {},
	  mounted () {
	  	const context = this;
	  	this.loadOtherSchedules().then(function (data) {
		  	if (!('schedule' in sessionStorage)) {
		  		context.schedule = data.default;
		  	}
	  	});
	  },
	};
</script>
<style type="text/css">
</style>
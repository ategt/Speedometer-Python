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
		<div id="schedule" class="schedule-field" v-if="scheduleItems.length">
			<table class="schedule-table">
				<tr v-for="item in scheduleItems"
	                        v-bind:key="item.id"
	                        class="schedule-row">
	        		<td class="retire-report delete-button" v-bind:data-id="item.id" v-on:click="retireScheduleItem">X</td>
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
import { SCHEDULE_EDITOR_EVENTS } from "../shared/constants";
import { prettyTime	} from '../shared/schedule';

class ScheduleItem {
	constructor ({id, activity, interval, ...source}, changeCallback) {
		this._id = id;
		this._activity = activity;
		this._interval = interval;
		this._changeCallback = changeCallback;
		this._source = source;
	}

	get id () {
		return this._id;
	}

	get activity () {
		return this._activity;
	}

	set activity (value) {
		this._activity = value;
		this._changeCallback();
	}

	get interval () {
		return this._interval;
	}

	set interval (value) {
		this._interval = value;
	}

	toSource () {
		return {...this._source, id: this.id, activity: this.activity, interval: this.interval};
	}
}

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
      },
    },
    scheduleName: {
      get () {
        return this.schedule.name;
      },
      set (value) {
        this.$store.commit('schedules/updateActiveScheduleName', value);
      },
    },
    scheduleItems: {
      get () {
        return this.schedule.items.map(item => new ScheduleItem(item, this.changeCallback));
      },
      set (value) {
      	console.error(value);
      },
    },
  },
  methods: {
  	prettyTime,
  	changeCallback () {
  		this.$emit(SCHEDULE_EDITOR_EVENTS.scheduleItemsChanged, this.scheduleItems.map(item => item.toSource()));
  	},
	updateInterval (event) {
		this.$emit(SCHEDULE_EDITOR_EVENTS.updateInterval, event);
	},
	retireScheduleItem (event) {
		this.$emit(SCHEDULE_EDITOR_EVENTS.retireScheduleItem, event);
	},
	addScheduleItem (event) {
		this.$emit(SCHEDULE_EDITOR_EVENTS.addScheduleItem, event);
	},
  },
}
</script>